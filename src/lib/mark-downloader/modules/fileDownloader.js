import fs from "fs";
import PostData from "./PostData.js";
import { createPost } from "./createPost.js";
import { downloadThumbnail, convertLightThumb } from "./downloadMedia.js";
import { isMovieSite } from "../utils/misc-utils.js";
import { default as config } from "../app-config.js";
class FileDownloader {
    #postData;
    constructor({ data }) {
        this.#postData = data;
    }
    async download({ prjRoot }) {
        const createdResult = await createPost({ prjRoot: prjRoot, postData: this.#postData });
        const sourceUrl = this.#postData.pageInfo.sourceUrl;
        const postId = this.#postData.pageInfo.postId;
        if (createdResult?.success) {
            const postDir = createdResult.postDir;
            const mediaFolder = `${postDir}/${config.postResourceFolder}`;
            const thumbInfo = this.#postData.thumbnailInfo;
            const thumbOrgUrl = thumbInfo.orgUrl;
            const thumbSmall = thumbInfo.small;
            const thumbTemp = `${config.thumbFileName}-org.${thumbInfo.ext}`;
            try {
                //--- サムネイル画像を処理 ------------------------------
                await downloadThumbnail({ thumbUrl: thumbOrgUrl, downloadDir: mediaFolder, thumbTemp: thumbTemp });
                console.log(`>>> Downloaded thumbnail success.`);
                if (!isMovieSite(sourceUrl)) {
                    //-- ページ画像のリストをJSONファイル(`記事フォルダ/_resources`の`medialist.json`)に保存
                    await this.#createMediaList(mediaFolder);
                    console.log(`>>> Created image list file success.`);
                }
                else {
                    //-- 動画のURLをJSONファイル(`記事フォルダ/_resources`の`medialist.json`)に保存
                    await this.#saveMovieUrl(mediaFolder);
                    console.log(`>>> Created movie data file success.`);
                }
                await convertLightThumb({ downloadDir: mediaFolder, thumbTemp: thumbTemp, thumbname: thumbSmall });
            }
            catch (error) {
                console.error(`>>> Download thumbnail or create media data file failed. : ${error}`);
            }
        }
    }
    //--- ページの画像のリストを作成
    /**
      {
        "mediaFolder": ".../[postId]/_resources",
        "imageSrclist:": [
          { // image 01
            "imageUrl": 'https://....',
            "imageExt": 'jpg','png'...etc.
            "imageFileName": '~~~~~.jpg' etc.
          },
          { // image 02
            and more .....
          }
        ]
      }
    */
    async #createMediaList(mediaFolder) {
        const fixedSrcInfos = this.#postData.getImageInfos();
        const postId = this.#postData.pageInfo.postId;
        const mediaInfos = {
            postId: postId,
            mediaFolder: mediaFolder,
            mediaType: "image",
            imageSrclist: [...fixedSrcInfos]
        };
        const data = JSON.stringify(mediaInfos);
        const workdir = `${mediaFolder}`;
        const datafile = `${workdir}/${config.mediaListFileName}`;
        if (fixedSrcInfos && fixedSrcInfos.length > 0) {
            try {
                fs.writeFileSync(datafile, data);
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        }
    }
    //--- 動画のURLをJSONファイルに保存
    /**
      {
        "mediaFolder": ".../[postId]/_resources",
        "mediaUrl": "https://.....",
        "movieFileName": "movie-[postId].mp4"
      }
    */
    async #saveMovieUrl(mediaFolder) {
        const pageInfo = this.#postData.pageInfo;
        const mediaUrl = pageInfo.sourceUrl;
        const postId = pageInfo.postId;
        const movieFileName = `movie-${postId}.mp4`;
        const mediaInfos = {
            postId: postId,
            mediaFolder: mediaFolder,
            mediaType: "movie",
            mediaUrl: mediaUrl,
            movieFileName: movieFileName
        };
        const data = JSON.stringify(mediaInfos);
        const workdir = `${mediaFolder}`;
        const datafile = `${workdir}/${config.mediaListFileName}`;
        if (mediaUrl) {
            try {
                fs.writeFileSync(datafile, data);
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        }
    }
}
export default FileDownloader;
