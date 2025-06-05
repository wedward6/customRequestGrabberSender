let cachedRequests = [];

const extCheckbox = document.getElementById("useExtensionFilter");
const methodCheckbox = document.getElementById("useMethodFilter");

extCheckbox.addEventListener("change", () => {
  if (extCheckbox.checked) methodCheckbox.checked = false;
});

methodCheckbox.addEventListener("change", () => {
  if (methodCheckbox.checked) extCheckbox.checked = false;
});

document.getElementById("showRequests").addEventListener("click", () => {
  const useExtFilter = document.getElementById("useExtensionFilter").checked;
  const useMethodFilter = document.getElementById("useMethodFilter").checked;
  const ext = document.getElementById("extensionFilter").value;
  const method = document.getElementById("methodFilter").value;
  const list = document.getElementById("requestList");

  list.textContent = "";

  const filtered = cachedRequests.filter((entry) => {
    if (!entry || !entry.url) return false;

    const baseUrl = entry.url.split("?")[0];
    const matchesExt = ext === "all" || baseUrl.endsWith(ext);
    const matchesMethod = method === "all" || entry.method === method;

    if (useExtFilter && !matchesExt) return false;
    if (useMethodFilter && !matchesMethod) return false;

    return true;
  });

  list.textContent = filtered.length
    ? filtered.map(entry => `${entry.method} ${new URL(entry.url).pathname}`).join("\n")
    : "No matching requests.";
});

document.getElementById("clearRequests").addEventListener("click", () => {
    chrome.storage.local.set({ allRequests: [] }, () => {
      cachedRequests = [];
      const list = document.getElementById("requestList");
      list.textContent = "Requests cleared.";
      console.log("All requests cleared from storage and memory.");
    });
  });