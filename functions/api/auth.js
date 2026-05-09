// [auth.js] 깃허브 로그인 버튼을 누르면 실행되는 코드
export async function onRequestGet(context) {
  // 1. Cloudflare에 저장한 환경변수(ID, Secret)를 가져옵니다.
  const { env } = context;
  const client_id = env.GITHUB_CLIENT_ID;
  
  // 2. 의뢰인을 깃허브의 로그인 승인 페이지로 강제로 보냅니다(리다이렉트).
  // scope=repo,user 는 "이 사람에게 내 코드를 수정할 권한을 주겠다"는 뜻입니다.
  return Response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`,
    302
  );
}