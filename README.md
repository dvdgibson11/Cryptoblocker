# Cryptoblocker

A chrome extension to dynamically block cryptocurrency miners.

It consists of a blacklist of known miner script sources, as well as dynamic resource consumption based heuristic checks to detect other mining scripts.

The blacklist is sourced from https://zerodot1.gitlab.io/CoinBlockerListsWeb/index.html?fbclid=IwAR2n5RQnmhtHcWXt0gN-H8UfYrcyNjHKHPma3llFlRZV55FNdk1NLfbSvb4

# Installation

Cryptoblocker requires the Google Chrome Dev Channel, which can be downloaded from https://www.google.com/chrome/dev/?platform=win64.
Once that has been done, clone the repo then add the extension to Google Chrome Dev. This can be done by visiting chrome://extensions , turning on developer mode, then loading an unpacked extension. Simply navigate to the git repo and load.

# Testing
To test the extension, visit sites such as https://www.thehopepage.org or https://www.salon.com. Thehopepage scripts will be blocked by the blacklist, but salon.com scripts are usually not. They are caught by the heuristics analysis, however. The dynamic heuristics analysis requires staying on a page for some time in order to collect usage statistics, and might take a minute or so to go off. The most noticeable detectable feature of miners such as salon.com's is the inactive tab usage detection, so changing to another tab while salon.com is loaded may result in faster detection (although the consistency heuristic should also catch it given some time).

To test cryptojacking in the wild, visit sites such as filmyhd.cz or megapastes.com (WARNING: ONLY VISIT THESE SITES IN A VIRTUAL MACHINE FOR SECURITY REASONS). Most cryptojacking sites are extremely shady, so caution should be used when testing in this way. 

To explicitly test the heuristics analysis by disabling the blacklist, line 23 of background.js can be changed from "return true;" to "return false;". 
