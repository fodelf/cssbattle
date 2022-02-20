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
  console.log(chalk.green(`server docker 发布成功`));
}

async function buildDocker() {
  const cwd = path.join(
    path.resolve(__dirname, '..', '..'),
    'cssbattle-server',
  );
  try {
    await run('docker', ['rmi', 'fodelf/cssbattle-server'], { cwd: cwd });
  } catch (error) {}
  await run(
    'docker',
    [
      'build',
      '-t',
      'fodelf/cssbattle-server',
      '--platform',
      'linux/amd64',
      '.',
    ],
    {
      cwd: cwd,
    },
  );
  await run('docker', ['push', 'fodelf/cssbattle-server']);
}

try {
  main();
} catch (error) {
  console.log(error);
  console.log(chalk.red(`任务失败`));
}
