export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("임시 코드가 없습니다.", { status: 400 });
  }

  // 깃허브 본사에 열쇠(Token) 요청
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const result = await response.json();

  if (result.error) {
    return new Response(`인증 실패: ${result.error_description}`, { status: 400 });
  }

  // 관리자 창(Decap CMS)에 열쇠 전달 후 팝업 닫기
  const token = result.access_token;
  const responseData = JSON.stringify({
    token: token,
    provider: 'github'
  });

  return new Response(
    `<html><body><script>
    (function() {
      var target = window.opener || window.parent;
      if (target) {
        // 인증 성공 신호를 보냅니다.
        target.postMessage('authorization:github:success:${responseData}', "*");
        window.close(); // 신호 전송 후 창 닫기
      } else {
        document.body.innerHTML = "관리자 창을 찾을 수 없습니다. 다시 시도해 주세요.";
      }
    })();
    </script></body></html>`,
    { headers: { "content-type": "text/html" } }
  );
}
