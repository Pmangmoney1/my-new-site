// ===============================
// 🔐 frelyn 관리자 계정 설정
// ===============================
const ADMIN_ID = "admin";
const ADMIN_PW = "1234";
const JWT_SECRET = "supersecretkey";

// ===============================
// 🔐 Base64URL 인코딩 (Worker 100% 호환)
// ===============================
function base64urlEncode(uint8Array) {
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ===============================
// 🔐 JWT 생성 (Cloudflare Worker 공식 방식)
// ===============================
async function createJWT(payload, secret) {
  const encoder = new TextEncoder();

  const headerJson = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const payloadJson = JSON.stringify(payload);

  const header = base64urlEncode(encoder.encode(headerJson));
  const body = base64urlEncode(encoder.encode(payloadJson));

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${header}.${body}`)
  );

  const signature = base64urlEncode(new Uint8Array(signatureBuffer));

  return `${header}.${body}.${signature}`;
}

// ===============================
// 🧠 Worker 메인 핸들러
// ===============================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 🔐 로그인 처리
    if (url.pathname === "/login" && request.method === "POST") {
      const { id, pw } = await request.json();

      if (id === ADMIN_ID && pw === ADMIN_PW) {
        const token = await createJWT(
          { id, exp: Date.now() + 1000 * 60 * 60 },
          JWT_SECRET
        );

        return new Response(JSON.stringify({ token }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response("Unauthorized", { status: 401 });
    }

    // 테스트용 update
    if (url.pathname.startsWith("/update")) {
      return new Response("update function ok", {
        status: 200,
        headers: { "content-type": "text/plain" }
      });
    }

    // 정적 파일 처리
    return env.ASSETS.fetch(request);
  }
};
