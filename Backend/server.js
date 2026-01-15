import { configDotenv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { app } from "./app.js";
import { connection } from "./src/db/connection.js";

configDotenv();
const PORT = process.env.PORT || 4000;

connection();

cloudinary.config({
    secure: true,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME,
});

app.listen(PORT, () => {
    console.log(`Server is at http://localhost:${PORT}`);
});
