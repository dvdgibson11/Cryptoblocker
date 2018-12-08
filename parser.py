import numpy as np
with open("hosts.txt") as f:
  lines = [line.split() for line in f]

lines = np.array(lines)
lines = lines[:,1]

with open("filters.txt", "w") as f:
  for l in lines:
    f.write(l + "\n")