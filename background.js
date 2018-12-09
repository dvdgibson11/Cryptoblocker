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
      console.log("Detected Miner: " + filters[i] + " URL: " + url);
      filters[i];
      if (typeof stor[filters[i]] === 'undefined') {
        stor[filters[i]] = 1;
      } else {
        stor[filters[i]] += 1;
      }
      storage.set({"counts": stor});
      return false;
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

var usages = {};
var alerted = {};
var checkwindow = 15;

function suspiciousUsage(arr) {
  if (Math.max(...arr) < 5) {
    return false;
  }
  return ((Math.max(...arr) - Math.min(...arr)) / Math.max(...arr) < 0.3);
}

function appendUsage (usage, tabID, PID) {
  return (function (tab) {
    if (chrome.runtime.lastError) {
    }
    if (typeof(tab) !== "undefined")  {
      if (typeof(tab.url) !== "undefined") {
        var key = PID + ", " + tabID + ", " + tab.url;
        if (typeof(usages[key]) === "undefined") {
          usages[key] = [];
        }
        if (usages[key].length >= checkwindow) {
          usages[key].shift();
        }
        usages[key].push(usage);
        if ((typeof(alerted[key]) === "undefined") && suspiciousUsage(usages[key]) && usages[key].length >= checkwindow) {
          console.log("MINER DETECTED IN PROCESSES", PID, "URL = ", tab.url);
          alert("Potential miner detected in site " + tab.url);
          alerted[key] = true;
          // chrome.processes.terminate(parseInt(PID));
        }
      }
    }
  });
}

function initProcessStats() {
  chrome.processes.onUpdatedWithMemory.addListener( 
    function (processes) {
      for (pid in processes) {
        console.log(usages);
        storage.set({"usage": usages});
        for (i in processes[pid].tasks) {
          if (i > 0){console.log("AAAAAAAAA"); }
          if (typeof(processes[pid].tasks[i].tabId) !== "undefined") {
            chrome.tabs.get( processes[pid].tasks[i].tabId, appendUsage(processes[pid].cpu, processes[pid].tasks[i].tabId, pid));
          }
        }
      }
  });
}


initBackground();
initProcessStats();