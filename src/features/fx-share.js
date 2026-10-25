// ツイート下のShareボタンを、fxtwitter.com のURLをコピーするボタンに置き換える。
// Xの要素は消さずに隠し、見た目を合わせるためにShareボタンを複製して使う。
(() => {
  const MARK = "data-tr-fx";
  const LINK_PATH =
    "M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z";
  const CHECK_PATH = "M9 20c-.264 0-.52-.104-.707-.293l-4.785-4.785c-.39-.39-.39-1.023 0-1.414s1.023-.39 1.414 0l3.946 3.945L18.075 4.41c.32-.45.94-.558 1.395-.24.45.318.56.942.24 1.394L9.817 19.577c-.17.24-.438.395-.732.42-.028.002-.057.003-.085.003z";
  const KNOWN_TESTIDS = ["reply", "retweet", "unretweet", "like", "unlike", "bookmark", "removeBookmark"];

  function tweetUrl(article) {
    // 本文の投稿時刻のリンクが、そのツイート自身のURL
    for (const time of article.querySelectorAll("a[href*='/status/'] time")) {
      const href = time.closest("a").getAttribute("href");
      const m = href.match(/^\/([^/]+)\/status\/(\d+)/);
      if (m) return `https://fxtwitter.com/${m[1]}/status/${m[2]}`;
    }
    // 時刻リンクがない場合（詳細表示など）は現在のURLから
    const m = location.pathname.match(/^\/([^/]+)\/status\/(\d+)/);
    return m ? `https://fxtwitter.com/${m[1]}/status/${m[2]}` : null;
  }

  function findShareWrapper(group) {
    // 操作バーの各ボタンを包む要素のうち、既知のボタンでも分析リンクでもないものがShare
    for (const wrapper of group.children) {
      if (wrapper.hasAttribute(MARK)) continue;
      const button = wrapper.querySelector("button");
      if (!button) continue;
      const testid = button.getAttribute("data-testid");
      if (testid && KNOWN_TESTIDS.includes(testid)) continue;
      if (wrapper.querySelector("a[href*='/analytics']")) continue;
      return wrapper;
    }
    return null;
  }

  function setIcon(button, d) {
    const path = button.querySelector("svg path");
    if (path) path.setAttribute("d", d);
  }

  function buildButton(shareWrapper, article) {
    const clone = shareWrapper.cloneNode(true);
    clone.setAttribute(MARK, "button");
    clone.removeAttribute("style");
    const button = clone.querySelector("button");
    button.removeAttribute("data-testid");
    button.setAttribute("aria-label", "fxtwitterのリンクをコピー");
    button.title = "fxtwitterのリンクをコピー";
    // 複製したSVGがアイコン1つになるよう、pathを1本にする
    const svg = button.querySelector("svg");
    if (svg) {
      svg.innerHTML = "";
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", LINK_PATH);
      g.appendChild(path);
      svg.appendChild(g);
    }
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const url = tweetUrl(article);
      if (!url) return;
      try {
        await navigator.clipboard.writeText(url);
        setIcon(button, CHECK_PATH);
        button.style.color = "rgb(0, 186, 124)";
        setTimeout(() => {
          setIcon(button, LINK_PATH);
          button.style.color = "";
        }, 1500);
      } catch (e) {
        prompt("コピーできませんでした。このURLを手動でコピーしてください：", url);
      }
    }, true);
    return clone;
  }

  TR.register({
    id: "fxShare",
    settingKey: "fxShareButton",
    apply() {
      for (const article of document.querySelectorAll('article[data-testid="tweet"]')) {
        const group = article.querySelector('[role="group"]');
        if (!group || group.querySelector(`[${MARK}="button"]`)) continue;
        const share = findShareWrapper(group);
        if (!share) continue;
        share.style.display = "none";
        share.setAttribute(MARK, "hidden");
        share.after(buildButton(share, article));
      }
    },
    cleanup() {
      document.querySelectorAll(`[${MARK}="button"]`).forEach((el) => el.remove());
      document.querySelectorAll(`[${MARK}="hidden"]`).forEach((el) => {
        el.style.display = "";
        el.removeAttribute(MARK);
      });
    }
  });
})();
