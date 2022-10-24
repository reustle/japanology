#!/usr/bin/env python3

import requests
import json
from time import sleep
from alive_progress import alive_bar

ENDPOINT = (
    "https://www.youtube.com/oembed?format=json&url=http://www.youtube.com/watch?v="
)


def pull_episode(video_id):
    """Pull the json detials of a specific episode"""

    path = f"{ENDPOINT}{video_id}"
    return requests.get(path)


def load_seasons_file():
    """Load the episodes file"""

    handle = open("static/episodes.json", "r")
    contents = handle.read()
    handle.close()

    return json.loads(contents)


def count_episodes(seasons):
    """Return the total number of episodes"""

    count = sum([len(season["episodes"]) for season in seasons])
    return count


def check_episodes(seasons):
    """Check for broken episodes within each season"""

    ep_count = count_episodes(seasons)

    # Run the visual bar chart
    with alive_bar(ep_count, spinner="dots_reverse") as bar:
        for season in seasons:
            for episode in season["episodes"]:

                # Skip if no youtube video defined
                if not episode["vid"]:
                    continue

                # Load json
                video_details = pull_episode(episode["vid"])

                if video_details.status_code != 200:
                    print(
                        f"{episode['title']}\t\t{episode['date']}\t\t{episode['vid']}"
                    )

                bar()
                sleep(1)


if __name__ == "__main__":
    print("Checking for broken episodes...")
    seasons = load_seasons_file()

    check_episodes(seasons)
