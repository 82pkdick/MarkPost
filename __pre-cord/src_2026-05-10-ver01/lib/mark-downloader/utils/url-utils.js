//-- URL Hostname
export const getHostname = (urlstr) => {
    const url = new URL(urlstr);
    const hostname = url.hostname;
    return hostname;
};
export const checkRelUrl = (urlstr) => {
    const url = urlstr;
    if (url.startsWith('/')) {
        return true;
    }
    else {
        return false;
    }
};
export const getAbsUrl = (srcUrl, pageUrl) => {
    /* img src が相対アドレスでも、
    URLクラスの第２引数にページのURLを渡せば、
    絶対アドレスに変換してくれる。*/
    const imgUrl = new URL(srcUrl, pageUrl);
    return imgUrl;
};
/* 分割ページのURLを得る */
export const getSplitPageUrl = (url, key, num) => {
    const urlObj = new URL(url);
    const urlPath = new URL(urlObj.pathname, url).href;
    const pageUrl = `${urlPath}?${key}=${num}`;
    return pageUrl;
};
/** URLから全てのパラメーターを削除 */
export const delUrlSearchParams = (url) => {
    let urlStr = '';
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    const paramList = [];
    params.forEach((value, key) => {
        paramList.push(key);
    });
    paramList.forEach((pname) => {
        urlObj.searchParams.delete(pname);
    });
    urlStr = urlObj.href;
    return urlStr;
};
