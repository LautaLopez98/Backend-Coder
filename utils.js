import {fileURLToPath} from 'url';
import { dirname } from 'path';
import multer from 'multer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export default __dirname;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/public/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +"-"+ file.originalname )
    }
})

export const upload = multer({ storage: storage })

const SECRET="CoderLauta"
// export const generaHash=password=>crypto.createHmac("sha256", SECRET).update(password).digest("hex")
export const generaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validatePassword=(password, passwordHash)=>bcrypt.compareSync(password, passwordHash)