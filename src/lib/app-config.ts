/* App Config */

const AppConfig = {
  // JSONデータのBasePath
  JsonDataBasePath: "site-resources/json",
  // デプロイ時のJSONデータのBaseUrl
  JsonDataHostUrl: {
    production:  "https://ss450622.stars.ne.jp",
    development: "http://localhost:8002/MarkoutSuite",
  },
};

export default AppConfig;