from selenium import webdriver
from time import time
from time import sleep
import json

devbinarypath = "C:\Program Files (x86)\Google\Chrome Dev\Application\chrome.exe"
chromedriverpath = r'C:\Users\David\Downloads\chromedriver_win32\chromedriver.exe'
extensionpath = r'C:\Users\David\SchoolWork\Senior Year\CS 263\Cryptoblocker'

url = 'https://www.youtube.com'

options = webdriver.ChromeOptions()

options.binary_location = devbinarypath

# options.add_argument(r'load-extension=' + extensionpath)

driver = webdriver.Chrome(executable_path = chromedriverpath, options=options)

loadtimes = []

driver.get(url)

for _ in range(33):

	start = time()
	driver.get(url)
	end = time()
	loadtimes.append(end - start)
	sleep(1)

print ('times taken are')
print (loadtimes)
print ('\navg time is: ', sum(loadtimes) / len(loadtimes))

with open('baselinetime.json', 'w') as f:
	json.dump(loadtimes, f)
