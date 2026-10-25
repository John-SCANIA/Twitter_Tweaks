// ロゴ・ファビコン・タイトルをTwitterに戻す。
(() => {
  const BIRD_PATH =
    "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.850 2.313 3.198 4.352 3.234-1.595 1.250-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.510 2.093 7.140 2.093 8.570 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.910-.658 1.700-1.477 2.323-2.410z";
  // Xロゴのpathはこの形で始まる
  const X_PATH_PREFIX = "M18.244 2.25h3.308l-7.227 8.26";
  const MARK = "data-tr-bird";

  const faviconSvg = (color) =>
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${color}" d="${BIRD_PATH}"/></svg>`
    );

  let titleObserver = null;

  function fixTitle() {
    const t = document.title;
    let next = t.replace(/ \/ X$/, " / Twitter");
    if (next === "X") next = "Twitter";
    if (next !== t) document.title = next;
  }

  function replaceLogos(settings) {
    const selector = [
      `svg path[d^="${X_PATH_PREFIX}"]`,
      'a[aria-label="X"] svg path',          // サイドバー上部のロゴ
      `svg:not([${MARK}]) path[d*="h3.308l-7.227"]` // サイズ違いのXロゴ
    ].join(",");
    for (const path of document.querySelectorAll(selector)) {
      if (path.getAttribute("d") === BIRD_PATH) continue;
      const svg = path.closest("svg");
      path.setAttribute("d", BIRD_PATH);
      svg.setAttribute(MARK, "");
      if (settings.birdColor) {
        svg.style.color = settings.birdColor;
        svg.style.fill = settings.birdColor;
      }
    }
  }

  function replaceFavicon(settings) {
    const href = faviconSvg(settings.birdColor || "#1D9BF0");
    const links = document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]');
    if (links.length === 0 && document.head) {
      const link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
      link.href = href;
      return;
    }
    for (const link of links) {
      if (link.getAttribute("href") !== href) {
        link.setAttribute("type", "image/svg+xml");
        link.setAttribute("href", href);
      }
    }
  }

  TR.register({
    id: "branding",
    settingKey: "branding",
    init() {
      // <title> の書き換えはDOM全体の監視より先に反映させたいので個別に監視する
      titleObserver = new MutationObserver(fixTitle);
      const watchTitle = () => {
        const el = document.querySelector("head > title");
        if (el) titleObserver.observe(el, { childList: true, characterData: true, subtree: true });
      };
      watchTitle();
      document.addEventListener("DOMContentLoaded", watchTitle, { once: true });
    },
    apply(settings) {
      fixTitle();
      replaceLogos(settings);
      replaceFavicon(settings);
    },
    cleanup() {
      if (titleObserver) titleObserver.disconnect();
      titleObserver = null;
      // 元のロゴやファビコンに戻すにはページの再読み込みが確実
    }
  });
})();
