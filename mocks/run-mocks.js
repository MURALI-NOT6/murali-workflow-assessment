import { spawn } from "node:child_process";

const procs = [];

function run(name, cmd, args, env = {}) {
  const p = spawn(cmd, args, { stdio: "inherit", env: { ...process.env, ...env } });
  procs.push(p);
  p.on("exit", (code) => {
    console.log(`[${name}] exited with code`, code);
  });
}

run("slack-mock", "node", ["mocks/slack/server.js"]);
run("ms-mock", "node", ["mocks/microsoft/server.js"]);
run("failure-mock", "node", ["mocks/failure/server.js"]);

process.on("SIGINT", () => {
  for (const p of procs) p.kill("SIGINT");
  process.exit(0);
});
