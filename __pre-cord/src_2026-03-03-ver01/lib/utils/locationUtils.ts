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
  const fixed = md.replace(/_resources\/([^)]+)/g, `${config.ArchiveBaseUrl}/${pid}/_resources/$1`);
  return fixed;
};