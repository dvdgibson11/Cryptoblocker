# USAGE: python timing.py [url to time]

from selenium import webdriver
from time import time
from time import sleep
from scipy.stats import ttest_ind
import sys

# REPLACE WITH PATHS
devchannelbinarypath = 'path to dev channel binary'
chromedriverpath = r'path to chrome webdriver'
cryptoblockerpath = r'path to extension folder'
n = 32

url = sys.argv[1]

options = webdriver.ChromeOptions()

options.binary_location = devchannelbinarypath

driver = webdriver.Chrome(executable_path = chromedriverpath, options=options)

baseloadtimes = []
extloadtimes = []

# don't time first page load because first load is much slower due to caching
driver.get(url)

for _ in range(n):

	start = time()
	driver.get(url)
	end = time()
	baseloadtimes.append(end - start)
	sleep(1)

driver.quit()

meanbase = sum(baseloadtimes) / len(baseloadtimes)

print ('baseline times taken are')
print ('\nbaseline avg time is: ', meanbase)

options.add_argument(r'load-extension=' + cryptoblockerpath)

driver = webdriver.Chrome(executable_path = chromedriverpath, options=options)

# don't time first page load
driver.get(url)

for _ in range(n):

	start = time()
	driver.get(url)
	end = time()
	extloadtimes.append(end - start)
	sleep(1)

driver.quit()

meanext = sum(extloadtimes) / len(extloadtimes)

print ('extension times taken are')
print ('\nextension avg time is: ', meanext)

statistic, pvalue = ttest_ind(baseloadtimes, extloadtimes)
print ('pvalue is:', pvalue)
print ('percentage increase is', (meanext - meanbase) / meanext)
