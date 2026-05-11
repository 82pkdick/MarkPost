import fs from "fs";
import { Readability } from "@mozilla/readability";
import { parseTextToDom } from "../utils/html-utils.js";
import { default as config } from "../app-config.js";
const readDownloadedFile = (file) => {
    const htmltxt = fs.readFileSync(file, 'utf-8');
    return htmltxt;
};
// Readability.js でヘッダー、フッター、サイドバーなどを除いた 本文を抽出
/**
 * Readability.parse の戻り値
 * const article: {
    title: string;
    content: string;
    textContent: string;
    length: number;
    excerpt: string;
    byline: string;
    dir: string;
    siteName: string;
    lang: string;
    publishedTime: string;
}
*/
const getReadableArea = async (document) => {
    const reader = new Readability(document);
    const article = await reader.parse();
    return article;
};
const readMainArea = async ({ prjRoot }) => {
    const workDir = `${prjRoot}/${config.workingDirectory}`;
    let htmlStr = '';
    const mainFilePath = `${workDir}/${config.tempFileName}.html`;
    htmlStr = readDownloadedFile(mainFilePath);
    const dom = parseTextToDom(htmlStr);
    const dataReadable = await getReadableArea(dom);
    return dataReadable;
};
const readAdditionalArea = async ({ prjRoot, maxPageNum }) => {
    const workDir = `${prjRoot}/${config.workingDirectory}`;
    let htmlStr = '';
    let dataAdditional = [];
    for (let i = 2; i <= maxPageNum; i++) {
        let filePath = `${workDir}/${config.tempFileName}-${i}.html`;
        htmlStr = readDownloadedFile(filePath);
        let dom = parseTextToDom(htmlStr);
        let data = await getReadableArea(dom);
        if (data && data.content) {
            dataAdditional.push(data?.content);
        }
    }
    return dataAdditional;
};
export { readMainArea, readAdditionalArea };
