import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import PostData from './PostData.js';
import { isMovieSite } from '../utils/misc-utils.js';
import { default as config } from '../app-config.js';
//テンプレートファイルの読み込み
const readTmpl = (tmplfile, basePath) => {
	let templPath = path.join(basePath, tmplfile);
	let templ = fs.readFileSync(templPath, 'utf-8');
	return templ;
};
const getNewPostPath = (postid, contentPath) => {
	const dir = `${contentPath}/${postid}`;
	const file = `${dir}/index.md`;
	return { dir: dir, file: file };
};
const genTemplData = (postInfo, content) => {
	const data = {
		title: postInfo.title,
		date: postInfo.postDate,
		postId: postInfo.postId,
		thumbnail: postInfo.thumbnail,
		description: postInfo.description,
		source: postInfo.sourceUrl,
		sitename: postInfo.hostname,
		sourceDate: postInfo.sourceDate,
		tags: [],
		postType: '',
		videoUrl: postInfo.videoUrl,
		movieArchive: '',
		content: content
	};
	return data;
};
const createPost = async (props) => {
	let { prjRoot, postData } = props;

	const contentPath = path.join(prjRoot, `${config.saveDir}`);

	const postInfo = postData.pageInfo;
	const postContent = postData.getMarkdown();

	const template = config.postTemplate;
	const templStr = readTmpl(template, prjRoot);
	if (!postInfo) {
		return;
	}
	const data = genTemplData(postInfo, postContent);
	/** 動画サイトの場合の追加情報 */
	if (isMovieSite(postInfo.sourceUrl)) {
		data.postType = 'movie';
		data.videoUrl = postInfo.videoUrl;
		data.movieArchive = `_resources/movie-${postInfo.postId}.mp4`;
	}
	try {
		const draftData = ejs.render(templStr, data);
		const postId = postInfo.postId;
		const { dir: postDir, file: postMdFile } = getNewPostPath(postId, contentPath);

		//-- postId を名前とする記事のフォルダを作る.
		if (!fs.existsSync(postDir)) {
			fs.mkdirSync(postDir, { recursive: true });
		}
		fs.writeFileSync(postMdFile, draftData);
		return { success: true, postDir: postDir };
	} catch (error) {
		throw new Error(`Failed to create an post. ${error}`);
	}
};
export { createPost, getNewPostPath };
