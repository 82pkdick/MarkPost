import { cwd } from 'node:process';
import path from 'path';
import { default as config } from '$lib/app-config';

//-- プロジェクトルートの絶対パス
const prjRoot = cwd();

const postTemplatePath = path.join(cwd(), `../${config.PostTemplate}`); 

export const getPrjRoot = () => {
  return prjRoot;
}

export const getTemplPath = () => {
  return postTemplatePath;
};

/**
 * ここに設定関連のパスを返す関数をつくり export する
 * 一番トップの src/routes/+layout.server.ts で、その関数を実行して 
 * 値を data として load 関数で返す
 * クライアントからは $props() で data を受け取って利用
 */