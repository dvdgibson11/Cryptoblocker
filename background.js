const filterURL = chrome.runtime.getURL('filters.txt');
var filters = new Set();
// var storage = chrome.storage.local;
// var stor = {};

// storage.get("counts", function(result) {
//   stor = {};
// })


function parseFilters(text) {
  filters = text.split("\n");
  for (var i in filters) {
    filters[i] = filters[i].trim();
  }
  filters.splice(-1,1)
}

function isMiningUrl(url) {
  for (var i in filters) {
    if (url.includes(filters[i])) {
      console.log("Detected Miner: " + filters[i] + " URL: " + url);
      return true;
    }
  }
  return false;
}

function analyzeRequest(details){
  return {cancel: isMiningUrl(details.url)};
}

function initBackground() {
  // chrome.storage.local.get(null, function(items) { // null implies all items
    // Convert object to a string.
    // var result = JSON.stringify(items);

    // Save as file
    // var url = 'data:application/json;base64,' + btoa(result);
  //   chrome.downloads.download({
  //       url: url,
  //       filename: 'counts.json'
  //   });
  // });
  fetch(filterURL).then((response) => response.text()).then((text) => parseFilters(text));

  chrome.webRequest.onBeforeRequest.addListener(analyzeRequest, {urls: ["<all_urls>"]}, ["blocking"]);
}

var usages = {};
var actives = {};
var alerted = {};
var checkwindow = 15;
var graceperiod = 5;
var killmessage = ". Kill process? (this message will only appear once per tab)"

function suspiciousUsage(arr, url, PID) {
  if (Math.min(...arr[0]) < 5 || arr[0].length < (checkwindow + graceperiod)) {
    return false;
  }
  // general high usage check
  if (Math.min(...arr[0].slice(-checkwindow)) > 150) {
    if (confirm("Detected consistent high CPU usage in tab " + url + killmessage)) {
      chrome.processes.terminate(parseInt(PID));
    }
    return true;
  }
  // consistent usage check
  if ((Math.max(...arr[0]) - Math.min(...arr[0].slice(-checkwindow))) / Math.max(...arr[0].slice(-checkwindow)) < 0.15) {
    if (confirm("Detected suspicious pattern of non-varying CPU usage in tab " + url + killmessage)) {
      chrome.processes.terminate(parseInt(PID));
    }
    return true;
  }
  // high background usage check
  var streak = 0;
  for (var i = 0; i < checkwindow; i++) {
    if (!arr[1][i+graceperiod] && arr[0][i+graceperiod] > 50) {
      streak ++;
    }
    else {
      streak = 0;
    }
    if (streak >= 8) {
      if (confirm("Detected suspicious streak of high cpu usage in non-active tab " + url + killmessage)) {
        chrome.processes.terminate(parseInt(PID));
      }
      return true;
    }
  }

  return false;
}

function appendUsage (usage, tabID, PID) {
  return (function (tab) {
    if (chrome.runtime.lastError) {
    }
    if (typeof(tab) !== "undefined")  {
      if (typeof(tab.url) !== "undefined") {
        var key = PID + ", " + tabID + ", " + tab.url;
        if (typeof(usages[key]) === "undefined") {
          usages[key] = [[], []]
        }
        if (usages[key][0].length >= checkwindow + graceperiod) {
          usages[key][0].shift();
          usages[key][1].shift();
        }
        usages[key][0].push(usage);
        usages[key][1].push(tab.active);
        if ((typeof(alerted[key]) === "undefined") && suspiciousUsage(usages[key], tab.url, PID)) {
          console.log("Potential miner detected in process", PID, ", URL = ", tab.url);
          alerted[key] = true;
        }
      }
    }
  });
}

function initProcessStats() {
  chrome.processes.onUpdatedWithMemory.addListener( 
    function (processes) {
      for (pid in processes) {
        // storage.set({"usage": usages});
        for (i in processes[pid].tasks) {
          if (typeof(processes[pid].tasks[i].tabId) !== "undefined") {
            chrome.tabs.get( processes[pid].tasks[i].tabId, appendUsage(processes[pid].cpu, processes[pid].tasks[i].tabId, pid));
          }
        }
      }
  });
}

initBackground();
initProcessStats();