"use strict";

// Google Sheet ID
const SHEET = "17rkB73L_tcfhr4RugSekj07P8hVenTJu3b9Co_hPgQI";

const YT_VID = 'https://www.youtube.com/watch?v='
const YT_SEARCH = 'https://www.youtube.com/results?search_query=Japanology+'
const YT_IMG = 'https://i.ytimg.com/vi/'
const YT_IMG_FILE = '/mqdefault.jpg'
//const YT_IMG_FILE = '/default.jpg'

let DEFAULT_SEASON = 2019 // TODO Change to most recent


function renderEpisode(season, episode) {
    // Render an individual episode into the grid

    let url = ''
    let img = ''
    if(episode.video){
        url = YT_VID + episode.video
        img = YT_IMG + episode.video + YT_IMG_FILE
    }else{
        url = YT_SEARCH + encodeURIComponent(episode.title)
        img = '/static/missing-video.png'
    }

    let el = document.createElement('div')
    el.className += 'col mb-4'
    el.setAttribute('data-season', season)

    // Probably doesn't work on IE / Edge browsers
    el.innerHTML = `
        <div class="card h-100">
            <a href="${ url }" target="_blank">
                <img src="${ img }" class="card-img-top" style="min-height: 160px" alt="${ episode.title }">
                <div class="card-body">
                    <h6 class="card-title mb-0">${ episode.title }</h6>
                    <small class="text-muted">${ episode.date }</small>
                </div>
            </a>
        </div>`

    if(season != DEFAULT_SEASON){
        el.style.display = 'none'
    }

    document.querySelector('#episodes-container').appendChild(el)
}

function addSeasonTab(season) {
    // Add the nav tab for this season

    let active = ''
    if(DEFAULT_SEASON == season){
        active = 'active'
    }

    let tab = document.createElement('li')
    tab.className += 'nav-item'
    tab.setAttribute('data-season', season)
    tab.innerHTML = `<a class="nav-link ${active}" href="#">${ season }</a>`

    tab.onclick = function(e){
        e.preventDefault()
        showSeason(season)
    }


    document.querySelector('#season-nav').appendChild(tab)
}

function handleSeason(season) {
    // Handle a season

    // Add a tab for this season
    addSeasonTab(season.id)

    // Render the episodes
    // They are sorted by newest first already
    season.episodes.map(function(episode){
        renderEpisode(season.id, episode)
    })
}

function showSeason(season) {
    // Hide all episodes and show the selected season

    // Show the selected season episodes
    let episodes = document.querySelectorAll('#episodes-container>div')
    episodes = Array.prototype.slice.apply(episodes)
    episodes.map(function(ep){
        if(ep.getAttribute('data-season') == season) {
            ep.style.display = 'block'
        } else {
            ep.style.display = 'none'
        }
    })

    // Update the selected pill navigation
    let tabs = document.querySelectorAll('#season-nav>li')
    tabs = Array.prototype.slice.apply(tabs)
    tabs.map(function(tab){
        tab.querySelector('a').classList.remove('active')
        if(tab.getAttribute('data-season') == season.toString()){
            tab.querySelector('a').classList.add('active')
        }
    })
}

// Format the date as currently
const formatDate = raw => {
  const date = new Date(raw);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const groupBySeason = (chapters, chapter) => {
  // First make sure it's defined
  chapters[chapter.season] = chapters[chapter.season] || [];

  // Add the chapter to the episode listt
  chapters[chapter.season].push({
    id: Number(chapter.id),
    title: chapter.title,
    video: chapter.video,
    date: formatDate(chapter.date)
  });
  return chapters;
};

// Sort by id DESC
const byId = (a, b) => b.id - a.id;

drive(SHEET).then(chapters => {
  // First convert it to an object of { 2019: [...], 2018: [...], ... }
  const seasons = chapters.reduce(groupBySeason, {});

  // Convert that into an array of [{ id: 2019, episodes: [...] }, ...]
  // and sort both seasons and chapters by id DESC
  Object.entries(seasons)
    .map(([id, episodes]) => ({
      id: Number(id),
      episodes: episodes.sort(byId)
    }))
    .sort(byId)
    .forEach(handleSeason);
});


/*
// Activate the tooltips
$('[data-toggle="tooltip"]').tooltip();

// Update watched on startup
$('tr[data-id]').each(function(){
    var thisEp = $(this).attr('data-id');
    if(thisEp && Session.get('watched-' + thisEp)){
        $(this).addClass('table-success');
        $(this).find('input[type=checkbox]').prop('checked', true);
    }
});

// Hide other season tables
$('table[data-season]').hide();
$('table[data-season=2019]').show();
$('.nav-link').first().addClass('active');

// Handle season tab click
$('a[data-season]').click(function(e){
    e.preventDefault();

    $('.nav-tabs .active').removeClass('active');
    $(this).addClass('active');

    $('table[data-season]').hide();
    $('table[data-season=' + $(this).attr('data-season') + ']').show();

});

// Handle watched toggle
$('input[type=checkbox]').click(function(e){

    var parentTr = $(this).parents('tr');
    var episode = parentTr.attr('data-id');
    var watched = $(this).is(':checked');

    if(watched){
        Session.set('watched-' + episode, true);
        parentTr.addClass('table-success');
    }else{
        Session.set('watched-' + episode, undefined);
        parentTr.removeClass('table-success');
    }

    $(this).blur();
});

*/
