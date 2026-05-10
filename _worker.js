export default {
  async fetch(request, env, ctx) {
    // 1) Functions 먼저 실행
    const response = await env.FUNCTIONS.fetch(request);
    if (response.status !== 404) return response;

    // 2) 정적 파일 fallback
    return env.ASSETS.fetch(request);
  }
};
