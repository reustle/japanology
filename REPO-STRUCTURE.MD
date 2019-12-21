### How the website works
1. The wesbite is hosted on github pages. [`index.html`](index.html) is served by GH pages.
2. [`index.html`](index.html)loads [`main.js`](static/main.js) which reads the episodes list stored in [`episodes.json`](static/episodes.json)
3. [`main.js`](static/main.js) generates the content of the webpage using the episode list
*****
### How [`episodes.json`](static/episodes.json) is generated
[`update-episodes.py`](update-episodes.py) grabs data from the google sheet and generates the JSON
