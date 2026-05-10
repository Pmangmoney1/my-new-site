export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

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
  const responseData = JSON.stringify({ token: result.access_token, provider: 'github' });

  return new Response(
    `<html><body><script>
    (function() {
      var target = window.opener || window.parent;
      target.postMessage('authorization:github:success:${responseData}', "*");
      window.close();
    })();
    </script></body></html>`,
    { headers: { "content-type": "text/html" } }
  );
}
