import fs from "fs";
import type { APIRoute } from "astro";

const FILE_TYPE_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

export const POST: APIRoute = async ({ request, url, redirect }) => {
  const formData = await request.formData();

  const data = {
    file: formData.get("file") as File,
    url: formData.get("url") as string,
    id: formData.get("id") as string,
    alt: formData.get("alt") as string,
    filename: formData.get("filename") as string,
  };

  if (!data.file) throw new Error("No file provided");
  if (!data.url) throw new Error("No URL provided");
  if (!data.id) throw new Error("No ID provided");
  if (!data.filename) throw new Error("No filename provided");

  const slug = new URL(data.url).pathname.split("/").filter(Boolean).pop();

  // Identify the source file
  const sourceFilePath = `./src/content/blog/${slug}.mdx`;
  const sourceFile = fs.readFileSync(sourceFilePath, "utf-8");
  const componentString = sourceFile.match(/<Uploader\s+id="(\d+)"\s*\/>/)?.[0];

  if (!componentString) {
    throw new Error("No Uploader component found in source file");
  }

  // Create folder for the post if it doesn't exist
  const imageDirname = `./public/images/${slug}`;
  if (!fs.existsSync(imageDirname)) {
    fs.mkdirSync(imageDirname, { recursive: true });
  }

  // Save the file to the folder
  const filename = `${data.filename}.${FILE_TYPE_MAP[data.file.type]}`;
  const file = Buffer.from(await data.file.arrayBuffer());
  const imageFilePath = `${imageDirname}/${filename}`;
  fs.writeFileSync(imageFilePath, file);

  // Replace the Uploader component with the image
  const newComponentString = `![${data.alt || ""}](${imageFilePath.replace(
    "./public",
    ""
  )})`;
  const newSourceFile = sourceFile.replace(componentString, newComponentString);
  fs.writeFileSync(sourceFilePath, newSourceFile);

  return redirect(data.url);
};
