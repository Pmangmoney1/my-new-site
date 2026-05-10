export async function onRequestGet(context) {
  const { env } = context;
  return Response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&scope=repo,user`,
    302
  );
}
