// ===============================
// 🔐 frelyn 관리자 계정 설정
// ===============================
const ADMIN_ID = "admin";
const ADMIN_PW = "1234";
const JWT_SECRET = "supersecretkey";

// ===============================
// 🔐 Base64URL 인코딩
// ===============================
function base64url(arrayBuffer) {
  let str = "";
  const bytes = new Uint8Array(arrayBuffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ===============================
// 🔐 JWT 생성 (Cloudflare Worker 전용)
// ===============================
async function createJWT(payload, secret) {
  const encoder = new TextEncoder();

  const header = base64url(encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));

  const body = base64url(encoder.encode(JSON.stringify(payload)));

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

  const signature = base64url(signatureArrayBuffer);

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
