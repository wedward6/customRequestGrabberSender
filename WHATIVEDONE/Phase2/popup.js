function renderList(items) {
  const container = document.getElementById("list");
  if (!items || items.length === 0) {
    container.textContent = "No document requests captured yet.";
    return;
  }

  container.innerHTML = items
    .map(i => {
      const t = new Date(i.time).toLocaleString();
      return `<div class="entry"><span class="time">[${t}]</span><span class="url">${i.method} <a href="${i.url}" target="_blank" rel="noopener noreferrer">${i.url}</a></span></div>`;
    })
    .join("");
}

// load and render
function load() {
  chrome.storage.local.get({ documentRequests: [] }, (data) => {
    renderList(data.documentRequests || []);
  });
}

document.getElementById("refresh").addEventListener("click", load);

document.getElementById("clear").addEventListener("click", () => {
  chrome.storage.local.set({ documentRequests: [] }, load);
});

document.addEventListener("DOMContentLoaded", load);
