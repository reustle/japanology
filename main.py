from src import utils

if __name__ == "__main__":
    df = utils.get_all_eps()
    print(df)

    for ep in df["title"]:
        utils.grab_youtube_id(ep)
