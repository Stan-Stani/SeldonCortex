const { Marked } = require("marked");
const fs = require("fs/promises");
const path = require("path");
const marked = new Marked();

const blogPath = "public/blog";

(async function () {
  const files = await fs.readdir(blogPath);

  for (const file of files) {
    const filePath = path.join(blogPath, file);
    const stat = await fs.stat(filePath);

    const MD_EXT = ".md";
    if (stat.isFile() && path.extname(file) === MD_EXT) {
      const buffer = await fs.readFile(path.join(blogPath, file));
      const contentString = buffer.toString("utf8");
      const mkdwnString = marked.parse(contentString);

      fs.writeFile(path.join(blogPath, path.basename(file)), mkdwnString);
    }
  }
})();
