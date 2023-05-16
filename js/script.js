var APIURL ='https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=47f9f40a1d4ef8eb3fd7dc23d4bba6bf&page=1';

// for show movies if we need to go this route with descriptions (possibly use this and append "learn more" wiki link)
// <div class="overview">
//<h3>Overview:</h3>
//${overview}
//</div> 

var IMGPATH = 'https://image.tmdb.org/t/p/w1280';
var SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=47f9f40a1d4ef8eb3fd7dc23d4bba6bf&query=";

var main = document.getElementById('main');
var form = document.getElementById('form');
var search = document.getElementById('search');
var pastSearchesArray = 
    JSON.parse(localStorage.getItem("pastSearches"))
    || [];
console.log(pastSearchesArray);
var plot = document.getElementById('moviePlot');
var popup = document.getElementById('popup');
var btnPopupClose = document.getElementById('btn-popup-close');
var popupMovieTitle = document.getElementById('popup-movie-title');

getMovies(APIURL);

//waits for url request to show movie data
async function getMovies(url) {
    var resp = await fetch(url);
    var respData = await resp.json();

    showMovies(respData.results);

    return respData;
};
// gets movie data (poster,title,rating) from api request and creates img and info class and appends them to main on html 
function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach(movie => {
        var { poster_path, title, vote_average } = movie;   // add overview - if we decide to use from tmdb

        var movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img 
              src="${IMGPATH + poster_path}" 
              alt="${title}"
            />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
                <button class="btn-plot button is-warning" data-attr="${title}">Get Info</button>
            </div>   
            `;
        main.appendChild(movieEl);
    });
    // Adding an event listener to the get more info button
    document.querySelectorAll(".btn-plot").forEach(element => element.addEventListener("click", getPlot));

}

// adds color coding to rating WIP
function getClassByRate(vote) {
    if (vote > 8) {
        return 'green'
    }
    else if (vote >= 5) {
        return 'orange'
    }
    else {
        return 'red'
    }
}
// listens for submit from search bar, searchapi used to search from tmdb database
form.addEventListener("submit", (e) => {
    e.preventDefault();
    var searchTerm = search.value;

    if(searchTerm){
        // first step save local storage  up  
        pastSearchesArray.push(searchTerm);
        localStorage.setItem("pastSearches", JSON.stringify(pastSearchesArray))
        getMovies(SEARCHAPI + searchTerm);
        search.value = "";
    }
});


// Getting the movie from the api
var getMovie = function (title) {
    var omdbTitleURL = `http://www.omdbapi.com/?t=${title}&apikey=1251d790`;

    fetch(omdbTitleURL)
        .then(response => response.json())
        .then(result => {
            plot.textContent = result.Plot;
            popupMovieTitle.textContent = result.Title;
            popup.classList.add('is-active');
        })


}

// getting the relevant movie details in order to get the movie's plot
var getPlot = function (event) {
    event.preventDefault();
    var title = event.target.getAttribute("data-attr");
    getMovie(title);
}

// When the popup is activated, click on close to close the popup
btnPopupClose.addEventListener('click', function () {
    if (popup.classList.contains('is-active')) {
        popup.classList.remove('is-active');
    }
})
