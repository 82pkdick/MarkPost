//-- タイムスタンプ数値を得る
export const getTimeStamp = () => {
  const timestamp = Math.floor(Date.now() / 1000);
  return timestamp;
};