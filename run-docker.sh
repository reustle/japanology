docker run --rm --label=jekyll -e "POLLING=true" --volume=$(pwd):/srv/jekyll -it -p $(docker-machine ip `docker-machine active`):4000:4000 jekyll/jekyll
