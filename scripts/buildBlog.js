import { Marked } from "marked"
import { readdir, stat as _stat, readFile, writeFile } from "fs/promises"
import { join, extname, basename } from "path"
const marked = new Marked()

const blogPath = "public/blog"

;(async function () {
  const files = await readdir(blogPath)

  for (const file of files) {
    const filePath = join(blogPath, file)
    const stat = await _stat(filePath)

    const MD_EXT = ".md"
    if (stat.isFile() && extname(file) === MD_EXT) {
      const buffer = await readFile(join(blogPath, file))
      const contentString = buffer.toString("utf8")
      const mkdwnString = marked.parse(contentString)

      writeFile(join(blogPath, basename(file, "md") + "html"), mkdwnString)
    }
  }
})()
