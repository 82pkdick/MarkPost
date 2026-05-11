import { execSync } from 'node:child_process';
import { default as config } from "$lib/app-config";
import { pathSettings } from '$lib/server/settings';
import createNewPost from '$lib/mark-downloader/mark-downloader';
import downloadPageMedia from '$lib/mark-downloader/media-downloader';

//-- アプリケーションのルートパス
const appRoot = pathSettings.AppRoot;
//-- プロジェクトルートの絶対パス
const parentRoot = pathSettings.PrjRoot;

//-- MarkDownloader が書き出した新規記事のパス
const defaultSection = config.DefaultSection;
const newPostPath = `${pathSettings.ArchiveWorkDir}/${defaultSection}`;

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
    const command = `sleep 10; cd ${parentRoot}; npm run mdpst:resources-update;`;

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


/**
 * MarkDownloader の実行
 */
const mainDownload = async (postId: string, url: string) => {
  try {
    const result = await createNewPost({ postId: postId, source: url });
    if (result?.ok) {
      return { success: true, message: 'New post created successfully.'};
    } else {
      const errorMsg = 'Failed to create a new post.';
      throw new Error(errorMsg);
    }
  } catch (error) {
    let err_message = '';
    if (error instanceof Error) {
      err_message = error.message;
    } else {
      err_message = `${error}`;
    }
    return { success: false, message: err_message};;
  }
};

export const markDownload = async (srcUrl: string, postId: string) => {
  const result = await mainDownload(postId, srcUrl);
  const serverMsg = result.message;

  if (result.success) {
    console.log(serverMsg);
    return { ok: true, message: serverMsg };
  } else {
    console.error(serverMsg);
    return { ok: false, message: serverMsg };
  }
};

export const mediaDownload = async (postId: string) => {
  console.log('>>>> Start downloading new post resources.');

  const defaultSection = config.DefaultSection;

  try {
    const result = await downloadPageMedia( postId, appRoot );
    return { ok: true, message: 'download resources for the new post success.' };
  } catch (error) {
    let errMsg = '';
    if (error instanceof Error) {
      errMsg = error.message;
    } else {
      errMsg = `${error}`;
    }
    console.error(errMsg);
    return { ok: false, message: errMsg };
  }
};

/**
 * MarkDownloader のデフォルト保存先を`content-original/unsorted`にしているため、MarkDownloader で新規記事を作成した後の処理は、`content-original/unsorted`から`work/unsorted`に移動し、アーカイブを作成、その後`content-original/unsorted`に戻す処理になるため、`buildArchive`で代用可能になった。
 * 
 * 新規記事アーカイブの単独再構築
 * MarkDownloader は設定ファイルによって新規記事を`work/unsorted`に書き出すので、
 * そこからHTMLにビルド。その後、`content-original/unsorted`に移動。
 * 記事リソースの再構築(buildResources)の実行より先に行う必要がある。
 */
// export const createNewArchive = async () => {
//   const workDir = newPostPath;
//   let serverMsg = '';

//   const mdFilePath = `${pathSettings.MdFilePath}`
//   const orgPostPath = `${mdFilePath}/${defaultSection}`;
//   const sectionIndexFile = `${orgPostPath}/${config.SectionIndexFile}`;

//   try {
//     let command = `sleep 1; mkdir -p ${workDir};`;
//     command += `cp -u ${sectionIndexFile} ${workDir};`;
//     command += `cd ${parentRoot}; npm run hugo:postout-single;`;
//     command += `sleep 5; npm run workpost-mvto-origin`;

//     let stdout = await execCommand(command);

//     console.log('command stdout: ', stdout.toString());
//     serverMsg = '>>> Create new post archive done.';
//     console.log(serverMsg);

//     return {ok: true, message: serverMsg};
//   } catch (err) {
//     if (hasStderr(err)) {
//       console.error('command stderr: ', err.stderr.toString());
//       serverMsg = err.stderr.toString();
//     }
//     return {ok: false, message: serverMsg};
//   }
// };