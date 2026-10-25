// 機能の登録とDOM監視の共通基盤。
// 各機能は TR.register({ id, settingKey, init, apply, cleanup }) で登録する。
//   init(settings)    : 有効化時に一度だけ呼ばれる
//   apply(settings)   : DOMが変わるたびに呼ばれる（冪等に書くこと）
//   cleanup()         : 無効化時に呼ばれる
const TR = (() => {
  const features = [];
  const active = new Set();
  let settings = null;
  let scheduled = false;

  function register(feature) {
    features.push(feature);
  }

  function isEnabled(feature) {
    return !feature.settingKey || Boolean(settings[feature.settingKey]);
  }

  function sync() {
    for (const f of features) {
      const on = isEnabled(f);
      if (on && !active.has(f.id)) {
        active.add(f.id);
        f.init && f.init(settings);
      } else if (!on && active.has(f.id)) {
        active.delete(f.id);
        f.cleanup && f.cleanup(settings);
      }
    }
    runApply();
  }

  function runApply() {
    scheduled = false;
    for (const f of features) {
      if (active.has(f.id) && f.apply) {
        try {
          f.apply(settings);
        } catch (e) {
          console.warn("[Twitter Restorer]", f.id, e);
        }
      }
    }
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(runApply);
  }

  async function start() {
    settings = await Settings.load();
    sync();
    new MutationObserver(scheduleApply).observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["href", "d"]
    });
    Settings.onChange((changes) => {
      for (const [key, { newValue }] of Object.entries(changes)) {
        settings[key] = newValue;
      }
      sync();
    });
  }

  return { register, start, get settings() { return settings; } };
})();
