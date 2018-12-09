from scipy.stats import ttest_ind
import json


with open('extensiontime.json') as f:
	ext = json.load(f)

with open('baselinetime.json') as f:
	base = json.load(f)

statistic, pvalue = ttest_ind(ext, base)

print ('pvalue is:', pvalue)

meanext = sum(ext) / len(ext)
meanbase = sum(base) / len(base)

print ('mean of ext is ', sum(ext) / len(ext))
print ('mean of base is', sum(base) / len(base))

print ('percentage increase is', (meanext - meanbase) / meanext)