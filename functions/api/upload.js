export async function onRequestPost(context) {

  try {

    const formData =
      await context.request.formData();

    const file =
      formData.get("file");

    if (!file) {

      return Response.json({
        success: false,
        error: "No file"
      });

    }

    const cloudName =
      context.env.CLOUDINARY_CLOUD_NAME;

    const apiKey =
      context.env.CLOUDINARY_API_KEY;

    const apiSecret =
      context.env.CLOUDINARY_API_SECRET;



    const uploadForm =
      new FormData();

    uploadForm.append(
      "file",
      file
    );

    uploadForm.append(
      "upload_preset",
      "ml_default"
    );



    const upload =
      await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadForm
        }
      );



    const result =
      await upload.json();



    return Response.json({
      success: true,
      url: result.secure_url
    });

  } catch (e) {

    return Response.json({
      success: false,
      error: e.toString()
    });

  }

}
