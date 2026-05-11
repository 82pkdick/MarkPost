/* App Config Settings */
const Settings = {
	readHtmlLimit: 30,
	//-- 動画サイトは別扱い(URLパラメーターを維持し分割ページの対応をしないなど)
	movieSite: ['www.youtube.com'],
	//-- 作業用ディレクトリと一時ファイルの名前
	workingDirectory: 'work',
	tempFileName: 'temp',
	//-- 改行を<br/>に変換するサイトのリスト
	nlTobrSites: ['news.yahoo.co.jp'],
	//-- 記事の保存先
	saveDir: 'content-work/unsorted',
	//-- 書き出す.mdファイルのテンプレート
	postTemplate: 'templates/post.ejs',
	//-- 記事のリソースフォルダ名
	postResourceFolder: '_resources',
	//-- サムネイル画像のファイル名の接頭辞
	thumbFileName: 'thumbnail',
	//-- ダウンロードするメディアのリストを記すファイル
	mediaListFileName: 'medialist.json'
};
export default Settings;
