import Client from "ssh2-sftp-client"
import { join, extname } from "path"
import { exec } from "child_process"
import { promisify } from "util"
import { readdir } from "fs/promises"
import dotenv from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: [join(__dirname, ".env.local"), join(__dirname, ".env")],
})

const execPromise = promisify(exec)

const config = {
  host: "159.203.249.74",
  port: 22,
  username: "root",
  privateKey: fs.readFileSync(process.env["PRIVATE_KEY_PATH"]),
  passphrase: process.env["PRIVATE_KEY_PASSPHRASE"],
}

const sftp = new Client()
sftp.client.setMaxListeners(0)

async function runYarnBuild() {
  try {
    console.log("Running yarn build...")
    const { stdout, stderr } = await execPromise("yarn build")
    console.log("yarn build output:", stdout)
    if (stderr) {
      console.error("yarn build stderr:", stderr)
    }
    console.log("yarn build completed successfully")
  } catch (error) {
    console.error("Error running yarn build:", error)
    throw error // rethrow to stop the process if build fails
  }
}

async function deployBuild() {
  try {
    // First, run yarn build
    await runYarnBuild()

    // Then, connect to the server and deploy
    await sftp.connect(config)
    console.log("Connected successfully to remote server")

    // Local and remote paths
    const localPath = join(__dirname, "../build")
    const remotePath = "/var/www/html"

    // Upload the entire build directory
    await sftp.uploadDir(localPath, remotePath)
    console.log("Build uploaded successfully")

    // Copy .md blog files to Gemini protocol server
    console.log("Uploading to Gemini Server")

    const localBlogPath = "./public/blog"
    const dirEnt = await readdir(localBlogPath, { withFileTypes: true })

    for (const de of dirEnt) {
      if (de.isFile && extname(de.name) === ".md") {
        const res = await sftp.put(
          localBlogPath + "/" + de.name,
          "/root/gemini/public/gemlog/" + de.name
        )
        console.log(res)

        console.log("Removing .gmi file if it exists already")
        sftp.delete(
          "/root/gemini/public/gemlog/" +
            path.basename(de.name, ".md") +
            ".gmi",
          true
        )

        // We expect an error on rename if the file already exists
        let resRename = ""
        try {
          resRename = await sftp.rename(
            "/root/gemini/public/gemlog/" + de.name,
            "/root/gemini/public/gemlog/" +
              path.basename(de.name, ".md") +
              ".gmi"
          )
        } catch (error) {
          console.log(error)
        }
        console.log(resRename)
      }
    }
  } catch (err) {
    console.error("Error:", err)
  } finally {
    sftp.end()
  }
}

deployBuild()
