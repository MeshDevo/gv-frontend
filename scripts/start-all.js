import { spawn } from "child_process";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const frontendDir = resolve(__dirname, "..");
const backendDir = resolve(__dirname, "../../goldenvoice-backend/gv");

console.log("\n================================");
console.log("Starting Golden Voice Platform");
console.log("================================\n");

console.log(`Backend:  ${backendDir}`);
console.log(`Frontend: ${frontendDir}\n`);

let backendReady = false;
let frontendReady = false;

// Start backend
console.log("[1/2] Starting Backend on http://localhost:4000...");
const backend = spawn("npm", ["run", "dev"], {
  cwd: backendDir,
  stdio: "inherit",
  shell: true,
});

backend.on("error", (err) => {
  console.error("❌ Backend failed to start:", err);
  process.exit(1);
});

// Wait 3 seconds then start frontend
setTimeout(() => {
  console.log("\n[2/2] Starting Frontend on http://localhost:5173...");
  const frontend = spawn("npm", ["run", "dev"], {
    cwd: frontendDir,
    stdio: "inherit",
    shell: true,
  });

  frontend.on("error", (err) => {
    console.error("❌ Frontend failed to start:", err);
    process.exit(1);
  });

  console.log("\n================================");
  console.log("✓ Backend:  http://localhost:4000");
  console.log("✓ Frontend: http://localhost:5173");
  console.log("================================\n");
  console.log("Press Ctrl+C to stop both services\n");

  // Handle cleanup on exit
  process.on("SIGINT", () => {
    console.log("\n\nShutting down...");
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
}, 3000);

backend.on("exit", (code) => {
  if (code !== 0) {
    console.error(`\n❌ Backend exited with code ${code}`);
  }
});
