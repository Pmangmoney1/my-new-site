// functions/api/update.js
export async function onRequest(context) {
  const token = context.env.GITHUB_TOKEN;

  if (!token) {
    return new Response(JSON.stringify({ success: false, error: "GITHUB_TOKEN not found in env" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const owner = "Pmangmoney1";
  const repo = "my-new-site";
  const path = "content/site.json";
  const branch = "main";

  try {
    // Step 1: Get the current file SHA (required for updates)
    const getRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          "Authorization": `token ${token}`,   // "token" NOT "Bearer"
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "cloudflare-pages-function",
        },
      }
    );

    // ✅ Always check .ok before parsing
    if (!getRes.ok) {
      const errorText = await getRes.text();  // Read as TEXT for debugging
      return new Response(JSON.stringify({
        success: false,
        error: `GitHub GET failed (${getRes.status}): ${errorText}`,
      }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    const fileData = await getRes.json();
    const sha = fileData.sha;

    // Step 2: Parse the incoming request body
    const body = await context.request.json();
    const newContent = btoa(JSON.stringify(body.content || body, null, 2));

    // Step 3: Update the file
    const putRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `token ${token}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "cloudflare-pages-function",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update site.json via admin",
          content: newContent,
          sha: sha,
          branch: branch,
        }),
      }
    );

    if (!putRes.ok) {
      const errorText = await putRes.text();
      return new Response(JSON.stringify({
        success: false,
        error: `GitHub PUT failed (${putRes.status}): ${errorText}`,
      }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    const result = await putRes.json();
    return new Response(JSON.stringify({ success: true, commit: result.commit }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
