export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1) /update 라우트 직접 처리
    if (url.pathname.startsWith("/update")) {
      return new Response("update function ok", {
        status: 200,
        headers: { "content-type": "text/plain" }
      });
    }

    // 2) 정적 파일 fallback (마지막에만 실행)
    return env.ASSETS.fetch(request);
  }
};
