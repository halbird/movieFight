const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Question_mark_grey.svg/1200px-Question_mark_grey.svg.png" : movie.Poster;
        return `<img src="${imgSrc}">
        ${movie.Title} (${movie.Year})`;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerms) {
        const response = await axios.get("http://www.omdbapi.com", {
            params: {
                apikey: "YOURAPIKEYGOESHERE",
                s: searchTerms
            }
        });
        if (response.data.Error) {
            return [];
        }
        return response.data.Search;
    }
}

createAutocomplete({
    ...autoCompleteConfig,
    root: document.querySelector("#left-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    },
});
createAutocomplete({
    ...autoCompleteConfig,
    root: document.querySelector("#right-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    },
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com", {
        params: {
            apikey: "YOURAPIKEYGOESHERE",
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === "left") {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll("#left-summary .notification");         
    const rightSideStats = document.querySelectorAll("#right-summary .notification");
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        const leftSideValue = isNaN(leftStat.dataset.value) ? 0 : parseFloat(leftStat.dataset.value);
        const rightSideValue = isNaN(rightStat.dataset.value) ? 0 : parseFloat(rightStat.dataset.value);
        
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
            rightStat.classList.remove("is-warning");
            rightStat.classList.add("is-primary");
        } else if (rightSideValue < leftSideValue) {
            rightStat.classList.remove("is-primary");  
            rightStat.classList.add("is-warning");
            leftStat.classList.remove("is-warning");
            leftStat.classList.add("is-primary");
        } else {
            rightStat.classList.remove("is-warning");  
            rightStat.classList.add("is-primary");
            leftStat.classList.remove("is-warning");
            leftStat.classList.add("is-primary");
        }
    });
}

const movieTemplate = (movieDetail) => {
    const awards = movieDetail.Awards.split(" ").reduce((prev, word) => { // first parameter is function we want to run, second is the starting value
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;        // if NaN return the current count
        } else {
            return prev + value;    // otherwise add the new value to the count
        }
    }, 0);
    const dollars = !movieDetail.BoxOffice ? 0 : parseInt(movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" alt="Poster Image For Movie">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${!movieDetail.BoxOffice ? "N/A" : movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}

// index.js: non-reusable code for our specific project
// fetchData() to find movies
// renderOption() to render a movie
// onOptionSelect() when user clicks on an option
// root element that the autocomplete is rendered to

// autocomplete.js: reusable code to make an autocomplete
// function takes autocomplete config and render an autocomplete on the screen























// challenges: 
// fetch movie data: omdbapi.com; find movies based on search term and then follow up request on the specific chosen movie
// autocomplete widget: how does autocomplete work
// styling: bulma css

// /?apikey=[yourkey]&
