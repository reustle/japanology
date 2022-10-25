import re
import urllib
import pandas as pd
from imdb import Cinemagoer
from imdb.helpers import sortedSeasons, sortedEpisodes


def grab_youtube_id(title):
    """
    Given episode title, searches the keywords: "Japanology {title}"
    on YouTube.com and returns the first result's video id.
    """
    search = urllib.parse.quote(f"Japanology {title}")
    url = f"https://www.youtube.com/results?search_query={search}"
    html = urllib.request.urlopen(url)
    video_id = re.findall(r"watch\?v=(\S{11})", html.read().decode())[0]

    return video_id


def get_episode_titles(series, season=1):
    """
    Given a season id, returns a list of episode titles.
    Japanology plus: tt3814338
    Begin Japanology: tt1420022
    """
    # create an instance of the Cinemagoer class
    if isinstance(series, int):
        ia = Cinemagoer()
        series = ia.get_movie(id)
        ia.update(series, "episodes")
    episodes = sortedEpisodes(series, season=None)
    episodes = [(ep["title"], ep["season"]) for ep in episodes]

    return episodes


def get_series_df(id, series_name):
    ia = Cinemagoer()
    series = ia.get_movie(id)
    ia.update(series, "episodes")
    eps = get_episode_titles(series)

    df = pd.DataFrame(eps, columns=["title", "season"])
    df["series"] = series_name
    df["vid"] = df["title"].apply(grab_youtube_id)

    return df


def get_all_eps():
    df_plus = get_series_df(3814338, "Japanology Plus")
    df_begin = get_series_df(1420022, "Begin Japanology")
    df = pd.concat([df_plus, df_begin])

    return df


def get_iframe(vid):
    return f'<iframe width="420" height="315" src="https://www.youtube.com/embed/{vid}"> </iframe>'


def make_markdown_page():
    df = get_all_eps()
    page = """
# Japanology Episodes
Season | Title | Video
--- | --- | ---
"""
    for _, row in df.iterrows():
        page += f"{row['season']} | {row['title']} | {get_iframe(row['vid'])}"
    with open("episodes.md", "w") as f:
        f.write(page)
