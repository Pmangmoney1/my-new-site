// ===============================
// 🔐 frelyn 관리자 계정 설정
// ===============================
const ADMIN_ID = "admin";     // 원하는 ID
const ADMIN_PW = "1234";      // 원하는 PW
const JWT_SECRET = "supersecretkey"; // 나중에 env로 이동 가능

// ===============================
// 🔐 JWT 생성 (Web Crypto API)
// ===============================
async function createJWT(payload, secret) {
  const encoder = new TextEncoder();

  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureArrayBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${header}.${body}`)
  );

  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureArrayBuffer)));

  return `${header}.${body}.${signature}`;
}

// ===============================
// 🧠 Worker 메인 핸들러
// ===============================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ===============================
    // 🔐 로그인 처리 (/login)
    // ===============================
    if (url.pathname === "/login" && request.method === "POST") {
      const { id, pw } = await request.json();

      if (id === ADMIN_ID && pw === ADMIN_PW) {
        const token = await createJWT(
          { id, exp: Date.now() + 1000 * 60 * 60 }, // 1시간 유효
          JWT_SECRET
        );

        return new Response(JSON.stringify({ token }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response("Unauthorized", { status: 401 });
    }

    // ===============================
    // 🔧 테스트용 update 엔드포인트
    // ===============================
    if (url.pathname.startsWith("/update")) {
      return new Response("update function ok", {
        status: 200,
        headers: { "content-type": "text/plain" }
      });
    }

    // ===============================
    // 📦 기본 정적 파일 처리
    // ===============================
    return env.ASSETS.fetch(request);
  }
};
