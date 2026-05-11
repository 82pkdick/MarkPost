/* App Config */

/**
 * /static 以下にあるDIRは一部 Sリンクなのでデプロイ時に注意する.
 * アーカイブのパス: static/posts --> ../../content-html/posts
 * JSONとサムネイル画像のリソースパス: static/site-resources --> ../../site-resources
 */

const AppConfig = {
  // サイト全体の情報
  Site: {
    // サイト全体のタイトル
    title: "MarkPost",
    // 製作者情報
    author: {
      name: "82pkdick",
      email: "82pkdick@gmail.com",
      twitterUsername: "@82pkdick",
      portrait: "author_portrait.jpg",
    },
    // サイトの説明
    description: "Simple Posts Reader for Web Page Clip.",
    // コピーライト
    copyright: "2026 All Rights Reserved.",
  },
  // JSONデータのBasePath
  JsonDataBasePath: "site-resources/json",
  // 記事のサムネイル画像のBasePath
  PostThumbnailsBasePath: "site-resources/thumbnails",
  // 開発時とデプロイ時のJSONデータのBaseUrl
  JsonDataHostUrl: {
    production:  "http://192.168.3.8/markpost",
    development: "http://localhost:3300/markpost",
  },
  // 記事アーカイブのBaseUrl
  ArchiveBaseUrl: "posts",
  // 記事元マークダウンファイルのある場所のベースパス
  PostMdFilePath: "content-original",
  // 記事元マークダウンファイルのデフォルトファイル名
  PostFilename: "index.md",
  // セクションのインデックスファイル名
  SectionIndexFile: "_index.md",
  // 記事アーカイブ(HTMLファイル)のある場所のベースパス
  PostHtmlFilePath: "content-html/posts",
  // 記事アーカイブをビルドする作業ディレクトリ
  ArchiveWorkDir: "work",
  /* ページネーションが長い場合に「...」で省略する範囲。現在のページから前後いくつまで表示するか？*/
  PaginationShiftNumber: 3,
  // サムネイル代替画像
  ThumbnailSubImage: "images/note-image.png",
  // 書き出す.mdファイルのテンプレート
  PostTemplate: "templates/post.ejs",
  // 記事削除時の移動先（ゴミ箱）
  TrashFolder: "post-trash",
};

export default AppConfig;