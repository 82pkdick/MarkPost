/**
 * Extract file extensions. Default 'png'
 * @param src
 * @returns extname
 */
export const getImgExt = (src) => {
    const imgPtn1 = /(https?:\/\/.+)\?format=(jpg|jpeg|png|webp|svg)&.+$/;
    const imgPtn2 = /(https?:\/\/.+)(jpg|jpeg|png|webp|svg)\?(\w+=\w+&?)+$/;
    let ext = '';
    if (imgPtn1.test(src)) {
        let matchStr = src.match(imgPtn1);
        if (matchStr) {
            ext = `${matchStr[2]}`;
        }
        return ext;
    }
    else if (imgPtn2.test(src)) {
        let matchStr = src.match(imgPtn2);
        if (matchStr) {
            ext = `${matchStr[2]}`;
        }
        return ext;
    }
    else {
        return 'png';
    }
};
