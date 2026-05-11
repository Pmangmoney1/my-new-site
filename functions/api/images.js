export async function onRequestGet(context) {

  const cloudName =
    context.env.CLOUDINARY_CLOUD_NAME;

  const apiKey =
    context.env.CLOUDINARY_API_KEY;

  const apiSecret =
    context.env.CLOUDINARY_API_SECRET;

  const auth =
    btoa(`${apiKey}:${apiSecret}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`,
    {
      headers:{
        Authorization:`Basic ${auth}`
      }
    }
  );

  const data = await res.json();

  return Response.json(
    data.resources.map(img=>img.secure_url)
  );

}
