import pandas as pd
from src import utils

if __name__ == "__main__":
    df = pd.read_csv("static/episodes.csv")
    utils.make_markdown_page(df)
