// ページ側（MAIN world）で動く。X自身のクリップボード書き込みを横取りしてURLを書き換える。
// 設定は chrome.storage を読めないので、<html data-tr-twitter-urls="1"> を見て判断する。
(() => {
  const clipboard = navigator.clipboard;
  if (!clipboard || !clipboard.writeText) return;

  const enabled = () => document.documentElement.dataset.trTwitterUrls === "1";
  const toTwitterUrls = (text) =>
    String(text).replace(/\bhttps?:\/\/(?:www\.|mobile\.)?x\.com(?=[\/?#]|$)/gi, "https://twitter.com");

  const originalWriteText = clipboard.writeText.bind(clipboard);
  clipboard.writeText = function (text) {
    return originalWriteText(enabled() ? toTwitterUrls(text) : text);
  };

  // copy イベントで書き込む経路（document.execCommand("copy") など）
  document.addEventListener(
    "copy",
    (event) => {
      if (!enabled() || !event.clipboardData) return;
      const original = event.clipboardData.setData;
      // X のハンドラが setData を呼んだときに書き換える
      event.clipboardData.setData = function (type, data) {
        return original.call(this, type, type.startsWith("text/") ? toTwitterUrls(data) : data);
      };
    },
    true
  );
})();
