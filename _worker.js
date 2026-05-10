export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/update")) {
      return new Response("update function ok", {
        status: 200,
        headers: { "content-type": "text/plain" }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
