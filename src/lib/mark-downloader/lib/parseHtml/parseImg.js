import { checkRelUrl, getAbsUrl } from "../../utils/url-utils.js";
/**
 * 画像操作モジュール
 * @param document
 * @returns document
 */
const parseImg = (url, document) => {
    const pageUrl = url;
    let images = document.querySelectorAll("img");
    images.forEach(async (img) => {
        //--- 'alt'の値は Markdown化の際に邪魔なので削除
        if (img.hasAttribute('alt')) {
            img.alt = "";
        }
        //--- title属性の値も不要
        if (img.hasAttribute('title')) {
            img.title = "";
        }
        //--- 画像の遅延読み込み対策
        if (img.hasAttribute('data-src')) {
            let dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
                img.src = dataSrc;
            }
        }
        //--- 画像の相対URLを絶対URLに
        let srcUrl = img.src;
        if (checkRelUrl(srcUrl)) {
            let absSrc = getAbsUrl(srcUrl, pageUrl);
            img.src = absSrc.href;
        }
    });
    return document;
};
export default parseImg;
