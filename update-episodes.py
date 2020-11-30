#!/usr/bin/env python

import re
import json
import pandas as pd
import urllib
from operator import itemgetter

def grab_youtube_id(title):
    """
    Given episode title, searches the keywords: "Japanology {title}"
    on YouTube.com and returns the first result's video id.
    """
    search = urllib.parse.quote(f'Japanology {title}')
    url = f"https://www.youtube.com/results?search_query={search}"
    html = urllib.request.urlopen(url)
    video_id = re.findall(r"watch\?v=(\S{11})", html.read().decode())[0]
    
    print(f'url: {video_id}   Episode: {title}')
    
    return video_id

if __name__ == "__main__":    
    
    # Load episode info
    update_links = True # set to False for hardcoded links from Sheet
    SHEET_KEY = '1rjtVle08VtK7AM9GMZ1zgQpTpctw0n9mCm8VOYN-Qso'
    doc_url = f'https://docs.google.com/spreadsheets/d/{SHEET_KEY}/export?format=csv'
    eps_df = pd.read_csv(doc_url)
    
    # Update YouTube links
    if update_links:
        eps_df['vid'] = eps_df['title'].apply(lambda x: grab_youtube_id(x))
    else:
        eps_df['vid'] = eps_df['video']
    
    # Format date
    eps_df['date'] = pd.to_datetime(eps_df['date']).dt.strftime('%b %d, %Y')
    
    # Index by season
    eps_df = eps_df.set_index('season')
    eps_df = eps_df[['id','title','date','vid']]

    # Get grouped dictionary of episodes per season
    eps_dict = eps_df.groupby(level=0).apply(lambda x: x.to_dict(orient='records')).to_dict()
    
    # Transform dict into expected format
    eps_dict = [{'id':str(season), 'episodes':eps_dict[season]} for season in eps_dict.keys()]
    eps_dict = sorted(eps_dict, key=itemgetter('id'), reverse=True)
    
    # Export dict as json file
    with open('static/episodes.json', 'w') as handle:
        handle.write(json.dumps(eps_dict, indent=2))
