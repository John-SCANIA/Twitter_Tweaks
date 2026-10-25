(async () => {
  const settings = await Settings.load();

  for (const input of document.querySelectorAll("[data-key]")) {
    const key = input.dataset.key;
    if (input.type === "checkbox") input.checked = Boolean(settings[key]);
    else input.value = settings[key];
    input.addEventListener("change", () => {
      const value = input.type === "checkbox" ? input.checked : input.value;
      chrome.storage.sync.set({ [key]: value });
    });
  }

  const hidden = new Set(settings.hiddenSidebarItems);
  const container = document.getElementById("sidebar-items");
  for (const item of SIDEBAR_ITEMS) {
    const label = document.createElement("label");
    label.className = "row";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = hidden.has(item.id);
    input.addEventListener("change", () => {
      if (input.checked) hidden.add(item.id);
      else hidden.delete(item.id);
      chrome.storage.sync.set({ hiddenSidebarItems: [...hidden] });
    });
    label.append(input, " " + item.label);
    container.appendChild(label);
  }
})();
