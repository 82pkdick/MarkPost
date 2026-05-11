import { delUrlSearchParams } from "../utils/url-utils.js";
export const checkFileType = async (url) => {
    const srcUrl = url;
    let mediaType = '';
    try {
        //-- 指定されたURLのContent-Typeヘッダーを取得
        const response = await fetch(srcUrl, { method: 'HEAD' });
        //-- リクエストに失敗した場合
        if (!response.ok) {
            return { result: false, type: '' };
        }
        //-- 画像かどうかの判断。Content-Typeが 'image/' で始まる場合は画像
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
            const ptn = /image\/(.+)/;
            if (ptn.test(contentType)) {
                let matchStr = contentType.match(ptn);
                if (matchStr && matchStr[1]) {
                    mediaType = matchStr[1];
                }
            }
            return { result: true, type: mediaType };
        }
        else {
            return { result: false, type: '' };
        }
    }
    catch (error) {
        console.error(error);
        return false;
    }
};
export const getImageFileName = (src) => {
    let fixedSrc = delUrlSearchParams(src);
    /**
     * 画像ファイル名が「https%3A%2F%2F....%2F****.jpg」のような
     * エンコードされたURLになっているようなケースに対応
     * 一度デコードして最後の「/」以降の末尾の画像名を取り出す.
     */
    fixedSrc = decodeURIComponent(fixedSrc);
    //-- 末尾が画像系の拡張子パターン
    const ptn = /.+\/(.+\.(jpg|jpeg|png|webp|svg))/;
    //-- 拡張子が無いパターン
    const sparePtn = /.+\/([^/]+)$/;
    let fileName = '';
    let ext = '';
    if (ptn.test(fixedSrc)) {
        let matchStr = fixedSrc.match(ptn);
        if (matchStr && matchStr[1]) {
            fileName = matchStr[1];
            ext = matchStr[2];
        }
    }
    if (!fileName || fileName === '') {
        if (sparePtn.test(src)) {
            let matchStr = src.match(sparePtn);
            if (matchStr && matchStr[1]) {
                fileName = matchStr[1];
                ext = undefined;
            }
        }
    }
    return { name: fileName, ext: ext };
};
