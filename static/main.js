"use strict";

const YT_VID = 'https://www.youtube.com/watch?v='
const YT_SEARCH = 'https://www.youtube.com/results?search_query=Japanology+'
const YT_IMG = 'https://i.ytimg.com/vi/'
const YT_IMG_FILE = '/mqdefault.jpg'
//const YT_IMG_FILE = '/default.jpg'

let selectedSeason = 2019 // TODO Change to most recent
function setSelectedSeason() {
    let hash = window.location.hash
    hash = hash.replace('#', '')
    if(hash.length == 4){
        try {
            selectedSeason = parseInt(hash)
        } catch(e) {
            // Invalid hash
        }
    }
}
setSelectedSeason()


function renderEpisode(season, episode) {
    // Render an individual episode into the grid
    
    let url = ''
    let img = ''
    if(episode.vid){
        url = YT_VID + episode.vid
        img = YT_IMG + episode.vid + YT_IMG_FILE
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
    
    if(season != selectedSeason){
        el.style.display = 'none'
    }
    
    document.querySelector('#episodes-container').appendChild(el)
}

function addSeasonTab(season) {
    // Add the nav tab for this season
    
    let active = ''
    if(selectedSeason == season){
        active = 'active'
    }

    let tab = document.createElement('li')
    tab.className += 'nav-item'
    tab.setAttribute('data-season', season)
    tab.innerHTML = `<a class="nav-link ${active}" href="#${ season }">${ season }</a>`
    
    tab.onclick = function(e){
        showSeason(season)
    }
    
    
    document.querySelector('#season-nav').appendChild(tab)
}

function handleSeason(season) {
    // Handle a season
    
    // Add a tab for this season
    addSeasonTab(season.id)

    // Render the episodes
    season.episodes.map(function(episode){
        renderEpisode(season.id, episode)
    })
}

function showSeason(season) {
    // Hide all episodes and show the selected season
    
    selectedSeason = season
    
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

fetch("static/episodes.json")
  .then((resp) => resp.json()) // Transform the data into json
  .then(function(seasons) {

    seasons.map(function(season){
        handleSeason(season)
    })

  })



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
