import moment from "moment";
//-- 現在の日時を取得
const getPostDate = () => {
    return moment().format();
};
//-- 日付文字列から記事のIDを生成
const getPostId = (date) => {
    const regexT = /T/;
    const regexCLN = /\:/g;
    const regexLT = /\+0900/;
    let postid = date.replace(regexT, 't');
    postid = postid.replace(regexCLN, '');
    postid = postid.replace(regexLT, '');
    return postid;
};
//-- ソースの投稿日の形式を整理
const fixSourceDate = (sourceDate) => {
    const pubTime = moment(sourceDate).format('Y.MM.DD');
    return pubTime;
};
export { getPostDate, getPostId, fixSourceDate };
