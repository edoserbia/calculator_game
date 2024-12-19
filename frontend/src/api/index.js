// 根据环境使用不同的API地址
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.3.157:8000/api'  // 开发环境使用你的主机IP
  : 'http://localhost:8000/api';     // 生产环境使用服务器地址

export const verifySecret = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-secret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    return await response.json();
  } catch (error) {
    console.error('验证秘籍失败:', error);
    return { valid: false, game_type: null };
  }
};

export const submitScore = async (score, playerName, gameType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score,
        player_name: playerName,
        game_type: gameType,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('提交分数失败:', error);
    throw error;
  }
};

export const getTopScores = async (gameType, limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/scores/top?game_type=${gameType}&limit=${limit}`
    );
    return await response.json();
  } catch (error) {
    console.error('获取排行榜失败:', error);
    return [];
  }
}; 