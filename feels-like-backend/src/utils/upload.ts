import multer from "multer";
import { Environment, environment, uploadsDir } from "../config";
import { mkdirSync, rmSync } from "node:fs";

export default multer({
  storage: multer.diskStorage({
    destination(_req, _file, callback) {
      if (environment === Environment.TEST) {
        rmSync(uploadsDir, { force: true, recursive: true });
      }

      mkdirSync(uploadsDir, { recursive: true });

      callback(null, uploadsDir);
    },
    filename(_req, file, callback) {
      const radix = 36;
      const trimLength = 2;
      const randomName = Math.random().toString(radix).substring(trimLength);
      const originalSuffix = file.originalname.split(".").pop();
      callback(null, `${randomName}.${originalSuffix}`);
    },
  }),
});
