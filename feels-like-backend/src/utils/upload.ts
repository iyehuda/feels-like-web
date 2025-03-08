import multer from "multer";
import { uploadsDir } from "../config";

export default multer({ dest: uploadsDir });
