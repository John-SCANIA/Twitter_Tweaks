// プロフィールのタブ列に、画像と動画をまとめて見られる「メディア（すべて）」タブを足す。
// Xのメディア欄自体は動画と画像に分かれてしまったので、検索の
// 「from:ユーザー filter:media」のメディア表示を開く。
(() => {
  const MARK = "data-tr-media-all";
  const PROFILE_TAB = /^\/([A-Za-z0-9_]{1,15})\/(with_replies|highlights|articles|media|videos|photos|likes|reposts|superfollows)$/;

  function findProfileTabs() {
    for (const tablist of document.querySelectorAll('[data-testid="primaryColumn"] [role="tablist"]')) {
      const tabs = [...tablist.querySelectorAll('a[role="tab"]')];
      for (const tab of tabs) {
        const m = (tab.getAttribute("href") || "").match(PROFILE_TAB);
        if (m) return { tablist, tabs, user: m[1] };
      }
    }
    return null;
  }

  function searchUrl(user) {
    const q = encodeURIComponent(`from:${user} filter:media`);
    return `/search?q=${q}&src=typed_query&f=media`;
  }

  function buildTab(source, user) {
    // タブを包む要素ごと複製して、Xのタブと同じ見た目にする
    const wrapper = source.closest('[role="presentation"]') || source;
    const clone = wrapper.cloneNode(true);
    clone.setAttribute(MARK, user);
    const link = clone.matches("a") ? clone : clone.querySelector("a");
    link.setAttribute("href", searchUrl(user));
    link.setAttribute("aria-selected", "false");
    link.removeAttribute("data-testid");
    // 選択中の下線を消し、文字を差し替える
    link.querySelectorAll("div").forEach((div) => {
      if (!div.children.length && !div.textContent.trim()) div.remove();
    });
    const label = [...link.querySelectorAll("span")].find((s) => s.textContent.trim()) || link;
    label.textContent = "メディア(すべて)";
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      event.stopPropagation();
      location.assign(searchUrl(user));
    }, true);
    return clone;
  }

  TR.register({
    id: "mediaAllTab",
    settingKey: "mediaAllTab",
    apply() {
      const found = findProfileTabs();
      if (!found) return;
      const existing = found.tablist.querySelector(`[${MARK}]`);
      if (existing) {
        if (existing.getAttribute(MARK) === found.user) return;
        existing.remove(); // 別のプロフィールに移動した
      }
      // 選択されていないタブを見本にする
      const source = found.tabs.find((t) => t.getAttribute("aria-selected") !== "true") || found.tabs[0];
      const lastTab = found.tabs[found.tabs.length - 1];
      const anchor = lastTab.closest('[role="presentation"]') || lastTab;
      anchor.after(buildTab(source, found.user));
    },
    cleanup() {
      document.querySelectorAll(`[${MARK}]`).forEach((el) => el.remove());
    }
  });
})();
