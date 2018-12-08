const filterURL = chrome.runtime.getURL('filters.txt');
var filters = new Set();
var storage = chrome.storage.local;
var stor = {}

storage.get("counts", function(result) {
  stor = {};
})

function parseFilters(text) {
  filters = text.split("\n");
  for (var i in filters) {
    filters[i] = filters[i].trim();
  }
  filters.splice(-1,1)
  console.log(filters)
}

function isMiningUrl(url) {
  for (var i in filters) {
    if (url.includes(filters[i])) {
      console.log("Detected Miner: " + filters[i]);
      filters[i];
      if (typeof stor[filters[i]] === 'undefined') {
        stor[filters[i]] = 1;
      } else {
        stor[filters[i]] += 1;
      }
      storage.set({"counts": stor});
      return true;
    }
  }
  return false;
}

function analyzeRequest(details){
  return {cancel: isMiningUrl(details.url)};
}

function initBackground() {
  chrome.storage.local.get(null, function(items) { // null implies all items
    // Convert object to a string.
    var result = JSON.stringify(items);

    // Save as file
    var url = 'data:application/json;base64,' + btoa(result);
    chrome.downloads.download({
        url: url,
        filename: 'counts.json'
    });
  });
  fetch(filterURL).then((response) => response.text()).then((text) => parseFilters(text));

  chrome.webRequest.onBeforeRequest.addListener(analyzeRequest, {urls: ["<all_urls>"]}, ["blocking"]);
}

initBackground();