/* 
 * ------------- 検索ロジックと検索履歴の操作 ------------- 
 * 記事データのリストは外部から Search 関数に渡す必要がある。
 * 検索ワードの保存は10件まで
 */

import type { SearchPostData } from "$lib/types";

//-- 最大保存数が10件なので「10 − 1」
const historyMaxNum = 9;

//-- ローカルストレージに検索ワード履歴を保存
const saveQuery = (query: string): void => {
  //-- localStorage.removeItem('queryHistory');
  let history = localStorage.getItem('queryHistory');
  let query_data: string[] = [];
  let fixd_list = history;
  if (history) {
    query_data = history.split(',');
  }

  //-- 10件を超える検索ワードは古いものから削除
  if (query_data.length > historyMaxNum) {
    const del_n = query_data.length - historyMaxNum;
    const start_n = historyMaxNum;
    query_data.splice(start_n, del_n);
    fixd_list = query_data.join(',');
  }

  if (!query_data.includes(query)) {
    const newHistory = history ? `${query},${fixd_list}` : `${query}`;
    localStorage.setItem('queryHistory', newHistory);
  }
}

//-- 検索履歴を取り出し配列にする。
const GetHistory = (): string[] => {
  const history = localStorage.getItem('queryHistory');
  if (history) {
    const historyData = history.split(',');
    return historyData;
  } else {
    return [];
  }
}

/* ----- 検索ロジック本体 ----- */
const Search = async (query: string, data: SearchPostData[]): Promise<number[][]> => {
  const result = searchData(query, data);

  //-- 検索履歴に保存
  if (result && result.length > 0) {
    saveQuery(query);
  }

  return result;
}

const searchData = (query: string, data: SearchPostData[]): number[][] => {
  //-- 検索にヒットした情報を下記のような配列として格納していく
  //-- [データのインデックス, 文字の開始位置, 文字の終了位置]
  let result: number[][] = [];
  let dataList = data;

  query = query.trim();

  if (query.length < 1) {
    return result;
  }

  let re = new RegExp(query, 'i');
  for (let i = 0; i < dataList.length; ++i) {
    let pos = dataList[i].contentsPlain.search(re);
    if (pos != -1) {
      result.push([i, pos, pos + query.length]);
    }
  }
  return result;
}

export { Search, GetHistory };