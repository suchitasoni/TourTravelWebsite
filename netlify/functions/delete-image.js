import fetch from "node-fetch";

export const handler = async (event) => {
  try {
    const { imageUrl } = JSON.parse(event.body);

    if (!imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing imageUrl" }),
      };
    }

    // Extract public_id from Cloudinary image URL
    const regex = /\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z]+$/;
    const match = imageUrl.match(regex);

    if (!match) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid image URL" }),
      };
    }

    const publicId = match[1];
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    const result = await response.json();

    if (result.result === "ok") {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Image deleted" }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to delete image", result }),
      };
    }
  } catch (err) {
    console.error("Delete failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
