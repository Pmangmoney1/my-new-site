export async function onRequestGet(context) {
  const { env } = context;
  const client_id = env.GITHUB_CLIENT_ID;
  
  // 깃허브 승인 페이지로 리다이렉트
  return Response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`,
    302
  );
} // <- 이 닫는 괄호가 반드시 있어야 합니다.
