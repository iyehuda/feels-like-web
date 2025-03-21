import multer from "multer";
import { Environment, environment, uploadsDir } from "../config";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { unlink } from "node:fs/promises";

function createFilename(originalName: string): string {
  const radix = 36;
  const trimLength = 2;
  const randomName = Math.random().toString(radix).substring(trimLength);
  const originalSuffix = originalName.split(".").pop();
  return `${randomName}.${originalSuffix}`;
}

export function getFilePath(): string {
  return path.join(uploadsDir, createFilename(".png"));
}

export async function tryRemoveFile(filePath: string): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    await unlink(fullPath);
  } catch (error) {
    // Ignore errors when file doesn't exist
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

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
      callback(null, createFilename(file.originalname));
    },
  }),
});
