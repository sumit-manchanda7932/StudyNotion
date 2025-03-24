// const cloudinary =require("cloudinary").v2

// exports.uploadImageToCloudinary = async(file ,folder,height,quality)=>{
//     try{
//         const options={folder};
//         if(height){
//             options.height =height;
//         }
//         if(quality){
//             options.quality=quality;
//         }
//         options.resource_type="auto";
//         return await cloudinary.uploader.upload(file.tempFilePath,options);
//     }
//     catch(error){
//          console.log(error);
//     }
// }


const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        const options = {
            folder,
            resource_type: "auto", // Auto-detect file type (image, video, etc.)
        };

        if (height) options.height = height;
        if (quality) options.quality = quality;

        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload to Cloudinary");
    }
};
