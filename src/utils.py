import pandas as pd
from imdb import Cinemagoer
from imdb.helpers import sortedSeasons, sortedEpisodes


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

    return df


def get_all_eps():
    df_plus = get_series_df(3814338, "Japanology Plus")
    df_begin = get_series_df(1420022, "Begin Japanology")
    df = pd.concat([df_plus, df_begin])

    return df
