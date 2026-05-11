export const decodeEntities = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.documentElement.textContent;
};

/**
 * title や description に「"」「'」などが含まれていたら YAMLエスケープ(\を文字の前に付ける)をする.
 * 予定対照文字: 「" ' [ ] { } > | * & ! % # ` @ , ? : -」
 * 現状は「"」のみ対応.
 */
export const escapeDoubleQuotes = (text: string): string => {
  // text = 'text is "Foo" & [Boo!] %? # `@` & :--'
  let fixed = text;
  const ptn = /(?<!\\)["]/g;
  let matchStr = text.match(ptn);
  if (matchStr) {
    fixed = fixed.replace(ptn, '\\"');
  }
  return fixed;
}