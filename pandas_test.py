import json
import os

import pandas

# Configure pandas' display to fit the terminal
pandas.options.display.max_colwidth = 40
pandas.options.display.width = 308

data_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'data')
data_names = os.listdir(data_dir)
if not data_names:
    exit("no data")
# Sort the data files by name to get the newest one
data_names.sort()
newest_data_name = data_names[-1]
filepath = os.path.join(data_dir, newest_data_name)

data = None
with open(filepath, 'r') as data_file:
    data = json.load(data_file)

issues = data['issues']
print pandas.DataFrame(issues).to_csv(encoding='utf-8')
