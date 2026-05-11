import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import parseImg from "./parseImg.js";
const doPuppeteer = async (url) => {
    const pageUrl = url;
    let htmlElem = null;
    let statusCode = 0;
    let ok = false;
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 1000,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--lang=ja,en-US,en'
        ]
    });
    //--- 空のページを開く
    const page = await browser.newPage();
    /** リトライ関数 */
    function retry(func, retryCount) {
        let promise = Promise.reject().catch(() => func());
        for (let i = 0; i < retryCount; i++) {
            console.log(`try to load the article : (${i + 1}) ...`);
            promise = promise.catch((err) => func());
        }
        return promise;
    }
    try {
        //-- 失敗した場合2回（計3回）まで再試行
        await retry(async () => {
            const response = await page.goto(pageUrl, {
                waitUntil: "domcontentloaded",
                timeout: 60000,
            });
            //--- Scrolling to the bottom of the page
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            if (response) {
                statusCode = response.status();
            }
            //--- ページのHTML全体を取得
            if (statusCode === 200) {
                htmlElem = await page.content();
                ok = true;
            }
        }, 2).catch((err) => {
            //-- 再試行に失敗した場合
            throw new Error(`${err}`);
        });
    }
    catch (error) {
        console.error(`Failed to page.goto: ${error}`);
    }
    finally {
        //--- ブラウザを閉じる
        await browser.close();
    }
    return { ok: ok, html: htmlElem, status: statusCode };
};
const getPageHtml = async (pageUrl) => {
    let pageHtml = null;
    let status = 0;
    const response = await doPuppeteer(pageUrl);
    status = response.status;
    if (response?.ok) {
        pageHtml = response.html;
        // console.log("#=========================================================\n\n");
        // console.log('A01 pageHtml: ', pageHtml);
        // console.log("#=========================================================\n\n");
    }
    if (pageHtml) {
        const dom = new JSDOM(pageHtml);
        let document = dom.window.document;
        /** 独自の parse〜系モジュールで document を加工
         * parseImg: 画像処理
         */
        document = parseImg(pageUrl, document);
        const htmlEl = document.getElementsByTagName('html')[0];
        if (htmlEl) {
            pageHtml = htmlEl.outerHTML;
        }
    }
    return { pageHtml: pageHtml, status: status };
};
export default getPageHtml;
