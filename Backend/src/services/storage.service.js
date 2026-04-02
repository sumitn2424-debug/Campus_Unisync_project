const {ImageKit} = require('@imagekit/nodejs')

const imageKitClient = new ImageKit({
    privateKey:process.env.IMAGE_KIT_PRIVATE_KEY
})

const uploadFile = async (file)=>{
    const result = await imageKitClient.files.upload({
        file,
        fileName:`image ${Date.now()}`,
        folder: `Unisync/images`
    })

    return result
}


module.exports = uploadFile;