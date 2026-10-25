// リツイートボタンを押したときに出る「リポスト／引用」メニューで、自動で「リポスト」を選ぶ。
// 取り消し（unretweet）は誤操作防止のため確認メニューを残す。
(() => {
  const PENDING = "data-tr-rt-pending";
  const TIMEOUT_MS = 1500;
  let style = null;

  function confirmWhenReady() {
    const root = document.documentElement;
    root.setAttribute(PENDING, "");
    const started = Date.now();
    const done = () => root.removeAttribute(PENDING);
    const tick = () => {
      const confirm = document.querySelector('[data-testid="retweetConfirm"]');
      if (confirm) {
        confirm.click();
        setTimeout(done, 300);
      } else if (Date.now() - started < TIMEOUT_MS) {
        requestAnimationFrame(tick);
      } else {
        done(); // メニューが見つからなければ普段通り表示する
      }
    };
    requestAnimationFrame(tick);
  }

  function onClick(event) {
    if (event.button !== 0 || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;
    if (!event.target.closest || !event.target.closest('[data-testid="retweet"]')) return;
    confirmWhenReady();
  }

  TR.register({
    id: "oneClickRetweet",
    settingKey: "oneClickRetweet",
    init() {
      document.addEventListener("click", onClick, true);
      style = document.createElement("style");
      // 自動で選ぶ間だけメニューを見えなくして、ちらつきを抑える
      style.textContent = `html[${PENDING}] [role="menu"], html[${PENDING}] [data-testid="Dropdown"] { opacity: 0 !important; }`;
      document.documentElement.appendChild(style);
    },
    cleanup() {
      document.removeEventListener("click", onClick, true);
      if (style) style.remove();
      style = null;
    }
  });
})();
