const filterURL = chrome.runtime.getURL('filters.txt');
var filters = new Set();

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
      return true;
    }
  }
  return false;
}

function analyzeRequest(details){
  return {cancel: isMiningUrl(details.url)};
}

function initBackground() {
  fetch(filterURL).then((response) => response.text()).then((text) => parseFilters(text));

  chrome.webRequest.onBeforeRequest.addListener(analyzeRequest, {urls: ["<all_urls>"]}, ["blocking"]);
}

initBackground();