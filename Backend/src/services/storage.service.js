const {ImageKit} = require('@imagekit/nodejs')

const imageKitClient = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY, // required
});

const uploadFile = async (file) => {
  try {
    const result = await imageKitClient.files.upload({
      file, // can be Buffer or Base64 string
      fileName: `image_${Date.now()}`,
      folder: "Unisync/images",
    });

    console.log("ImageKit Upload Result:", result); // 🔹 must log result
    return result; // result.url will have uploaded file URL
  } catch (err) {
    console.error("ImageKit Upload Error:", err);
    throw err;
  }
};

module.exports =  uploadFile ;