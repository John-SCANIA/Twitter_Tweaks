// 選んだ左サイドバーの項目をCSSで隠す。
(() => {
  let style = null;

  function css(hidden) {
    const selectors = SIDEBAR_ITEMS.filter((item) => hidden.includes(item.id))
      .flatMap((item) => item.selectors.map((s) => `header[role="banner"] nav ${s}`));
    return selectors.length ? `${selectors.join(",\n")} { display: none !important; }` : "";
  }

  TR.register({
    id: "sidebar",
    settingKey: null,
    apply(settings) {
      const text = css(settings.hiddenSidebarItems || []);
      if (!style) {
        style = document.createElement("style");
        style.id = "tr-sidebar";
      }
      if (style.textContent !== text) style.textContent = text;
      if (!style.isConnected && document.documentElement) document.documentElement.appendChild(style);
    }
  });
})();
