import { cwd } from 'node:process';
import path from 'node:path';
import fs from "node:fs";
import { json } from "@sveltejs/kit";
import { default as config } from '$lib/app-config';

//-- アプリケーションのルートパス
const applicationRoot = cwd();

//-- プロジェクトルートの絶対パス
const projectRoot = path.join(applicationRoot, '..');

export const pathSettings = {
  approot: applicationRoot,
  prjroot: projectRoot,

  get AppRoot() {
    return this.approot;
  },
  get PrjRoot() {
    return this.prjroot;
  },
  get MdFilePath() {
    const path = `${this.prjroot}/${config.PostMdFilePath}`;
    return path;
  },
  get HtmlFilePath() {
    const path = `${this.prjroot}/${config.PostHtmlFilePath}`;
    return path;
  },
  get ArchiveWorkDir() {
    const path = `${this.prjroot}/${config.ArchiveWorkDir}`;
    return path;
  },
  get TrashFolder() {
    const path = `${this.prjroot}/${config.TrashFolder}`;
    return path;
  },
  get TrashHtmlFolder() {
    const path = `${this.prjroot}/${config.TrashFolder}/html`;
    return path;
  },
  get PostTemplate() {
    const path = `${this.approot}/${config.PostTemplate}`;
    return path;
  },
  get MarkDownloaderCommandPath() {
    const path = `${this.prjroot}/${config.MarkDownloaderPath}`;
    return path;
  },
  get MarkDownloaderMedialist() {
    const path = `${this.prjroot}/${config.MarkDownloaderMedialist}`;
    return path;
  }
};

export type TypesPathSettings = typeof pathSettings;

// export const archiveExistsOr = async ( postId: string ) => {

  //-- アーカイブファイルの場所
  // const htmlFilePath = pathSettings.HtmlFilePath;
  // const postAcvFileDir = `${htmlFilePath}/${postId}`

  // console.log('File Util 01:  postAcvFileDir: ', postAcvFileDir);

  //--- 対象のファイルが存在するかどうか
  // if (fs.existsSync(postAcvFileDir)) {
    // return json({ ok: true, message: 'The archive exists.' }, { status: 200 });
  // } else {
    // return json({ ok: false, message: 'There is no archive.' }, { status: 404 });
  // }
// };
