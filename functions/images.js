export async function onRequestGet() {

  const images = [

    "/uploads/sample1.jpg",
    "/uploads/sample2.jpg",
    "/uploads/sample3.jpg"

  ];

  return new Response(JSON.stringify(images), {
    headers: {
      "Content-Type": "application/json"
    }
  });

}
