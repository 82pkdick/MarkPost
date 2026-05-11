import PageHTML from "./PageHTML.js";
export const getNewPost = async (props) => {
    let { url, postDate, postId, prjRoot } = props;
    const isToppage = true;
    try {
        const pageHtml = new PageHTML({ prjRoot, postDate, postId, isToppage });
        const resultMain = await pageHtml.parse(url);
        let processResults = {
            success: false,
            mainPageRes: false,
            splitPageRes: false,
            pageInfo: undefined,
        };
        if (resultMain) {
            processResults.mainPageRes = true;
            processResults.success = true;
        }
        const ready = await pageHtml.isReady();
        if (ready) {
            const pageInfo = pageHtml.pageInfo;
            const infos = pageInfo?.getInfo();
            const hostname = infos?.hostname;
            processResults.pageInfo = infos;
            if (infos?.hasSplitPage && infos.splitPageUrls.length > 0) {
                let resultSub;
                for (let i = 0, pnum = i + 2; pnum <= infos.maxPageNum; i++, pnum++) {
                    let nextPageUrl = infos.splitPageUrls[i];
                    if (nextPageUrl) {
                        resultSub = await pageHtml.parseNextPage(pnum, nextPageUrl);
                    }
                }
                if (resultSub) {
                    processResults.splitPageRes = true;
                }
            }
            return processResults;
        }
        else {
            const errorMsg = 'Terminated without pageHtml ready.';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
};
