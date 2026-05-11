/* App Config */

/**
 * /static 以下にあるDIRは一部 Sリンクなのでデプロイ時に注意する.
 * アーカイブのパス: static/html-posts --> ../../content-html/posts
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
    production:  "https://ss450622.stars.ne.jp",
    development: "http://localhost:3300",
  },
  // 記事アーカイブのBaseUrl
  ArchiveBaseUrl: "/html-posts",
  // 記事元マークダウンファイルのある場所のベースパス
  PostsMarkdownFilePath: "/home/jgb/MarkoutSuite/content-original",
  /* ページネーションが長い場合に「...」で省略する範囲。現在のページから前後いくつまで表示するか？ */
  PaginationShiftNumber: 3,
};

export default AppConfig;