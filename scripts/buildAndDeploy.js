const Client = require("ssh2-sftp-client");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
require('dotenv').config({ 
  path: [path.join(__dirname, '.env.local'), path.join(__dirname, '.env')] 
})

const execPromise = util.promisify(exec);

const config = {
  host: "159.203.249.74",
  port: 22,
  username: "root",
  privateKey: require("fs").readFileSync(process.env["PRIVATE_KEY_PATH"]),
  passphrase: process.env["PRIVATE_KEY_PASSPHRASE"],
};

const sftp = new Client();

async function runYarnBuild() {
  try {
    console.log("Running yarn build...");
    const { stdout, stderr } = await execPromise("yarn build");
    console.log("yarn build output:", stdout);
    if (stderr) {
      console.error("yarn build stderr:", stderr);
    }
    console.log("yarn build completed successfully");
  } catch (error) {
    console.error("Error running yarn build:", error);
    throw error; // rethrow to stop the process if build fails
  }
}

async function deployBuild() {
  try {
    // First, run yarn build
    await runYarnBuild();

    // Then, connect to the server and deploy
    await sftp.connect(config);
    console.log("Connected successfully to remote server");

    // Local and remote paths
    const localPath = path.join(__dirname, "../build");
    const remotePath = "/var/www/html";

    // Upload the entire build directory
    await sftp.uploadDir(localPath, remotePath);
    console.log("Build uploaded successfully");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    sftp.end();
  }
}

deployBuild();
