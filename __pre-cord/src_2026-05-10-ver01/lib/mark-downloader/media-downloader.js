import fs from "fs";
import { default as config } from "./app-config.js";
import { downloadMedia, downloadMp4 } from "./modules/downloadMedia.js";
//-- メディアリストのデータファイルを読み込む
const readDataFile = (postId) => {
    const postFolder = `${config.saveDir}/${postId}`;
    const mediaDataFile = `${postFolder}/${config.postResourceFolder}/${config.mediaListFileName}`;
    try {
        const dataJsonStr = fs.readFileSync(mediaDataFile, 'utf-8');
        const data = JSON.parse(dataJsonStr);
        return data;
    }
    catch (error) {
        console.error('Media list file cannot be found.');
        return undefined;
    }
};
//--- ページの画像をダウンロード
const downloadImages = async ({ downloadDir, imageList }) => {
    try {
        for (const mediaItem of imageList) {
            await downloadMedia({ downloadDir: downloadDir, mediaItem: mediaItem });
        }
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
//--- 動画のダウンロード
const downloadMovie = async ({ downloadDir, mediaUrl, movieFileName }) => {
    try {
        downloadMp4({ downloadDir, mediaUrl, fname: movieFileName });
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
const downloadPageMedia = async (postId) => {
    const mediaData = readDataFile(postId);
    if (!mediaData) {
        return;
    }
    const { mediaFolder, mediaType, imageSrclist, mediaUrl, movieFileName } = mediaData;
    try {
        if (mediaType === 'image') {
            if (imageSrclist && imageSrclist.length > 0) {
                await downloadImages({ downloadDir: mediaFolder, imageList: imageSrclist });
                return { ok: true, message: '>>>> Page media download.' };
            }
        }
        else if (mediaType === 'movie') {
            if (mediaUrl && movieFileName) {
                await downloadMovie({ downloadDir: mediaFolder, mediaUrl: mediaUrl, movieFileName: movieFileName });
                return { ok: true, message: '>>>> Page movie download.' };
            }
        }
    }
    catch (error) {
        let errMsg = "";
        if (error instanceof Error) {
            errMsg = error.message;
        }
        else {
            errMsg = `${error}`;
        }
        console.error(`>>> Download media failed. : ${errMsg}`);
        return { ok: false, message: errMsg };
    }
};
export default downloadPageMedia;
