import { getNewPost } from "./modules/getNewPost.js";
import { readMainArea, readAdditionalArea } from "./modules/readReadableArea.js";
import PostData from "./modules/PostData.js";
import { delUrlSearchParams } from "./utils/url-utils.js";
import { isMovieSite } from "./utils/misc-utils.js";
import { getPostId, getPostDate } from "./utils/date-utils.js";
//-- プロジェクトルートの絶対パス
const prjRoot = process.cwd();
const createNewPost = async ({ source, postId }) => {
    //-- 動画サイト以外はURLパラメーターを全削除
    if (!(isMovieSite(source))) {
        source = delUrlSearchParams(source);
    }
    const postDate = getPostDate();
    if (!postId) {
        postId = getPostId(postDate);
    }
    const args = {
        url: source,
        postDate: postDate,
        postId: postId,
        prjRoot: prjRoot,
    };
    try {
        const res = await getNewPost(args);
        const pageInfo = res && res.pageInfo;
        let pubTime = '', sitename = '', pageContent = '';
        if (res && res.success && pageInfo) {
            console.log("Get new post info success: ", '%o', res);
            if (!(isMovieSite(source))) {
                const dataPageMain = await readMainArea({ prjRoot: prjRoot });
                if (dataPageMain) {
                    let { publishedTime, siteName, content } = dataPageMain;
                    pubTime = publishedTime ? publishedTime : '';
                    sitename = siteName ? siteName : '';
                    pageContent = content ? content : '';
                }
                const dataAdditional = await readAdditionalArea({ prjRoot: prjRoot, maxPageNum: pageInfo.maxPageNum });
                if (dataAdditional.length > 0) {
                    dataAdditional.forEach((content) => {
                        pageContent += content;
                    });
                }
            }
            const postData = new PostData({
                pageInfo: pageInfo,
                publishedTime: pubTime,
                siteName: sitename
            });
            const contentReady = await postData.setContent(pageContent);
            //-- 記事を作成
            if (contentReady) {
                postData.postCreate({ prjRoot: prjRoot });
                return { ok: true };
            }
        }
        else {
            const errorMsg = `Error create new post: ${res}`;
            console.error("Error create new post: ", '%o', res);
            throw new Error(errorMsg);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        return { ok: false };
    }
};
export default createNewPost;
