import { getAbsUrl } from "../utils/url-utils.js";
/**
 * 1つ以上の改行を1つの空白文字に変換
 */
const mvNLtoSpace = (text) => {
    const fixed = text.replace(/\r?\n/g, ' ');
    return fixed;
};
/**
 * 先頭の半角全角の空白を削除
 */
const trimStartSpace = (text) => {
    const fixed = text.replace(/^[\s|　]+/, '');
    return fixed;
};
/**
 * 2つ以上の半角全角空白の連続は半角1つに
 */
const replaceContinuousSpace = (text) => {
    const fixed = text.replace(/[\s|　]+/g, ' ');
    return fixed;
};
/**
 * 改行を<br/>に
 */
const newLineToBr = (text) => {
    let fixed = text.replace(/\n/g, '<br/>');
    return fixed;
};
/**
 * 全角空白でインデントされた段落で改行が無くなり
 * 文章がつながってしまう場合の対策(例：news.yahoo.co.jp)
 * インデントされた部分ごとに分割し、改行2回追加.
 */
const fixParagraph = (text) => {
    let fixed = '';
    const plist = text.split('　');
    plist.forEach((p) => {
        fixed += `${p}\n\n`;
    });
    return fixed;
};
/**
 * 画像リンクを囲むリンク表記の無駄な改行を除去2
 */
const fixImgLinkString = (mdText, pageUrl) => {
    let fixedText = mdText;
    const ptn = /\[?[\s\r\n]*(!\[[^\[\]]*\]\([^\)]+\))[\s\r\n]*\]\(([^\)]+)\)/g;
    let matchList = [...mdText.matchAll(ptn)];
    matchList.forEach((match) => {
        let targetArea = match[0];
        let head = match[1];
        let tail = match[2];
        //-- 相対アドレスを絶対アドレスに
        if (tail && tail.startsWith('/')) {
            const fixed_link = getAbsUrl(tail, pageUrl);
            tail = fixed_link.href;
        }
        //-- 画像のALTに改行は要らない
        head = head && mvNLtoSpace(head);
        fixedText = fixedText.replace(targetArea, `[${head}](${tail})`);
    });
    return fixedText;
};
/**
 * title や description に「"」「'」などが含まれていたら YAMLエスケープ(\を文字の前に付ける)をする.
 * 予定対照文字: 「" ' [ ] { } > | * & ! % # ` @ , ? : -」
 * 現状は「"」のみ対応.
 */
const escapeDoubleQuotes = (text) => {
    let fixed = text;
    const ptn = /(?<!\\)["]/g;
    let matchStr = text.match(ptn);
    if (matchStr) {
        fixed = fixed.replace(ptn, '\\"');
    }
    return fixed;
};
export { mvNLtoSpace, trimStartSpace, replaceContinuousSpace, newLineToBr, fixParagraph, fixImgLinkString, escapeDoubleQuotes };
