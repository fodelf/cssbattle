const chalk = require('chalk');
const execa = require('execa');
const path = require('path');
const run = async (command, commandArgs, opts = {}) => {
  await execa(command, commandArgs, { stdio: 'inherit', ...opts });
};
const step = (msg) => console.log(chalk.cyan(msg));
async function main() {
  step('\nbuildDocker...');
  await buildDocker();
  console.log(chalk.green(`ai docker 发布成功`));
}

async function buildDocker() {
  const cwd = path.join(path.resolve(__dirname, '..', '..'), 'cssbattle-ai');
  try {
    await run('docker', ['rmi', 'fodelf/cssbattle-ai'], { cwd: cwd });
  } catch (error) {
    console.log(error);
  }
  await run('docker', ['build', '-t', 'fodelf/cssbattle-ai', '.'], {
    cwd: cwd,
  });
  await run('docker', ['push', 'fodelf/cssbattle-ai']);
}

try {
  main();
} catch (error) {
  console.log(error);
  console.log(chalk.red(`任务失败`));
}
