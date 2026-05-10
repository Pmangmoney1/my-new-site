export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1) /update 라우트 직접 처리
    if (url.pathname === "/update" || url.pathname.startsWith("/update")) {
      return new Response("update function ok", {
        status: 200,
        headers: { "content-type": "text/plain" }
      });
    }

    // 2) 나머지는 정적 파일로 처리
    return env.ASSETS.fetch(request);
  }
};
