from selenium import webdriver
from time import time
from time import sleep

devbinarypath = "C:\Program Files (x86)\Google\Chrome Dev\Application\chrome.exe"
chromedriverpath = r'C:\Users\David\Downloads\chromedriver_win32\chromedriver.exe'

options = webdriver.ChromeOptions()

options.binary_location = devbinarypath

options.add_argument('headless')

driver = webdriver.Chrome(executable_path = chromedriverpath, options=options)

times = []

for _ in range(10):

	start = time()
	driver.get('https://www.google.com')
	end = time()

	times.append(end - start)
	sleep(1)

print ('times:')
print (times)

print ('\navg time: ', sum(times) / len(times))