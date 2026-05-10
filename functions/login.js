export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { id, pw } = await request.json();

    if (id === "admin" && pw === "124124") {
      const token = await new SignJWT({ user: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("2h")
        .sign(env.JWT_SECRET);

      return new Response(JSON.stringify({ token }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Unauthorized", { status: 401 });
  }
};
