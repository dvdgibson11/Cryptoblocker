const filterURL = chrome.runtime.getURL('filters.txt');
var filters = new Set();

function parseFilters(text) {
  text = text.split("\n");
  filters = new Set(text);
}

function isMiningUrl(url) {
  reqURL =  new URL(url)
  if (filters.has(reqURL.hostname)) {
    console.log("Detected Miner: " + reqURL.hostname);
  }
}


function analyzeRequest(details){
  console.log(details);
  isMiningUrl(details.url);

}



function initBackground() {
  fetch(filterURL).then((response) => response.text()).then((text) => parseFilters(text));

  chrome.webRequest.onBeforeRequest.addListener(analyzeRequest, {urls: ["<all_urls>"], types: ['xmlhttprequest', 'websocket']});

}
initBackground();