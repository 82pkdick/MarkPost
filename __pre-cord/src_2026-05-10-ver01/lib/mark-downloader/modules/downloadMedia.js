import { getImgExt } from "../utils/filename-utils.js";
import { execCommand } from "./commandExec.js";
import { sleep } from "../utils/misc-utils.js";
import { default as config } from "../app-config.js";
//-- 記事に埋め込むサムネイル画像の情報
export const getThumbPath = (data) => {
    //--- サムネイル画像の拡張子
    const thumb_ext = getImgExt(data.thumbnail);
    //--- サムネイル専用として変換する PNG画像の名前（幅250ピクセル）
    const thumb_small = `${config.thumbFileName}-${data.postId}.png`;
    return { thumbSmall: thumb_small, thumbExt: thumb_ext };
};
//-- サムネイル画像をダウンロード
export const downloadThumbnail = async ({ thumbUrl = '', downloadDir = '', thumbTemp = '' }) => {
    let command = `mkdir -p ${downloadDir};`;
    command += `cd ${downloadDir};`;
    command += `sleep 1;`;
    command += `wget -O "${thumbTemp}" "${thumbUrl}";`;
    try {
        execCommand(command);
        console.log(`>>> Thumbnail Image Downloaded.`);
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
//-- サムネイル画像を軽いPING画像に変換
export const convertLightThumb = async ({ downloadDir = '', thumbTemp = '', thumbname = '' }) => {
    let command = `cd ${downloadDir};`;
    command += `sleep 1;`;
    command += `convert -geometry 250x250 ${thumbTemp} ${thumbname}`;
    try {
        execCommand(command);
        console.log(`>>> Create Light Thumbnail Image.`);
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
export const downloadMedia = async ({ mediaItem, downloadDir }) => {
    const { imageUrl, imageFileName = '' } = mediaItem;
    const media_folder = `${downloadDir}`;
    let command = `mkdir -p ${media_folder};`;
    command += `cd ${media_folder};`;
    command += `sleep 1;`;
    command += `wget -O "${imageFileName}" "${imageUrl}";`;
    try {
        execCommand(command);
        sleep(1000);
        console.log(`>>> Media ${imageFileName} Downloaded.`);
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
export const downloadMp4 = async ({ mediaUrl, downloadDir, fname = 'media.mp4' }) => {
    let url = mediaUrl;
    console.log('MediaUrl: ', url);
    let command = `cd ${downloadDir};`;
    command += `sleep 1;`;
    command += `yt-dlp -t mp4 -o ${fname} ${url};`;
    command += `sleep 1;`;
    try {
        execCommand(command);
        console.log(`>>> Movie Downloaded.`);
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
