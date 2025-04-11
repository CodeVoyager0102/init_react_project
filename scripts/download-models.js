const fs = require('fs');
const path = require('path');
const https = require('https');

// 模型文件列表
const modelFiles = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
];

// 模型文件的基础URL
const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// 确保目录存在
const modelsDir = path.join(__dirname, '../public/models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// 下载文件
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // 删除不完整的文件
      console.error(`Error downloading ${url}: ${err.message}`);
      reject(err);
    });
  });
}

// 下载所有模型文件
async function downloadModels() {
  console.log('开始下载face-api.js模型文件...');
  
  for (const file of modelFiles) {
    const url = `${baseUrl}/${file}`;
    const dest = path.join(modelsDir, file);
    
    try {
      await downloadFile(url, dest);
    } catch (error) {
      console.error(`下载 ${file} 失败:`, error);
    }
  }
  
  console.log('模型文件下载完成！');
}

// 执行下载
downloadModels().catch(console.error); 