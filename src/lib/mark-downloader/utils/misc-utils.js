import fs from "fs";
import { default as config } from "../app-config.js";
//-- ms (ミリ秒)待機
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//-- 動画サイトは、URLパラメーターを維持し分割ページの対応をしない
export const isMovieSite = (url = '') => {
    const hostname = new URL(url).hostname;
    if (hostname && config.movieSite.includes(hostname)) {
        return true;
    }
    else {
        return false;
    }
};
