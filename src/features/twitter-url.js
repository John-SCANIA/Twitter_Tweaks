// コピーされるURLを x.com から twitter.com にする。
// navigator.clipboard 経由のコピー（「リンクをコピー」など）は main-world/clipboard.js が担当し、
// ここでは手動選択のコピーを扱い、MAIN world 側にON/OFFを伝える。
(() => {
  const FLAG = "trTwitterUrls";

  function toTwitterUrls(text) {
    return text.replace(/\bhttps?:\/\/(?:www\.|mobile\.)?x\.com(?=[\/?#]|$)/gi, "https://twitter.com");
  }

  function onCopy(event) {
    const selection = document.getSelection();
    if (!selection || selection.isCollapsed) return;
    const text = selection.toString();
    const replaced = toTwitterUrls(text);
    if (replaced === text) return;
    event.clipboardData.setData("text/plain", replaced);
    event.preventDefault();
  }

  TR.register({
    id: "twitterUrls",
    settingKey: "twitterUrls",
    init() {
      document.documentElement.dataset[FLAG] = "1";
      document.addEventListener("copy", onCopy, true);
    },
    cleanup() {
      delete document.documentElement.dataset[FLAG];
      document.removeEventListener("copy", onCopy, true);
    }
  });
})();
