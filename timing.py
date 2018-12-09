from selenium import webdriver
from time import time
from time import sleep

devbinarypath = "C:\Program Files (x86)\Google\Chrome Dev\Application\chrome.exe"
chromedriverpath = r'C:\Users\David\Downloads\chromedriver_win32\chromedriver.exe'
extensionpath = r'C:\Users\David\SchoolWork\Senior Year\CS 263\Cryptoblocker'

options = webdriver.ChromeOptions()

options.binary_location = devbinarypath

options.add_argument(r'load-extension=' + extensionpath)

driver = webdriver.Chrome(executable_path = chromedriverpath, options=options)

start = time()
driver.get('https://www.thehopepage.org')
end = time()

print ('time taken: ', end - start)