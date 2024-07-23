import dotenv from "dotenv";

dotenv.config(
    {
        path: `./src/.env`,
        override: true
    }
);

export const config = {
    PORT: process.env.PORT||8081,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_URL_COMPLETE: process.env.MONGO_URL_COMPLETE,
    DB_NAME: process.env.DB_NAME,
    SECRET:process.env.SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    GMAIL_PASS: process.env.GMAIL_PASS,
    MODE: process.env.MODE,
}