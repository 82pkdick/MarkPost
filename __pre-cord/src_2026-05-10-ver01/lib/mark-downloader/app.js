import { getPostId, getPostDate } from "./utils/date-utils.js";
import * as util from "node:util";
import createNewPost from "./mark-downloader.js";
import downloadPageMedia from "./media-downloader.js";
const postDate = getPostDate();
const postId = getPostId(postDate);
// コマンドライン引数をparseArgs関数でパースする
const { positionals } = util.parseArgs({
    // オプションやフラグ以外の引数を渡すことを許可する
    allowPositionals: true
});
const mainDownload = async (url) => {
    try {
        const result = await createNewPost({ postId: postId, source: url });
        if (result?.ok) {
            return { success: true, message: 'New post created successfully.' };
        }
        else {
            const errorMsg = 'Failed to create a new post.';
            throw new Error(errorMsg);
        }
    }
    catch (error) {
        let err_message = '';
        if (error instanceof Error) {
            err_message = error.message;
        }
        else {
            err_message = `${error}`;
        }
        return { success: false, message: err_message };
        ;
    }
};
const main = async (url) => {
    const result = await mainDownload(url);
    if (result.success) {
        console.log(result.message);
        console.log('>>>> Start downloading new post resources.');
        const mdl_result = await downloadPageMedia(postId);
        if (mdl_result) {
            mdl_result.ok ? console.log(mdl_result.message) : console.error(mdl_result.message);
        }
    }
    else {
        console.error(result.message);
        return;
    }
};
// 記事のフォルダ(ID)名と、ターゲットURLをpositionals配列から取り出す
const url = positionals[0];
if (!url || url == "") {
    console.error('Argument: The URL of the target page is required.');
}
else {
    main(url);
}
