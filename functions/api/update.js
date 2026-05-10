export async function onRequestPost(context) {

  try {

    const data = await context.request.json();

    return new Response(
      JSON.stringify({
        success: true,
        data
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (e) {

    return new Response(
      JSON.stringify({
        success: false
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
