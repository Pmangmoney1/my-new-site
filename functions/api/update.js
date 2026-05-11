export async function onRequestPost(context) {

  try {

    const body = await context.request.json();

    const token = context.env.GITHUB_TOKEN;

    const owner = "Pmangmoney1";
    const repo = "my-new-site";
    const path = "content/site.json";



    const getFile = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    const fileData = await getFile.json();

    const sha = fileData.sha;



    const content = btoa(
      unescape(
        encodeURIComponent(
          JSON.stringify(body, null, 2)
        )
      )
    );



    await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json"
        },
        body: JSON.stringify({
          message: "Update site.json",
          content,
          sha
        })
      }
    );



    return Response.json({
      success: true
    });

  } catch (e) {

    return Response.json({
      success: false,
      error: e.toString()
    });
  }
}
