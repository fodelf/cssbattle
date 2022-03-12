/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2021-10-19 15:06:28
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-12 11:03:04
 */
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const execa = require('execa');
const { uploadOss } = require('./upload.js');
const run = async (command, commandArgs, opts = {}) => {
  await execa(command, commandArgs, { stdio: 'inherit', ...opts });
};
var targetVersion = '0.0.0';
const step = (msg) => console.log(chalk.cyan(msg));
const args = require('minimist')(process.argv.slice(2));
async function main() {
  step('\nUpdateVersion...');
  await updateVersion();
  step('\nUpdateConfig...');
  await updateConfig();
  step('\nBuildPackage...');
  await buildPackage();
  console.log(chalk.green(`静态资源构建完成`));
  step('\nUploadOss...');
  await uploadOss();
  console.log(chalk.green(`oss 上传成功`));
  step('\nbuildDocker...');
  await buildDocker();
  console.log(chalk.green(`docker 发布成功`));
}

async function buildDocker() {
  try {
    await run('docker', ['rmi', 'fodelf/cssbattleweb']);
  } catch (error) {
    console.error(error);
  }
  await run('docker', [
    'build',
    '-t',
    'fodelf/cssbattleweb',
    '--platform',
    'linux/amd64',
    '.',
  ]);
  await run('docker', ['push', 'fodelf/cssbattleweb']);
}

async function buildPackage() {
  await run('npm', ['run', 'build']);
  const { stdout } = await execa('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');
    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', `chore(all): release v${targetVersion}`]);
  } else {
    console.log(chalk.green('No changes to commit.'));
  }
}

async function updateVersion() {
  const pkgPath = path.resolve(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const currentVersion = pkg.version;
  console.log(chalk.green(`线上版本号${currentVersion}`));
  let versions = currentVersion.split('.');
  versions[2] = Number(versions[2]) + 1;
  targetVersion = versions.join('.');
  console.log(chalk.green(`发布版本号${targetVersion}`));
  pkg.version = targetVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

async function updateConfig() {
  const jsPath = path.resolve(__dirname, '../.umirc.ts');
  var data = fs.readFileSync(jsPath, 'utf8');
  const pkgPath = path.resolve(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  data = data.replace(
    /(\wuwenzhou.*?\/lsp.js')/g,
    `wuwenzhou.com.cn/web/${pkg.version}/lsp.js'`,
  );
  data = data.replace(
    /(\wuwenzhou.*?\/favicon.ico')/g,
    `wuwenzhou.com.cn/web/${pkg.version}/favicon.ico'`,
  );
  data = data.replace(
    /(\wuwenzhou.*?\/')/g,
    `wuwenzhou.com.cn/web/${pkg.version}/'`,
  );
  fs.writeFileSync(jsPath, data);
  console.log(chalk.green(`修改配置文件完成`));
}
try {
  main();
} catch (error) {
  console.log(error);
  console.log(chalk.red(`任务失败`));
}
