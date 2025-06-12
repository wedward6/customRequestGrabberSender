(() => {
    window._postRequests = [];
  
    const trackPost = (url) => {
      window._postRequests.push(url);
    };
  
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      if (args[1] && args[1].method === "POST") {
        trackPost(args[0]);
      }
      return originalFetch.apply(this, args);
    };
  
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends originalXHR {
      open(method, url, ...rest) {
        if (method === "POST") {
          trackPost(url);
        }
        return super.open(method, url, ...rest);
      }
    };
  
    // Listen for extension message to get post requests
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === "GET_POSTS") {
        sendResponse({ posts: window._postRequests });
      }
    });
  })();
  