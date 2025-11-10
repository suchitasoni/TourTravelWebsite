// Netlify functions run in Node 18+, which already includes `fetch`
import crypto from "crypto";

export const handler = async (event) => {
  try {
    const { imageUrl, public_id } = JSON.parse(event.body || "{}");

    // 1️⃣ Read Cloudinary credentials from Netlify environment
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Missing Cloudinary credentials in environment.");
    }

    // 2️⃣ Derive the public_id if only imageUrl was provided
    let finalPublicId = public_id;
    if (!finalPublicId && imageUrl) {
      // Example URL: https://res.cloudinary.com/demo/image/upload/v1700000000/folder/imgname.jpg
      const regex = new RegExp(`https://res\\.cloudinary\\.com/${cloudName}/image/upload/(?:v\\d+/)?(.+?)\\.[a-zA-Z]+$`);
      const match = imageUrl.match(regex);
      if (!match) throw new Error("Could not extract public_id from imageUrl");
      finalPublicId = match[1];
    }

    if (!finalPublicId) {
      throw new Error("No public_id or imageUrl provided.");
    }

    // 3️⃣ Create Cloudinary signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHash("sha1")
      .update(`public_id=${finalPublicId}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    // 4️⃣ Send signed request to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        public_id: finalPublicId,
        api_key: apiKey,
        timestamp,
        signature,
      }),
    });

    const result = await response.json();

    // 5️⃣ Handle Cloudinary response
    if (result.result !== "ok") {
      throw new Error(result.error?.message || "Cloudinary deletion failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, public_id: finalPublicId, result }),
    };
  } catch (err) {
    console.error("Delete image error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
