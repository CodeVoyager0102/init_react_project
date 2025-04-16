// 验证state
const verifyState = (platform, state) => {
  const savedState = localStorage.getItem(`${platform}_oauth_state`);
  return savedState === state;
};

// 处理OAuth回调
export const handleOAuthCallback = async (platform, code, state) => {
  // 验证state
  if (!verifyState(platform, state)) {
    throw new Error("Invalid state");
  }

  try {
    // 调用后端API，用code换取access_token和用户信息
    const response = await fetch("/api/oauth/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform,
        code,
        state,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("OAuth callback error:", error);
    throw error;
  }
};
