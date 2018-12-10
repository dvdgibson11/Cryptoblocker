from selenium import webdriver
from time import time
from time import sleep
from scipy.stats import ttest_ind
import sys

devchannelbinarypath = "C:\Program Files (x86)\Google\Chrome Dev\Application\chrome.exe"
chromedriverpath = r'C:\Users\David\Downloads\chromedriver_win32\chromedriver.exe'
cryptoblockerpath = r'C:\Users\David\SchoolWork\Senior Year\CS 263\Cryptoblocker'
n = 32

url = sys.argv[1]

options = webdriver.ChromeOptions()

options.binary_location = devchannelbinarypath

driver = webdriver.Chrome(executable_path = chromedriverpath, options=options)

baseloadtimes = []
extloadtimes = []

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
print (baseloadtimes)
print ('\nbaseline avg time is: ', meanbase)

options.add_argument(r'load-extension=' + cryptoblockerpath)

driver = webdriver.Chrome(executable_path = chromedriverpath, options=options)

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
print (extloadtimes)
print ('\nextension avg time is: ', meanext)

statistic, pvalue = ttest_ind(baseloadtimes, extloadtimes)
print ('pvalue is:', pvalue)
print ('percentage increase is', (meanext - meanbase) / meanext)
