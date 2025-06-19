// 测试用户认证帮助工具
export const authenticateTestUser = (username: string, role: string) => {
  const mockToken = `test_token_${username}_${Date.now()}`;

  // 存储认证信息
  localStorage.setItem("access_token", mockToken);
  localStorage.setItem("cyberguard_user_role", role);
  localStorage.setItem("cyberguard_user_color", getColorForRole(role));

  return mockToken;
};

const getColorForRole = (role: string) => {
  switch (role) {
    case "超级管理员":
      return "text-neon-purple";
    case "安全管理员":
      return "text-neon-blue";
    case "数据分析师":
      return "text-neon-green";
    case "系统操作员":
      return "text-neon-orange";
    default:
      return "text-neon-blue";
  }
};
