import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { ApiError } from "./cutomResponse.js";

const uploadImage = async (imagePath, folder = "") => {

    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };
    if (folder) {
        options.folder = "ems(learning)/" + folder;
    }
    try {
        console.log('imagePath', imagePath)
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        console.log(result)
        const secureUrl = result.url;
        if (secureUrl) {
            fs.unlinkSync(imagePath);
        }
        return secureUrl;
    } catch (error) {
        console.error(error);
        throw error; // rethrow to handle in caller
    }
};

export const deleteImage = async (url) => {
    try {
        console.log('url', url)
        const parts = url.split("/upload/")[1];
        const encodedePublic_id = parts.replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
        const public_id = decodeURIComponent(encodedePublic_id)
        if (!public_id) throw new ApiError(500, "Please pass file public_id.")
        console.log('public_id', public_id)
        const { result } = await cloudinary.uploader.destroy(public_id)
        console.log('destroy result', result)
        if (result !== "ok") throw new ApiError(500, "Unable to delete from cloudinary")
        return true

    } catch (error) {
        console.error(error);
        throw error; // rethrow to handle in caller

    }


}
export { uploadImage }