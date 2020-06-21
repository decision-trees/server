import { PathLike, existsSync, promises } from "fs";

const { mkdir } = promises;

export async function ensureDirectory(directory: PathLike): Promise<void> {
  if (!existsSync(directory)) {
    await mkdir(directory, { recursive: true });
  }
}
