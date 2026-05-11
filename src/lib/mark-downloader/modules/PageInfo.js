import { fixSourceDate } from "../utils/date-utils.js";
import { getSplitPageUrl } from "../utils/url-utils.js";
import { isMovieSite } from "../utils/misc-utils.js";
/**
 * URL をもとにそのページのデータを保持するクラス
 * プロパティ
 *  - title: ページタイトル
 *  - postDate: データ作成日時
 *  - postId: {date:YYYY-MM-DDtHHmmss}
 *  - thumbnail: サムネイル画像のURL
 *  - description: 概要
 *  - #sourceUrl: ソースURL
 *  - sourceDate: ソース元の作成日
 *  - hostname: サイトドメイン
 *  - videoUrl: 動画サイトであれば動画のURL
 *
 *  - hasSplitPage: 分割ページの有無
 *  - splitKey: 分割ページのキー(ex. ?page=2)
 *  - maxPageNum: 分割ページ数
 * `set`メソッドで新たなURLを受けてデータを構築.
 * 構築後は前のデータは破棄される.
 */
class PageInfo {
    #sourceUrl = "";
    #title = "";
    #postDate = "";
    #postId = "";
    #thumbnail = "";
    #description = "";
    #sourceDate = "";
    #hostname = "";
    #videoUrl = "";
    #hasSplitPage;
    #splitKey;
    #maxPageNum;
    #splitPageUrls = [];
    constructor() {
        this.#hasSplitPage = false;
        this.#splitKey = undefined;
        this.#maxPageNum = 0;
    }
    setInfo(params) {
        let { postId, postDate, sourceUrl, title, thumbnail, description, sourceDate, videoUrl, hasSplitPage, splitKey, maxPageNum } = params;
        if (sourceDate) {
            sourceDate = fixSourceDate(sourceDate);
        }
        this.#sourceUrl = sourceUrl;
        this.#title = title;
        this.#postDate = postDate;
        this.#postId = postId;
        this.#thumbnail = thumbnail;
        this.#description = description;
        this.#sourceDate = sourceDate;
        this.#hostname = new URL(sourceUrl).hostname;
        this.#videoUrl = videoUrl;
        if (!(isMovieSite(this.#sourceUrl))) {
            this.#hasSplitPage = hasSplitPage;
            this.#splitKey = splitKey;
            this.#maxPageNum = maxPageNum;
        }
        if (hasSplitPage) {
            this.#setSplitPageUrls();
        }
    }
    getInfo() {
        const result = {
            sourceUrl: this.#sourceUrl,
            title: this.#title,
            postDate: this.#postDate,
            postId: this.#postId,
            thumbnail: this.#thumbnail,
            description: this.#description,
            sourceDate: this.#sourceDate,
            hostname: this.#hostname,
            videoUrl: this.#videoUrl,
            hasSplitPage: this.#hasSplitPage,
            splitKey: this.#splitKey,
            maxPageNum: this.#maxPageNum,
            splitPageUrls: this.#splitPageUrls,
        };
        return result;
    }
    #setSplitPageUrls() {
        let url, key, max_num;
        url = this.#sourceUrl;
        key = this.#splitKey ? this.#splitKey : "";
        max_num = this.#maxPageNum;
        if (key) {
            for (let i = 2; i <= max_num; i++) {
                const page_num = String(i);
                const page_url = getSplitPageUrl(url, key, page_num);
                this.#splitPageUrls.push(page_url);
            }
        }
    }
}
export default PageInfo;
