import { sleep } from "../utils/misc-utils.js";
import { getSplitPageUrl } from "../utils/url-utils.js";
/**
 * トップページに表示された分割ページリンクは、最後まで表示されていない場合(後のページにアクセスして初めて表示される)があるため、実際の分割ページリンクの最大数を調べる
 * @param url ベースとなるURL
 * @param key 分割ページのパラメーターキー
 * @param max トップページに表示された分割ページリンクの最大数
 * @returns 調べられた分割ページリンクの最大数
 */
const testMaxPage = async (url, key, max) => {
    let num = max + 1;
    let checkedMax = 0;
    let result = true;
    while (result) {
        let test_num = String(num);
        let test_url = getSplitPageUrl(url, key, test_num);
        const response = await fetch(test_url);
        if (!response.ok) {
            result = false;
            break;
        }
        else {
            checkedMax = num;
            ++num;
        }
        await sleep(2);
    }
    return checkedMax;
};
/**
 * HTMLのページネーションリンクを解析し、分割されたページのキー名と末尾ページのナンバーを得る
 * クエリパラメータで"?page=2"といった形のリンクのみ対応
 * @param document
 * @param pageUrl
 * 分割ページのリンクリストを動的に生成しているサイトは取得できない
 */
const getSplitPageParams = async (document, pageUrl) => {
    const sptPageParams = [];
    const pageUrlObj = new URL(pageUrl);
    const pageOrigin = pageUrlObj.origin;
    const pagePathname = pageUrlObj.pathname;
    //-- ページ内のリンクを全て取得
    const urls = document.getElementsByTagName("a");
    if (!urls || urls.length === 0) {
        return { splitKey: '', maxPageNum: 1 };
    }
    //-- そのリンクを順に調べる
    Array.prototype.forEach.call(urls, (url) => {
        let link = url.href;
        //-- 相対URLは絶対URLにする
        if (link.startsWith('/')) {
            link = `${pageOrigin}${link}`;
        }
        //-- リンクが無効なら次へ(forEach 内の return は continue の役割)
        if (!URL.canParse(link)) {
            return;
        }
        const linkUrlObj = new URL(link);
        const linkOrigin = linkUrlObj.origin;
        const linkUrlPathname = linkUrlObj.pathname;
        const linkSearchParams = linkUrlObj.searchParams;
        //-- 同じサイトのリンクのみ調べる
        if (linkOrigin === pageOrigin) {
            /**
             * 同じサイトのリンクで pathname が同じなら
             * そのクエリパラメータは分割ページリンクの可能性
             */
            if (linkUrlPathname === pagePathname) {
                if (linkSearchParams && (linkSearchParams.toString() !== "")) {
                    sptPageParams.push(linkSearchParams);
                }
            }
        }
    });
    let sptKey = "";
    let maxNumber = 0;
    if (sptPageParams.length > 0) {
        sptPageParams.forEach((param) => {
            let paramStr = param.toString();
            const [key, value] = paramStr.split('=');
            let pnum = 0;
            if (value) {
                pnum = parseInt(value);
            }
            //-- 値が数値ではないクエリパラメータは無視
            if (Number.isNaN(pnum)) {
                return;
            }
            if (key && pnum) {
                sptKey = key;
                maxNumber = (pnum > maxNumber) ? pnum : maxNumber;
            }
            if (maxNumber < 2) {
                return;
            }
        });
        if (maxNumber > 1) {
            let checkedMax = 0;
            //-- 追加の分割ページがあるなら更新
            checkedMax = await testMaxPage(pageUrl, sptKey, maxNumber);
            if (checkedMax > maxNumber) {
                maxNumber = checkedMax;
            }
        }
    }
    if (sptKey && sptKey !== '') {
        console.log('page splitKey: ', sptKey);
        console.log('maxPageNum: ', maxNumber);
    }
    else {
        console.log('Page splitKey none(single page).');
    }
    return { splitKey: sptKey, maxPageNum: maxNumber };
};
export default getSplitPageParams;
