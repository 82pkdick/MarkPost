import { resolve } from '$app/paths';
import { default as config } from '$lib/app-config';

//-- タイムスタンプ数値を得る
export const getTimeStamp = () => {
  const timestamp = Math.floor(Date.now() / 1000);
  return timestamp;
};

/** _resources で始まる画像の相対URLを絶対URLに
 * pid: postId
 * md: markdown string
 * 各記事の画像の場所 : /html-posts/[postId]/_resources/[画像ファイル名]
 */
export const fixImageRelUrl = (pid: string, md: string) => {
  const baseUrl = delTrSlash(resolve('/'));
  const fixed = md.replace(/_resources\/([^.)]+\.(?:jpg|jpeg|png|webp|svg))/g, `${baseUrl}/${config.ArchiveBaseUrl}/${pid}/_resources/$1`);
  return fixed;
};

/**
 * URLパラメーターの取得(主に検索画面で使用)
 * @param query 
 * @returns 
 */
export const getParams = (query: string) => {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(query);
  return value;
};

/** 
 * URLの末尾の「/」を削除
 * delTrSlash -> delTrailingSlash
 */
export const delTrSlash = (url: string) => {
  let path = ''
  if (url.endsWith('/')) {
    path = url.replace(/\/$/, '');
  } else {
    path = url;
  }
  return path;
};

/**
 * URL先のリソースが有効かを判定する
 */
export const isActiveURL = async (srcUrl: string) => {
  let res = { result: false };

  try {
    //-- 指定されたURLのContent-Typeヘッダーを取得
    const response = await fetch(srcUrl, { method: 'HEAD' });
    //-- リクエストに失敗した場合
    if (!response.ok) {
      throw new Error('The URL is invalid')
    } else {
      res.result = true;
      return res;
    }
  } catch (error) {
    console.error(error);
    res.result = false;
    // return res;
  }

};