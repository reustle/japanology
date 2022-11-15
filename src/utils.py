import re
import urllib
import pandas as pd
import markdown
from pathlib import Path
from imdb import Cinemagoer
from imdb.helpers import sortedSeasons, sortedEpisodes


####################
# Misc
####################
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


def get_iframe(vid):
    prefix = '<iframe width="420" height="315" src='
    url = f'"https://www.youtube.com/embed/{vid}"'
    suffix = "> </iframe>"
    return prefix + url + suffix


def make_markdown_page(df):
    header = """# Japanology Episodes

Weekend Japanology               | Begin Japanology               | Japanology Plus
-------------------------------- | ------------------------------ | ---------------
[1](weekend-japanology/season-1) | [1](begin-japanology/season-1) | [1](japanology-plus/season-1)
[2](weekend-japanology/season-2) | [2](begin-japanology/season-2) | [2](japanology-plus/season-2)
                                 | [3](begin-japanology/season-3) | [3](japanology-plus/season-3)
                                 | [4](begin-japanology/season-4) | [4](japanology-plus/season-4)
                                 | [5](begin-japanology/season-5) | [5](japanology-plus/season-5)
                                 | [6](begin-japanology/season-6) | 
                                 | [7](begin-japanology/season-7) |

"""
    df["vid"] = df["vid"].apply(get_iframe)

    for series in ["Weekend Japanology", "Begin Japanology", "Japanology Plus"]:
        series_header = f"""

## {series}

"""
        for season in df[df["series"] == series]["season"].unique():
            season_header = f"""

### Season {season}

"""
            md = df[(df["series"] == series) & (df["season"] == season)][
                ["Episode", "Name", "Air Date", "vid"]
            ].to_markdown(
                index=False,
                tablefmt="github",
            )

            page = Path(f"static/{series.lower().replace(' ','-')}/season-{season}.md")
            page.parent.mkdir(exist_ok=True, parents=True)

            with open(page, "w+", encoding="utf-8") as f:
                page = header + series_header + season_header + md
                html = markdown.markdown(page, extensions=["tables"])
                f.write(html)


####################
# Wiki
####################
def clean_wiki_table(df_list, series):
    for i, df in enumerate(df_list, start=1):
        df["series"] = series
        df["season"] = i
        df["vid"] = df["Name"].apply(grab_youtube_id)
        df.rename(
            {"Air date": "Air Date", "#": "Episode"}, axis="columns", inplace=True
        )
        df.insert(0, "season", df.pop("season"))
        df.insert(0, "series", df.pop("series"))


def get_all_eps_wiki(save=True):
    # Info
    url = "https://en.wikipedia.org/wiki/Begin_Japanology"
    tables = pd.read_html(url)

    # N seasons per show
    n_seasons_weekend = 2
    n_seasons_begin = 7

    # Create df's
    weekend_japanology = tables[:n_seasons_weekend]
    begin_japanology = tables[n_seasons_weekend : n_seasons_weekend + n_seasons_begin]
    japanology_plus = tables[n_seasons_weekend + n_seasons_begin :]

    # Add series info
    clean_wiki_table(weekend_japanology, "Weekend Japanology")
    clean_wiki_table(begin_japanology, "Begin Japanology")
    clean_wiki_table(japanology_plus, "Japanology Plus")

    # Merge df's
    df = pd.concat(begin_japanology + weekend_japanology + japanology_plus)

    if save:
        df.to_csv("episodes.csv", index=False)

    return df


####################
# IMDB
####################
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
