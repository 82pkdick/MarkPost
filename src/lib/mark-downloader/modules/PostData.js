import { convertMarkdown } from "./convertMarkdown.js";
import { parseTextToDom } from "../utils/html-utils.js";
import { fixSourceDate } from "../utils/date-utils.js";
import { checkFileType, getImageFileName } from "../utils/media-utils.js";
import { isMovieSite } from "../utils/misc-utils.js";
import FileDownloader from "./fileDownloader.js";
import { getThumbPath } from "./downloadMedia.js";
import { default as config } from "../app-config.js";
class PostData {
    #pageInfo = {
        sourceUrl: "",
        title: "",
        thumbnail: "",
        description: "",
        sourceDate: "",
        videoUrl: "",
        hostname: "",
        postDate: "",
        postId: "",
    };
    #splitPageInfo = {
        hasSplitPage: false,
        splitKey: '',
        maxPageNum: 0,
    };
    #thumbnailInfo = {
        orgUrl: '',
        small: '',
        ext: '',
    };
    #imageList = [];
    #ImageInfos = [];
    #pageContent = '';
    #pageMdText = '';
    #downloader;
    constructor(params) {
        this.#setPageInfo(params);
        this.#setThumbUrl(params);
        if (!isMovieSite(params.pageInfo.sourceUrl)) {
            this.#setSplitPageInfo(params);
        }
        this.#downloader = new FileDownloader({ data: this });
    }
    #setPageInfo({ pageInfo, publishedTime, siteName }) {
        let { sourceUrl, title, description, thumbnail, videoUrl, postDate, postId } = pageInfo;
        let sourceDate = publishedTime ? fixSourceDate(publishedTime) : pageInfo.sourceDate;
        let hostname = (pageInfo.hostname && pageInfo.hostname !== '') ? pageInfo.hostname : siteName;
        this.#pageInfo = { ...this.#pageInfo, sourceUrl, title, description, thumbnail, sourceDate, videoUrl, hostname, postDate, postId };
    }
    #setSplitPageInfo({ pageInfo }) {
        let { hasSplitPage, splitKey, maxPageNum } = pageInfo;
        this.#splitPageInfo = { ...this.#splitPageInfo, hasSplitPage, splitKey, maxPageNum };
    }
    #setThumbUrl({ pageInfo }) {
        /** サムネイル画像の元のURLを thumbOrgUrl に保持し、
         * サムネイル画像のローカル用パスとファイル名の情報を生成 */
        this.#thumbnailInfo.orgUrl = pageInfo.thumbnail;
        const { thumbSmall, thumbExt } = getThumbPath(pageInfo);
        this.#pageInfo.thumbnail = `${config.postResourceFolder}/${thumbSmall}`;
        this.#thumbnailInfo.small = thumbSmall;
        this.#thumbnailInfo.ext = thumbExt;
    }
    #getImageList() {
        const dom = parseTextToDom(this.#pageContent);
        //-- ページ内のimgタグを全て取得
        const imgs = dom.getElementsByTagName("img");
        //-- 全ての画像のURLを取得
        Array.prototype.forEach.call(imgs, (img) => {
            this.#imageList.push(img.src);
        });
        //-- 重複した画像URLを整理
        this.#imageList = [...new Set(this.#imageList)];
        return this.#imageList;
    }
    async #setImageInfos() {
        for (let imageUrl of this.#imageList) {
            let res = await checkFileType(imageUrl);
            if (res && res.result) {
                let type = res.type;
                let nameRes = getImageFileName(imageUrl);
                let name = '';
                if (!nameRes.ext) {
                    name = `${nameRes.name}.${type}`;
                }
                else {
                    name = `${nameRes.name}`;
                }
                this.#ImageInfos.push({
                    imageUrl: imageUrl,
                    imageExt: type,
                    imageFileName: name
                });
            }
        }
    }
    async setContent(content) {
        if (!isMovieSite(this.#pageInfo.sourceUrl)) {
            this.#pageContent = content;
            this.#getImageList();
            if (this.#imageList && this.#imageList.length > 0) {
                await this.#setImageInfos();
            }
        }
        else {
            this.#pageContent = '';
        }
        return true;
    }
    get pageInfo() {
        return this.#pageInfo;
    }
    get pageContent() {
        return this.#pageContent;
    }
    get thumbnailInfo() {
        return this.#thumbnailInfo;
    }
    get imageList() {
        return this.#imageList;
    }
    getImageInfos() {
        return this.#ImageInfos;
    }
    getMarkdown() {
        this.#pageMdText = convertMarkdown(this.#pageContent, this.#pageInfo.hostname);
        return this.#pageMdText;
    }
    postCreate({ prjRoot }) {
        this.#downloader.download({ prjRoot: prjRoot });
    }
}
export default PostData;
