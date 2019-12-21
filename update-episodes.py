#!/usr/bin/env python

import requests, csv, pprint, json
from operator import itemgetter
from datetime import datetime

GOOGLE_SHEETS = 'https://docs.google.com/spreadsheets/d/{0}/export?format=csv'
SHEET_KEY = '1rjtVle08VtK7AM9GMZ1zgQpTpctw0n9mCm8VOYN-Qso'

# Build Doc URL
doc_url = GOOGLE_SHEETS.format(SHEET_KEY)

# Request File
req = requests.get(doc_url)
raw_data = req.text
raw_data = raw_data.encode('utf-8')
raw_data = raw_data.split('\r\n')

# Parse CSV Data
csv_reader = csv.reader(raw_data)
csv_data = list(csv_reader)

# Build Dictionary
episodes = {}
for ep in csv_data:
    
    # Skip first row and empty rows
    try:
        int(ep[0])
    except ValueError:
        continue
    
    # Label the data
    ep_season = int(ep[0])
    episode = {
        'id': int(ep[1]),
        'title': ep[2],
        'date': datetime.strptime(ep[3], '%Y-%m-%d').strftime('%b %-d, %Y'),
        'vid': None if (ep[4] == '') else ep[4],
    }
    
    # Add the season key if it doesn't exist
    if not episodes.get(ep_season):
        episodes[ep_season] = []
    
    # Inject the episode into the list
    episodes[ep_season].append(episode)

# Transform the episodes dict into the final structure
seasons_coll = []
for season in episodes.keys():
    seasons_coll.append({
        'id': season,
        'episodes': episodes[season],
    })

seasons_coll = sorted(seasons_coll, key=itemgetter('id'), reverse=True) 

# Output the Episodes Dictionary as JSON file
handle = open('static/episodes.json', 'w')
handle.write(json.dumps(seasons_coll, indent=2))
handle.close()

