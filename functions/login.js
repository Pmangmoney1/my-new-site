export async function onRequest(context) {
  const { request } = context;

  // POST 요청만 허용
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const data = await request.json();
  const { id, password } = data;

  // frelyn이 쓰던 로그인 정보 그대로 넣기
  const ADMIN_ID = "admin";
  const ADMIN_PW = "1234";

  if (id === ADMIN_ID && password === ADMIN_PW) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ success: false }), {
    headers: { "Content-Type": "application/json" }
  });
}
