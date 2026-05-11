import { execSync } from 'node:child_process';
import { default as config } from "$lib/app-config";
import { pathSettings } from '$lib/server/settings';

//-- プロジェクトルートの絶対パス
const parentRoot = pathSettings.PrjRoot;

const execCommand = (command: string) => {
  const stdout = execSync(command);
  return stdout
};

function hasStderr(err: any): err is { stderr: Buffer } {
  return !!err.stderr;
}

/** ファイルの移動 */
export const moveFile = async (name: string = '', target: string, dest: string) => {
  let serverMsg = '';

  try {
    const command = `sleep 1; mv ${target} ${dest}/${name}`;
    let stdout = await execCommand(command);
    console.log('command stdout: ', stdout.toString());
    serverMsg = `>>> Move posts (${target}) to ${dest}.`;
    console.log(serverMsg);

    return {ok: true, message: serverMsg};
  } catch (err) {
    if (hasStderr(err)) {
      console.error('command stderr: ', err.stderr.toString());
      serverMsg = err.stderr.toString();
    }
    return {ok: false, message: serverMsg};
  }
};

/**
 * 記事リソースの再構築
 */
export const buildResources = async () => {
  let serverMsg = '';

  try {
    const command = `sleep 1; cd ${parentRoot}; npm run mdpst:resources-update;`;

    let stdout = await execCommand(command);

    console.log('command stdout: ', stdout.toString());
    serverMsg = '>>> Site resources updated.';
    console.log(serverMsg);

    return {ok: true, message: serverMsg};
  } catch (err) {
    if (hasStderr(err)) {
      console.error('command stderr: ', err.stderr.toString());
      serverMsg = err.stderr.toString();
    }
    return {ok: false, message: serverMsg};
  }
};

/**
 * 記事アーカイブの単独再構築
 * 対象の記事をセクションフォルダ付きでいったん作業ディレクトリに移してHTMLにビルド。
 * その後、もとの場所に戻す。
 */
export const buildArchive = async ({ section, postId }: { section: string; postId: string; }) => {
  let serverMsg = '';

  const mdFilePath = `${pathSettings.MdFilePath}`
  const orgPostPath = `${mdFilePath}/${section}`;
  const sectionIndexFile = `${orgPostPath}/${config.SectionIndexFile}`;
  const targetPost = `${orgPostPath}/${postId}`;
  const workDir = `${pathSettings.ArchiveWorkDir}/${section}`;
  const postInWork = `${workDir}/${postId}`; 

  try {
    let command = `sleep 1; mkdir -p ${workDir};`;
    command += `cp -u ${sectionIndexFile} ${workDir};`;
    command += `sleep 1; mv ${targetPost} ${workDir};`; 
    command += `cd ${parentRoot}; npm run hugo:postout-single;`;
    command += `sleep 1; mv ${postInWork} ${orgPostPath};`;

    let stdout = await execCommand(command);

    console.log('command stdout: ', stdout.toString());
    serverMsg = '>>> Build archive done.';
    console.log(serverMsg);

    return {ok: true, message: serverMsg};
  } catch (err) {
    if (hasStderr(err)) {
      console.error('command stderr: ', err.stderr.toString());
      serverMsg = err.stderr.toString();
    }
    return {ok: false, message: serverMsg};
  }
};

/**
 * 全ての記事のアーカイブを再構築
 */
export const buildAllArchives = async () => {
  let serverMsg = '';

  try {
    const command = `sleep 1; cd ${parentRoot}; npm run mdpst:archives-update;`;
    let stdout = await execCommand(command);

    console.log('command stdout: ', stdout.toString());
    serverMsg = '>>> Build archives done.';
    console.log(serverMsg);

    return {ok: true, message: serverMsg};
  } catch (err) {
    if (hasStderr(err)) {
      console.error('command stderr: ', err.stderr.toString());
      serverMsg = err.stderr.toString();
    }
    return {ok: false, message: serverMsg};
  }
};
