// [callback.js] 깃허브 로그인이 완료된 후 돌아왔을 때 실행되는 코드
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 1. 깃허브에서 보내준 임시 코드를 확인합니다.
  const code = url.searchParams.get("code");

  // 2. 이 임시 코드를 깃허브 본사에 보내서 "진짜 열쇠(Token)"로 바꿉니다.
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,     // 아까 등록한 Client ID
      client_secret: env.GITHUB_CLIENT_SECRET, // 아까 등록한 Client Secret
      code, // 임시 코드
    }),
  });

  // 3. 깃허브 본사에서 보내준 열쇠 데이터를 읽습니다.
  const result = await response.json();

  // 4. 이 열쇠를 웹사이트 관리자(Decap CMS) 창에 전달하고 창을 닫는 자바스크립트를 실행합니다.
  return new Response(
    `<html><body><script>
    (function() {
      var target = window.opener || window.parent;
      // 관리자 화면에 "로그인 성공! 여기 열쇠(token)가 있습니다"라고 소리치는 부분입니다.
      target.postMessage('authorization:github:success:${JSON.stringify({
        token: result.access_token,
        provider: 'github'
      })}', "*");
    })();
    </script></body></html>`,
    { headers: { "content-type": "text/html" } }
  );
}