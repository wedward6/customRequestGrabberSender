// Reset stored list on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ documentRequests: [] });
});

// Helper: decide if details describes a document load
function isDocumentRequest(details) {
  // Only consider main_frame and sub_frame requests (exclude scripts, images, etc.)
  if (details.type !== "main_frame" && details.type !== "sub_frame") {
    return false;
  }

  // If response headers are available, prefer Content-Type check
  const headers = details.responseHeaders || [];
  const ct = headers.find(h => h.name && h.name.toLowerCase() === "content-type");
  if (ct && typeof ct.value === "string") {
    return ct.value.toLowerCase().includes("text/html");
  }

  // As a fallback, treat main_frame/sub_frame as document-like
  return true;
}

chrome.webRequest.onCompleted.addListener(
  (details) => {
    // Debug: log every completed request briefly
    console.log("[background] request completed:", details.method, details.url, "type=", details.type);

    if (!isDocumentRequest(details)) {
      // Debug skip
      console.log("[background] skipped (not document):", details.url, "type=", details.type);
      return;
    }

    chrome.storage.local.get({ documentRequests: [] }, (data) => {
      const stored = data.documentRequests || [];
      stored.push({
        url: details.url,
        method: details.method,
        type: details.type,
        time: new Date().toISOString()
      });
      chrome.storage.local.set({ documentRequests: stored }, () => {
        console.log("[background] captured document request:", details.url);
      });
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);
