// 全機能の設定。新しい機能を足すときは DEFAULT_SETTINGS にキーを追加する。
const DEFAULT_SETTINGS = {
  fxShareButton: true,     // Shareボタンを fxtwitter.com のURLコピーにする
  hiddenSidebarItems: [],  // 非表示にする左サイドバーの項目ID（sidebar-items.js 参照）
  oneClickRetweet: true,   // リツイートボタン1回でリツイートする
  mediaAllTab: true        // プロフィールに画像と動画をまとめた「メディア」タブを足す
};

const Settings = {
  async load() {
    try {
      const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
      return { ...DEFAULT_SETTINGS, ...stored };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  },
  onChange(callback) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") return;
      callback(changes);
    });
  }
};
