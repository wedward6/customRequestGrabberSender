
chrome.storage.local.set({ allRequests: [] });
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ allRequests: [] });
  });
  
  chrome.webRequest.onCompleted.addListener(
    (details) => {
      chrome.storage.local.get(["allRequests"], (data) => {
        const requests = data.allRequests || [];
        requests.push({
          url: details.url,
          method: details.method
        });
        chrome.storage.local.set({ allRequests: requests });
      });
    },
    { urls: ["<all_urls>"] }
  );
