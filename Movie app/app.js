const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=a2fba8893e059bcb6fb80e0a9c1e55d6&query=';
const API_URL_TRENDING = 'https://api.themoviedb.org/3/trending/movie/week?api_key=a2fba8893e059bcb6fb80e0a9c1e55d6';
const API_URL_TOP_RATED = 'https://api.themoviedb.org/3/movie/top_rated?api_key=a2fba8893e059bcb6fb80e0a9c1e55d6&language=en-US&page=1';
const API_URL_UPCOMING = 'https://api.themoviedb.org/3/movie/upcoming?api_key=a2fba8893e059bcb6fb80e0a9c1e55d6&language=en-US&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        let searchtext = $('#searchText').val();
        if (searchtext) {
            getMovies(SEARCH_API + searchtext);
            $('.search-result').html(`Search results for "${searchtext}" :`);
            $('input').val('');
            e.preventDefault();
        }
    });
});

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    let movies = respData.results;
    let output = '';
    $.each(movies, (index, movie) => {
        const { poster_path, title, vote_average, id } = movie;

        if (poster_path) {
            output += `
            <div class="col">
                <div class="card h-100">
                    <img src="${IMG_PATH + poster_path}" class="card-img-top" alt="poster of ${title}">
                    <div class="card-body">
                        <h5 class="card-title text-white">${title}</h5>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-primary" onclick="getMovie(${id})">Movie details</button>
                        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
                    </div>
                </div>
            </div>`
        }
    });
    $('#movies').html(output);
}

$('.btnLink').on('click', e => {
    let chosenButton = e.currentTarget.id;
    $('.search-result').html(``);
    if (chosenButton === "trending") {
        getMovies(API_URL_TRENDING);
    }
    else if (chosenButton === "top") {
        getMovies(API_URL_TOP_RATED);
    }
    else if (chosenButton === "upcoming") {
        getMovies(API_URL_UPCOMING);
    }
});

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 6) {
        return 'orange'
    } else
        return 'red';
}

async function getMovie(movieId) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=a2fba8893e059bcb6fb80e0a9c1e55d6`);
    const respData = await resp.json();
    let movie = respData;

    const { backdrop_path, original_title, overview,
            imdb_id, id, release_date, runtime, genres } = movie;

    let output = `
    <div id="myModal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-white">${original_title}</h5>
                    <i onclick="$('#myModal').modal('hide')" class="fas fa-times"></i>
                </div>
                <div class="modal-body">
                    <img class="modal-img" src="${IMG_PATH + backdrop_path}" alt="poster of ${original_title}">
                    <ul class="list-group">
                        <li class="list-group-item">Genres: ${genres[0].name}, ${genres[1].name} </li>
                        <li class="list-group-item">Release date: ${release_date}</li>
                        <li class="list-group-item">Length: ${runtime} min</li>
                    </ul>
                    <p class="text-white overview">${overview}</p>
                </div>
                <div class="modal-footer">
                    <a class="nav-link" href="https://www.imdb.com/title/${imdb_id}" target="_blank"><button class="btn btn-outline-primary">View on IMDB</button></a>
                </div>
            </div>
        </div>
    </div>
    `
    $('#movie').html(output);
    $('#myModal').modal('show')
};