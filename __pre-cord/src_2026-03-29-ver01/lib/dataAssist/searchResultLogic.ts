/* 
 * ---------- 検索結果から該当記事のデータを取得するロジック ----------
 */

import type { SearchPostData, SearchResultData } from "$lib/types";

const getMatchingPoint = (entry: SearchResultData) => {
  const {contentsPlain, startPos, endPos} = entry;
  let body = contentsPlain;
  const expStart = body.substring(startPos - 30, startPos);
  const expMatch = body.substring(startPos, endPos);
  const expEnd = body.substring(endPos, endPos + 30);
  return {start: expStart, match: expMatch, end: expEnd};
};

// ------ 検索結果の位置数値データからマッチする記事のデータを作る ------
const createDataList = (result: number[][], data: SearchPostData[]): Array<SearchResultData> => {
    // console.log('SRL01: ', result);
  // console.log('SRL02: ', data);

  let entriesData = [] as SearchResultData[];
  let PostDataList = data;

  for (let i = 0; i < result.length; ++i) {
    let dataIndex = result[i][0];
    let startPos = result[i][1];
    let endPos = result[i][2];

    let { date, description, fileDir, filePath, postId, section, sitename, source, sourceDate, tags, thumbnail, title, url, contentsPlain } = PostDataList[dataIndex];

    entriesData.push({
      date: date,
      description: description,
      fileDir: fileDir,
      filePath: filePath,
      postId: postId,
      section: section,
      sitename: sitename,
      source: source,
      sourceDate: sourceDate,
      tags: tags,
      thumbnail: thumbnail,
      title: title,
      url: url, 
      contentsPlain: contentsPlain, 
      startPos: startPos, 
      endPos: endPos,
      matchPoints: {
        start: "", 
        match: "",
        end: "",
      }
    });
  }

  return entriesData;
};

const getAppliedPosts = (result: number[][], data: SearchPostData[]): Array<SearchResultData> | null => {
  const entriesData = createDataList(result, data);
  if (entriesData.length > 0) {
    return entriesData;
  } else {
    return null;
  }
};

export { getAppliedPosts, getMatchingPoint };
