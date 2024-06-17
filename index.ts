const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { EventEmitter } = require("events");
const assert = require("assert");
const { stdin } = require("process");

const ee = new EventEmitter();

const command = process.argv.slice(2).join(" ");
stdin.setEncoding("utf-8");
console.log(process.argv);

stdin.on("data", (data: string) => {
  console.log('input data:', data);
  let lastRun = 0;

  const files = data.split("\n").filter(Boolean);

  assert.ok(command, "You must provide a command to run");
  assert.ok(files.length, "You must provide at least one file to watch");

  files.forEach((file) => {
    const curDir = process.cwd();
    const fullFilePath = path.join(curDir, file);
    fs.watchFile(fullFilePath, { interval: 300 }, () => {
      console.log(`${file} changed`);
      ee.emit("change");
    });
  });

  ee.on("change", async () => {
    const now = Date.now();

    if (now - lastRun < 500) {
      return;
    }
    lastRun = now;
    // console.clear();
    const child = exec(command);

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

  ee.emit("change");
});
