import { JSDOM } from 'jsdom';
//-- HTML文字列をDOMに変換
export const parseTextToDom = (htmltxt) => {
    const jsdom = new JSDOM();
    const parser = new jsdom.window.DOMParser();
    const document = parser.parseFromString(htmltxt, "text/html");
    return document;
};
//-- Site Head を抽出
export const getHeadEls = async (document) => {
    const headEls = document.querySelector('head');
    return headEls;
};
