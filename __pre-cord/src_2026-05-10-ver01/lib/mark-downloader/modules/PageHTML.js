import fs from "fs";
import getPageHtml from "../lib/parseHtml/getPageHtml.js";
import { parseTextToDom, getHeadEls } from "../utils/html-utils.js";
import { sleep, isMovieSite } from "../utils/misc-utils.js";
import readSite from "../modules/getSiteInfo.js";
import getSplitPageParams from "./getSplitPageParams.js";
import PageInfo from "./PageInfo.js";
import { default as config } from "../app-config.js";
//-- インスタンスメンバー(#htmlStr)のセットを待つ
const waitReady = async (htmlStr) => {
    //-- 待機時間(1秒)
    const ms = 1000;
    //-- 待機リミット(ms x limit)
    const limit = config.readHtmlLimit;
    let count = 0;
    while (htmlStr === null) {
        await sleep(ms);
        count++;
        if (count >= limit)
            break;
    }
};
/**
 * URLを受けてサイトの情報を返す
 */
const doGetSiteInfo = async (headELs, url) => {
    try {
        const res = await readSite(headELs, url);
        if (res) {
            const resData = { ...res, ok: true };
            return resData;
        }
        else {
            throw new Error('Failed to get site information.');
        }
    }
    catch (error) {
        console.error(error);
        const errorData = { ok: false };
    }
};
/**
 * URL をもとにそのページのデータを保持するクラス
 * プロパティ
 *  - sourceUrl: ソースURL
 *  - htmlStr: ページのHTML文字列
 *  - dom: ページのDOM
 *  - headELs: ページの<head>要素
 */
class PageHTML {
    #postId = "";
    #postDate = "";
    #sourceUrl = "";
    #htmlStr = null;
    #dom = null;
    #headELs = null;
    #isToppage = true;
    #workDir = "";
    #pageInfo = undefined;
    constructor({ prjRoot, postDate, postId, isToppage = true }) {
        this.#postDate = postDate;
        this.#postId = postId;
        this.#workDir = `${prjRoot}/${config.workingDirectory}`;
        this.#isToppage = isToppage;
        this.#pageInfo = new PageInfo();
    }
    //-- サイトのページを読み取る
    async parse(url) {
        try {
            this.#sourceUrl = url;
            const res = await this.#setData();
            return res;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    /**
     * 分割ページがあれば読み取る
     * @param pageNum: 分割ページのナンバー(2〜)
     * @param url: 分割ページのURL(パラメーターが'?page=2'など)
     * 一時ファイルは'src/work'内に「temp.html」
     */
    async parseNextPage(pageNum, url) {
        try {
            const res = await this.#readNextPage(pageNum, url);
            return res;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    //-- トップページの読み取りとデータのセット、一時ファイルへ保存
    async #setData() {
        try {
            const { pageHtml, status } = await getPageHtml(this.#sourceUrl);
            if (!pageHtml || status >= 400) {
                throw new Error(`Error: Can not get site html element. status: ${status}`);
            }
            this.#htmlStr = pageHtml;
            const dom = parseTextToDom(this.#htmlStr);
            this.#dom = dom;
            const headEls = await getHeadEls(this.#dom);
            this.#headELs = headEls;
            let infos = await doGetSiteInfo(this.#headELs, this.#sourceUrl);
            if (infos && infos.ok) {
                let { title, description, sourceDate, thumbnail, sitename, videoUrl } = infos;
                sourceDate = sourceDate ? sourceDate : '';
                sitename = sitename ? sitename : '';
                videoUrl = (!videoUrl || videoUrl === sitename) ? '' : videoUrl;
                let hasSplitPage = false;
                let splitKeyName = undefined;
                let maxPageNumber = 0;
                //-- 動画サイト以外は連続ページの有無とページ数を調べる
                if (!isMovieSite(this.#sourceUrl) && this.#isToppage && this.#dom) {
                    let { splitKey, maxPageNum } = await getSplitPageParams(this.#dom, this.#sourceUrl);
                    if (splitKey && splitKey !== '' && maxPageNum > 1) {
                        hasSplitPage = true;
                        splitKeyName = splitKey;
                        maxPageNumber = maxPageNum;
                    }
                }
                this.#pageInfo?.setInfo({
                    postId: this.#postId,
                    postDate: this.#postDate,
                    sourceUrl: this.#sourceUrl,
                    title: title,
                    thumbnail: thumbnail,
                    description: description,
                    sourceDate: sourceDate,
                    videoUrl: videoUrl,
                    hasSplitPage: hasSplitPage,
                    splitKey: splitKeyName,
                    maxPageNum: maxPageNumber,
                });
                //-- ここで this.#htmlStr をファイルに保存
                if (!isMovieSite(this.#sourceUrl)) {
                    const workFile1 = `${this.#workDir}/${config.tempFileName}.html`;
                    fs.writeFileSync(workFile1, this.#htmlStr);
                }
                //-- プロパティを解放
                this.#htmlStr = '';
                return true;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    //-- 分割ページを読み取り一時ファイルへ保存、一時ファイルは'src/work'内に「temp-2.html,temp-3.html...」
    async #readNextPage(pageNum, nextUrl) {
        try {
            const { pageHtml, status } = await getPageHtml(nextUrl);
            if (pageHtml === null || status >= 400) {
                throw new Error(`Error: Can not get next page element. status: ${status}`);
            }
            //-- 分割ページをファイルに保存
            const workFile = `${this.#workDir}/${config.tempFileName}-${pageNum}.html`;
            fs.writeFileSync(workFile, pageHtml);
            return true;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    async #isReady() {
        await waitReady(this.#htmlStr);
        if (this.#htmlStr !== null) {
            return true;
        }
        else {
            return false;
        }
    }
    async isReady() {
        return this.#isReady();
    }
    get sourceUrl() {
        return this.#sourceUrl;
    }
    get pageInfo() {
        return this.#pageInfo;
    }
}
export default PageHTML;
