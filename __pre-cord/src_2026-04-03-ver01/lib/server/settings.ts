import { cwd } from 'node:process';
import path from 'node:path';
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

