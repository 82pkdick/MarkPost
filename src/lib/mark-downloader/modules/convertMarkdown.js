import TurndownService from "turndown";
import { newLineToBr, fixParagraph } from "../utils/string-utils.js";
import { default as config } from "../app-config.js";
// 設定の改行を<br/>にするサイトのリストに該当するなら
const nlToBrOr = (hostname) => {
    const listOfNlToBrSite = config.nlTobrSites;
    let nlToBr = false;
    if (listOfNlToBrSite.includes(hostname)) {
        nlToBr = true;
    }
    return nlToBr;
};
// Markdown に変換
export const convertMarkdown = (content, hostname) => {
    if (nlToBrOr(hostname)) {
        // 改行を<br/>に
        content = newLineToBr(content);
    }
    const turndownService = new TurndownService({ headingStyle: 'atx' });
    let markdown = turndownService.turndown(content);
    markdown = markdown.trim();
    markdown = fixParagraph(markdown);
    markdown = markdown.trimEnd();
    return markdown;
};
