export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1) /update 라우트 처리
    if (url.pathname.startsWith("/update")) {
      return new Response("update function ok", {
        status: 200,
        headers: { "content-type": "text/plain" }
      });
    }

    // 2) /admin 보호 (로그인 기능 나중에 추가)
    if (url.pathname.startsWith("/admin")) {
      return env.ASSETS.fetch(request);
    }

    // 3) /login 페이지
    if (url.pathname.startsWith("/login")) {
      return env.ASSETS.fetch(request);
    }

    // 4) 정적 파일 fallback
    return env.ASSETS.fetch(request);
  }
};
