document.getElementById("button1").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = new URL(tab.url);
  fetch(url.origin + "/some-endpoint", {
    method: "GET",
    credentials: "include"
  })
  .then(res => res.text())
  .then(data => alert("GET response: " + data))
  .catch(err => alert("GET failed: " + err));
});

document.getElementById("showCookies").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = new URL(tab.url);

  chrome.cookies.getAll({ domain: url.hostname }, function(cookies) {
    const cookieList = document.getElementById("cookieList");
    if (cookies.length === 0) {
      cookieList.textContent = "No cookies found.";
    } else {
      cookieList.textContent = cookies.map(c =>
        `${c.name} = ${c.value}`
      ).join("\n");
    }
  });
});

document.getElementById("showPosts").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { type: "GET_POSTS" }, (response) => {
    const postList = document.getElementById("postList");
    if (!response || response.posts.length === 0) {
      postList.textContent = "No POST requests found.";
    } else {
      postList.textContent = response.posts.map(url => `POST to: ${url}`).join("\n");
    }
  });
});