class Carousel {
    /**
     * This callback type is called `requestCallback` and is displayed as a global symbol.
     *
     * @callback moveCallback
     * @param {number} index
     */

    /**
     * @param {HTMLElement} element
     * @param {Object} options
     * @param {Object} [options.slidesToScroll=1] Nombre d'éléments à faire défiler
     * @param {Object} [options.slidesVisible=1] Nombre d'éléments visible dans un slide
     * @param {boolean} [options.loop=false] Doit-t-on boucler en fin de carousel
     * @param {boolean} [options.pagination=false]
     * @param {boolean} [options.navigation=true]
     */
    constructor(element, options = {}) {
        this.element = element
        console.log(this.element.title)
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false,
            pagination: false,
            navigation: true
        }, options)
        let children = [].slice.call(element.children)
        this.isMobile = false
        this.currentItem = 0
        this.moveCallbacks = []

        // DOM MODIFICATION
        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel__container')
        this.title_container = this.createDivWithIdClass(this.element.title + "_" + "title", "title")
        console.log(this.title_container)
        this.title_container.innerHTML = this.element.title
        this.root.setAttribute('tabindex', '0')
        this.root.appendChild(this.title_container)
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        if (this.options.navigation) {
            this.createNavigation()
        }
        if (this.options.pagination) {
            this.createPagination()
        }

        // Evenements
        this.moveCallbacks.forEach(cb => cb(0))
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))
        this.root.addEventListener('keyup', e => {
            if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.next()
            } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.prev()
            }
        })
    }

    /**
     * Applique les bonnes dimensions aux éléments du carousel
     */
    setStyle() {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
    }

    /**
     * Crée les flêches de navigation dans le DOM
     */
    createNavigation() {
        let nextButton = this.createDivWithClass('carousel__next')
        let prevButton = this.createDivWithClass('carousel__prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
        if (this.options.loop === true) {
            return
        }
        this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add('carousel__prev--hidden')
            } else {
                prevButton.classList.remove('carousel__prev--hidden')
            }
            if (this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add('carousel__next--hidden')
            } else {
                nextButton.classList.remove('carousel__next--hidden')
            }
        })
    }

    /**
     * Crée la pagination dans le DOM
     */
    createPagination() {
        let pagination = this.createDivWithClass('carousel__pagination')
        let buttons = []
        this.root.appendChild(pagination)
        for (let i = 0; i < this.items.length; i = i + this.options.slidesToScroll) {
            let button = this.createDivWithClass('carousel__pagination__button')
            button.addEventListener('click', () => this.gotoItem(i))
            pagination.appendChild(button)
            buttons.push(button)
        }
        this.onMove(index => {
            let activeButton = buttons[Math.floor(index / this.options.slidesToScroll)]
            if (activeButton) {
                buttons.forEach(button => button.classList.remove('carousel__pagination__button--active'))
                activeButton.classList.add('carousel__pagination__button--active')
            }
        })
    }

    /**
     *
     */
    next() {
        this.gotoItem(this.currentItem + this.slidesToScroll)
    }

    prev() {
        this.gotoItem(this.currentItem - this.slidesToScroll)
    }

    /**
     * Déplace le carousel vers l'élément ciblé
     * @param {number} index
     */
    gotoItem(index) {
        if (index < 0) {
            if (this.options.loop) {
                index = this.items.length - this.slidesVisible
            } else {
                return
            }
        } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
            if (this.options.loop) {
                index = 0
            } else {
                return
            }
        }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = index
        this.moveCallbacks.forEach(cb => cb(index))
    }

    /**
     * Rajoute un écouteur qui écoute le déplacement du carousel
     * @param {moveCallback} cb
     */
    onMove(cb) {
        this.moveCallbacks.push(cb)
    }

    /**
     * Ecouteur pour le redimensionnement de la fenêtre
     */
    onWindowResize() {
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
            this.moveCallbacks.forEach(cb => cb(this.currentItem))
        }
    }

    /**
     * Helper pour créer une div avec une classe
     * @param {string} className
     * @returns {HTMLElement}
     */
    createDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    /**
     * Helper pour créer une div avec une classe
     * @param {string} idName
     * @returns {HTMLElement}
     */
    createDivWithIdClass(idName, className) {
        let div = document.createElement('div')
        div.setAttribute('id', idName)
        div.setAttribute('class', className)
        return div
    }

    /**
     * @returns {number}
     */
    get slidesToScroll() {
        return this.isMobile ? 1 : this.options.slidesToScroll
    }

    /**
     * @returns {number}
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible
    }

}

class film {
    constructor(image_url, title, genres, date_published, rated, imdb_score, directors, actors, duration, countries, worldwide_gross_income, long_description, id, url, writers) {
        this.image_url = image_url;
        this.title = title;
        this.genres = genres;
        this.date_published = date_published;
        this.rated = rated;
        this.imdb_score = imdb_score;
        this.directors = directors;
        this.actors = actors;
        this.duration = duration;
        this.countries = countries;
        this.worldwide_gross_income = worldwide_gross_income;
        this.long_description = long_description;
        this.id = id;
        this.url = url;
        this.writers = writers;
    }
}



let url = "http://localhost:8000/api/v1/titles";
let filtrage = {
    separateur: "/",
    debut_filtre: "?",
    egale: "=",
    liaison: "&",
    filtre_genre: "genre",
    filtre_tri: "sort_by",
    cle_tri: "-imdb_score"
};
let list_genre = ["Sci-Fi", "Action", "Meilleurs", "Fantasy"];

for (let film_genre of list_genre) {
    if (film_genre == "Meilleurs") {
        genre_film_url = "";
    } else {
        genre_film_url = film_genre;
    }
    let new_url = url + filtrage.separateur + filtrage.debut_filtre + filtrage.filtre_genre + filtrage.egale + genre_film_url +
        filtrage.liaison + filtrage.filtre_tri + filtrage.egale + filtrage.cle_tri;


    re_fetch(new_url, film_genre)
        .catch(function(error) {
            console.error("FETCH ERROR:", error);
        });
    //new modal_events(film_genre)
}

new Carousel(document.querySelector('#Sci-Fi'), {
    slidesVisible: 4,
    slidesToScroll: 1,
    loop: true,
    pagination: true
})

new Carousel(document.querySelector('#Action'), {
    slidesVisible: 4,
    slidesToScroll: 1,
    loop: true,
    pagination: true
})


new Carousel(document.querySelector('#Fantasy'), {
    slidesVisible: 4,
    slidesToScroll: 1,
    loop: true,
    pagination: true
})

new Carousel(document.querySelector('#Meilleurs'), {
    slidesVisible: 4,
    slidesToScroll: 1,
    loop: true,
    pagination: true
})


// document.addEventListener('DOMContentLoaded', function() {
// })

async function re_fetch(url, genre_film) {
    if (genre_film == "Meilleurs") {
        const response_meilleur = await fetch(url);
    }
    let list_films = [];
    const response = await fetch(url);
    const data = await response.json();
    const resultats = data.results;
    for (let film of resultats) {
        list_films.push(film);
    }
    url_2 = url + "&page=2";

    const response_2 = await fetch(url_2);
    const data_2 = await response_2.json();
    const resultats_2 = data_2.results


    for (let i = 0; i < 2; i++) {
        list_films.push(resultats_2[i]);
    }
    //let list_film_obj = list_movies_to_obj(list_films);
    display_juststream(list_films, genre_film);
}

function list_movies_to_obj(list_movies) {
    let list_obj_movies = [];
    for (i = 0; i < list_movies.length; i++) {
        movie_obj = movie_to_obj(list_movies[i]);
        list_obj_movies.push(movie_obj);
    }
    return list_obj_movies;
}

function movie_to_obj(movie) {
    let movie_obj = new film(movie["image_url"], movie["title"],
        "Genres : " + movie["genres"], "Date de sortie : " + movie["date_published"],
        "Rated : " + movie["rated"], "Score Imdb : " + movie["imdb_score"],
        "Réalisateur : " + movie["directors"], "Acteurs : " + movie["actors"],
        "Durée : " + ((~~(movie["duration"] / 60)).toString()) + "h" + ((movie["duration"] % 60).toString()) + "min",
        "Pays d’origine : " + movie["countries"], "Résultat au Box Office : " + movie["worldwide_gross_income"],
        "Résumé : " + movie["long_description"], movie["id"], movie["url"],
        movie["writers"])
    return movie_obj
}

async function display_juststream(list_films, genre_film) {
    let film_id = "film_";
    let modal_id = "modal-";
    let title_id = "title_";
    let btn_modal_id = "btn_modal_";
    //for (i = 0; i < list_obj_movies.length; i++)
    let i = 1;
    for (let film of list_films) {
        url_movie = film.url;
        const response_movie = await fetch(url_movie);
        const data_movie = await response_movie.json();
        if (data_movie.worldwide_gross_income == null) {
            data_movie.worldwide_gross_income = "Inconnu";
        } else {
            data_movie.worldwide_gross_income = ((data_movie.worldwide_gross_income / 1000000).toFixed(2)).toString() + "M" + " " + "USD";
        }
        let my_film = movie_to_obj(data_movie);
        let new_film_id = film_id + (i).toString();
        let new_modal_id = modal_id + (i).toString();
        let new_title_id = title_id + (i).toString();
        let new_btn_modal_id = btn_modal_id + (i).toString();
        displaymovie(my_film, new_film_id, new_modal_id, new_title_id, new_btn_modal_id, genre_film);
        i++;
    }
}

function displaymovie(my_film, new_film_id, new_modal_id, new_title_id, new_btn_modal_id, genre_film) {
    // const title = my_film.title;
    // const year = "Year : " + my_film.year;
    // const directors = "Directors : " + my_film.directors;
    // const actors = "Actors : " + my_film.actors;
    // const writers = "Writers : " + my_film.writers;
    // const genre = "Genre : " + my_film.genres;
    const movie_selector = genre_film + "_" + new_btn_modal_id;
    const modal_selector = genre_film + "_" + new_modal_id;
    // Selection des deux conteneurs du film ansi que de la Modal
    //const filmContainer = document.getElementById(new_film_id); // Selection du conteneur du film 
    // sur le slide show par sont ID 'film_n'
    const contenuModal = document.getElementById(modal_selector); // Selection du conteneur du la modal
    // par sont ID 'modal-n
    ////////////////////////////////////////////////////////////////////////////////////////////////
    const linkFilmImage = document.getElementById(movie_selector); //Creation de la balise 'a' servant de lien
    // vers la modal
    //linkFilmImage.setAttribute('id', new_btn_modal_id); // attribuer un ID 'btn_modal_n' pour le lien de la modal

    ////////////////////////////////////////////////////////////////////////////////////////////////
    const imageFilm = document.createElement('img'); // creation de la balise 'img' qui sera contenu
    // dans la balise 'a' just au dessus
    imageFilm.setAttribute('src', my_film.image_url); // attribuer le lien url vers l'image
    imageFilm.setAttribute('alt', my_film.title); // attribuer alt à l'image
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    // Remplissage du conteneur du film (id = 'film_n') par les balises 'a' et 'div' crées précédemment
    linkFilmImage.appendChild(imageFilm); // mettre la balise 'img' dans la balise 'a'
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Creation de la balise 'p' qui contiendra  les information du film ainsi que sont image 
    // et qui serta contenue dans le modal-container
    const infoFilm = document.createElement('p');
    // Creation des balises 'H4' qui contiendrons les informations du film dans la modal
    ////////////////////////////////////////////////////////////////////////////////////////////////
    const imageFilmInfo = document.createElement('img');
    imageFilmInfo.setAttribute('src', my_film.image_url);
    imageFilmInfo.setAttribute('alt', my_film.title);
    ////////////////////////////////////////////////////////////////////////////////////////////////
    const titre_film_modal = document.createElement('h1'); //Creation de la balise 'H4' pour le titre
    titre_film_modal.setAttribute('class', 'titre_film_modal');
    titre_film_modal.innerHTML = my_film.title;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    const genre_film_modal = document.createElement('h4'); //Creation de la balise 'H4' pour le genre
    genre_film_modal.innerHTML = my_film.genres;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    const date_film_modal = document.createElement('h4'); //Creation de la balise 'H4' pour l'année
    date_film_modal.innerHTML = my_film.date_published;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    const rated_film_modal = document.createElement('h4'); //Creation de la balise 'H4' pour le genre
    rated_film_modal.innerHTML = my_film.rated;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    const score_imdb_film_modal = document.createElement('h4'); //Creation de la balise 'H4' pour le genre
    score_imdb_film_modal.innerHTML = my_film.imdb_score;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    const realisateurs_film_modal = document.createElement('h4'); //Creation de la balise 'H4' pour les realisateurs
    realisateurs_film_modal.innerHTML = my_film.directors;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    const acteurs_film_modal = document.createElement('h4'); //Creation de la balise 'H4' pour les acteurs
    acteurs_film_modal.innerHTML = my_film.actors;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    const duree_film_modal = document.createElement('h4'); //Creation de la balise 'H4' pour les scenaristes
    duree_film_modal.innerHTML = my_film.duration;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    const pays_film_modal = document.createElement('h4'); //Creation de la balise 'H4' pour les scenaristes
    pays_film_modal.innerHTML = my_film.countries;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    const resultat_box_office_film_modal = document.createElement('h4'); //Creation de la balise 'H4' pour les scenaristes
    resultat_box_office_film_modal.innerHTML = my_film.worldwide_gross_income;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    const description_film_modal = document.createElement('h4'); //Creation de la balise 'H4' pour les scenaristes
    description_film_modal.innerHTML = my_film.long_description;
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    // // Remplissage de la balise 'p' avec la balise 'h1' du titre et les diffentes balises 'h4' ansi que l'image du film
    infoFilm.appendChild(imageFilmInfo);
    infoFilm.appendChild(titre_film_modal);
    infoFilm.appendChild(genre_film_modal);
    infoFilm.appendChild(date_film_modal);
    infoFilm.appendChild(rated_film_modal);
    infoFilm.appendChild(score_imdb_film_modal);
    infoFilm.appendChild(realisateurs_film_modal);
    infoFilm.appendChild(acteurs_film_modal);
    infoFilm.appendChild(duree_film_modal);
    infoFilm.appendChild(pays_film_modal);
    infoFilm.appendChild(resultat_box_office_film_modal);
    infoFilm.appendChild(description_film_modal);
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    // //remplissage du contenue de la modal par la balise 'p' qui contien les info du film
    contenuModal.appendChild(infoFilm);
}
// Get the button that opens the modal
var Sci_Fi_btn_1 = document.getElementById("Sci-Fi_btn_modal_1");
var Sci_Fi_btn_2 = document.getElementById("Sci-Fi_btn_modal_2");
var Sci_Fi_btn_3 = document.getElementById("Sci-Fi_btn_modal_3");
var Sci_Fi_btn_4 = document.getElementById("Sci-Fi_btn_modal_4");
var Sci_Fi_btn_5 = document.getElementById("Sci-Fi_btn_modal_5");
var Sci_Fi_btn_6 = document.getElementById("Sci-Fi_btn_modal_6");
var Sci_Fi_btn_7 = document.getElementById("Sci-Fi_btn_modal_7");


// Get the modals
var Sci_Fi_modal_1 = document.getElementById("Sci-Fi_modal_1");
var Sci_Fi_modal_2 = document.getElementById("Sci-Fi_modal_2");
var Sci_Fi_modal_3 = document.getElementById("Sci-Fi_modal_3");
var Sci_Fi_modal_4 = document.getElementById("Sci-Fi_modal_4");
var Sci_Fi_modal_5 = document.getElementById("Sci-Fi_modal_5");
var Sci_Fi_modal_6 = document.getElementById("Sci-Fi_modal_6");
var Sci_Fi_modal_7 = document.getElementById("Sci-Fi_modal_7");

// Get the <span> element that closes the modal
var Sci_Fi_span_1 = document.querySelector("#Sci-Fi_close_1");
var Sci_Fi_span_2 = document.querySelector("#Sci-Fi_close_2");
var Sci_Fi_span_3 = document.querySelector("#Sci-Fi_close_3");
var Sci_Fi_span_4 = document.querySelector("#Sci-Fi_close_4");
var Sci_Fi_span_5 = document.querySelector("#Sci-Fi_close_5");
var Sci_Fi_span_6 = document.querySelector("#Sci-Fi_close_6");
var Sci_Fi_span_7 = document.querySelector("#Sci-Fi_close_7");


// When the user clicks on the button, open the modal
Sci_Fi_btn_1.addEventListener('click', function() {
    Sci_Fi_modal_1.style.display = "block";
});
Sci_Fi_btn_2.addEventListener('click', function() {
    Sci_Fi_modal_2.style.display = "block";
});
Sci_Fi_btn_3.addEventListener('click', function() {
    Sci_Fi_modal_3.style.display = "block";
});
Sci_Fi_btn_4.addEventListener('click', function() {
    Sci_Fi_modal_4.style.display = "block";
});
Sci_Fi_btn_5.addEventListener('click', function() {
    Sci_Fi_modal_5.style.display = "block";
});
Sci_Fi_btn_6.addEventListener('click', function() {
    Sci_Fi_modal_6.style.display = "block";
});
Sci_Fi_btn_7.addEventListener('click', function() {
    Sci_Fi_modal_7.style.display = "block";
});

// When the user clicks on <span> (x), close the modal
Sci_Fi_span_1.addEventListener('click', function() {
    Sci_Fi_modal_1.style.display = "none";
});

Sci_Fi_span_2.addEventListener('click', function() {
    Sci_Fi_modal_2.style.display = "none";
});

Sci_Fi_span_3.addEventListener('click', function() {
    Sci_Fi_modal_3.style.display = "none";
});

Sci_Fi_span_4.addEventListener('click', function() {
    Sci_Fi_modal_4.style.display = "none";
});

Sci_Fi_span_5.addEventListener('click', function() {
    Sci_Fi_modal_5.style.display = "none";
});

Sci_Fi_span_6.addEventListener('click', function() {
    Sci_Fi_modal_6.style.display = "none";
});

Sci_Fi_span_7.addEventListener('click', function() {
    Sci_Fi_modal_7.style.display = "none";
});


// Get the button that opens the modal
var Action_btn_1 = document.getElementById("Action_btn_modal_1");
var Action_btn_2 = document.getElementById("Action_btn_modal_2");
var Action_btn_3 = document.getElementById("Action_btn_modal_3");
var Action_btn_4 = document.getElementById("Action_btn_modal_4");
var Action_btn_5 = document.getElementById("Action_btn_modal_5");
var Action_btn_6 = document.getElementById("Action_btn_modal_6");
var Action_btn_7 = document.getElementById("Action_btn_modal_7");


// Get the modals
var Action_modal_1 = document.getElementById("Action_modal_1");
var Action_modal_2 = document.getElementById("Action_modal_2");
var Action_modal_3 = document.getElementById("Action_modal_3");
var Action_modal_4 = document.getElementById("Action_modal_4");
var Action_modal_5 = document.getElementById("Action_modal_5");
var Action_modal_6 = document.getElementById("Action_modal_6");
var Action_modal_7 = document.getElementById("Action_modal_7");

// Get the <span> element that closes the modal
var Action_span_1 = document.querySelector("#Action_close_1");
var Action_span_2 = document.querySelector("#Action_close_2");
var Action_span_3 = document.querySelector("#Action_close_3");
var Action_span_4 = document.querySelector("#Action_close_4");
var Action_span_5 = document.querySelector("#Action_close_5");
var Action_span_6 = document.querySelector("#Action_close_6");
var Action_span_7 = document.querySelector("#Action_close_7");


// When the user clicks on the button, open the modal
Action_btn_1.addEventListener('click', function() {
    Action_modal_1.style.display = "block";
});
Action_btn_2.addEventListener('click', function() {
    Action_modal_2.style.display = "block";
});
Action_btn_3.addEventListener('click', function() {
    Action_modal_3.style.display = "block";
});
Action_btn_4.addEventListener('click', function() {
    Action_modal_4.style.display = "block";
});
Action_btn_5.addEventListener('click', function() {
    Action_modal_5.style.display = "block";
});
Action_btn_6.addEventListener('click', function() {
    Action_modal_6.style.display = "block";
});
Action_btn_7.addEventListener('click', function() {
    Action_modal_7.style.display = "block";
});

// When the user clicks on <span> (x), close the modal
Action_span_1.addEventListener('click', function() {
    Action_modal_1.style.display = "none";
});

Action_span_2.addEventListener('click', function() {
    Action_modal_2.style.display = "none";
});

Action_span_3.addEventListener('click', function() {
    Action_modal_3.style.display = "none";
});

Action_span_4.addEventListener('click', function() {
    Action_modal_4.style.display = "none";
});

Action_span_5.addEventListener('click', function() {
    Action_modal_5.style.display = "none";
});

Action_span_6.addEventListener('click', function() {
    Action_modal_6.style.display = "none";
});

Action_span_7.addEventListener('click', function() {
    Action_modal_7.style.display = "none";
});


// Get the button that opens the modal
var Meilleurs_btn_1 = document.getElementById("Meilleurs_btn_modal_1");
var Meilleurs_btn_2 = document.getElementById("Meilleurs_btn_modal_2");
var Meilleurs_btn_3 = document.getElementById("Meilleurs_btn_modal_3");
var Meilleurs_btn_4 = document.getElementById("Meilleurs_btn_modal_4");
var Meilleurs_btn_5 = document.getElementById("Meilleurs_btn_modal_5");
var Meilleurs_btn_6 = document.getElementById("Meilleurs_btn_modal_6");
var Meilleurs_btn_7 = document.getElementById("Meilleurs_btn_modal_7");


// Get the modals
var Meilleurs_modal_1 = document.getElementById("Meilleurs_modal_1");
var Meilleurs_modal_2 = document.getElementById("Meilleurs_modal_2");
var Meilleurs_modal_3 = document.getElementById("Meilleurs_modal_3");
var Meilleurs_modal_4 = document.getElementById("Meilleurs_modal_4");
var Meilleurs_modal_5 = document.getElementById("Meilleurs_modal_5");
var Meilleurs_modal_6 = document.getElementById("Meilleurs_modal_6");
var Meilleurs_modal_7 = document.getElementById("Meilleurs_modal_7");

// Get the <span> element that closes the modal
var Meilleurs_span_1 = document.querySelector("#Meilleurs_close_1");
var Meilleurs_span_2 = document.querySelector("#Meilleurs_close_2");
var Meilleurs_span_3 = document.querySelector("#Meilleurs_close_3");
var Meilleurs_span_4 = document.querySelector("#Meilleurs_close_4");
var Meilleurs_span_5 = document.querySelector("#Meilleurs_close_5");
var Meilleurs_span_6 = document.querySelector("#Meilleurs_close_6");
var Meilleurs_span_7 = document.querySelector("#Meilleurs_close_7");


// When the user clicks on the button, open the modal
Meilleurs_btn_1.addEventListener('click', function() {
    Meilleurs_modal_1.style.display = "block";
});
Meilleurs_btn_2.addEventListener('click', function() {
    Meilleurs_modal_2.style.display = "block";
});
Meilleurs_btn_3.addEventListener('click', function() {
    Meilleurs_modal_3.style.display = "block";
});
Meilleurs_btn_4.addEventListener('click', function() {
    Meilleurs_modal_4.style.display = "block";
});
Meilleurs_btn_5.addEventListener('click', function() {
    Meilleurs_modal_5.style.display = "block";
});
Meilleurs_btn_6.addEventListener('click', function() {
    Meilleurs_modal_6.style.display = "block";
});
Meilleurs_btn_7.addEventListener('click', function() {
    Meilleurs_modal_7.style.display = "block";
});

// When the user clicks on <span> (x), close the modal
Meilleurs_span_1.addEventListener('click', function() {
    Meilleurs_modal_1.style.display = "none";
});

Meilleurs_span_2.addEventListener('click', function() {
    Meilleurs_modal_2.style.display = "none";
});

Meilleurs_span_3.addEventListener('click', function() {
    Meilleurs_modal_3.style.display = "none";
});

Meilleurs_span_4.addEventListener('click', function() {
    Meilleurs_modal_4.style.display = "none";
});

Meilleurs_span_5.addEventListener('click', function() {
    Meilleurs_modal_5.style.display = "none";
});

Meilleurs_span_6.addEventListener('click', function() {
    Meilleurs_modal_6.style.display = "none";
});

Meilleurs_span_7.addEventListener('click', function() {
    Meilleurs_modal_7.style.display = "none";
});



// Get the button that opens the modal
var Fantasy_btn_1 = document.getElementById("Fantasy_btn_modal_1");
var Fantasy_btn_2 = document.getElementById("Fantasy_btn_modal_2");
var Fantasy_btn_3 = document.getElementById("Fantasy_btn_modal_3");
var Fantasy_btn_4 = document.getElementById("Fantasy_btn_modal_4");
var Fantasy_btn_5 = document.getElementById("Fantasy_btn_modal_5");
var Fantasy_btn_6 = document.getElementById("Fantasy_btn_modal_6");
var Fantasy_btn_7 = document.getElementById("Fantasy_btn_modal_7");


// Get the modals
var Fantasy_modal_1 = document.getElementById("Fantasy_modal_1");
var Fantasy_modal_2 = document.getElementById("Fantasy_modal_2");
var Fantasy_modal_3 = document.getElementById("Fantasy_modal_3");
var Fantasy_modal_4 = document.getElementById("Fantasy_modal_4");
var Fantasy_modal_5 = document.getElementById("Fantasy_modal_5");
var Fantasy_modal_6 = document.getElementById("Fantasy_modal_6");
var Fantasy_modal_7 = document.getElementById("Fantasy_modal_7");

// Get the <span> element that closes the modal
var Fantasy_span_1 = document.querySelector("#Fantasy_close_1");
var Fantasy_span_2 = document.querySelector("#Fantasy_close_2");
var Fantasy_span_3 = document.querySelector("#Fantasy_close_3");
var Fantasy_span_4 = document.querySelector("#Fantasy_close_4");
var Fantasy_span_5 = document.querySelector("#Fantasy_close_5");
var Fantasy_span_6 = document.querySelector("#Fantasy_close_6");
var Fantasy_span_7 = document.querySelector("#Fantasy_close_7");


// When the user clicks on the button, open the modal
Fantasy_btn_1.addEventListener('click', function() {
    Fantasy_modal_1.style.display = "block";
});
Fantasy_btn_2.addEventListener('click', function() {
    Fantasy_modal_2.style.display = "block";
});
Fantasy_btn_3.addEventListener('click', function() {
    Fantasy_modal_3.style.display = "block";
});
Fantasy_btn_4.addEventListener('click', function() {
    Fantasy_modal_4.style.display = "block";
});
Fantasy_btn_5.addEventListener('click', function() {
    Fantasy_modal_5.style.display = "block";
});
Fantasy_btn_6.addEventListener('click', function() {
    Fantasy_modal_6.style.display = "block";
});
Fantasy_btn_7.addEventListener('click', function() {
    Fantasy_modal_7.style.display = "block";
});

// When the user clicks on <span> (x), close the modal
Fantasy_span_1.addEventListener('click', function() {
    Fantasy_modal_1.style.display = "none";
});

Fantasy_span_2.addEventListener('click', function() {
    Fantasy_modal_2.style.display = "none";
});

Fantasy_span_3.addEventListener('click', function() {
    Fantasy_modal_3.style.display = "none";
});

Fantasy_span_4.addEventListener('click', function() {
    Fantasy_modal_4.style.display = "none";
});

Fantasy_span_5.addEventListener('click', function() {
    Fantasy_modal_5.style.display = "none";
});

Fantasy_span_6.addEventListener('click', function() {
    Fantasy_modal_6.style.display = "none";
});

Fantasy_span_7.addEventListener('click', function() {
    Fantasy_modal_7.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == Sci_Fi_modal_1) {
        Sci_Fi_modal_1.style.display = "none";
    }

    if (event.target == Sci_Fi_modal_2) {
        Sci_Fi_modal_2.style.display = "none";
    }

    if (event.target == Sci_Fi_modal_3) {
        Sci_Fi_modal_3.style.display = "none";
    }

    if (event.target == Sci_Fi_modal_4) {
        Sci_Fi_modal_4.style.display = "none";
    }

    if (event.target == Sci_Fi_modal_5) {
        Sci_Fi_modal_5.style.display = "none";
    }

    if (event.target == Sci_Fi_modal_6) {
        Sci_Fi_modal_6.style.display = "none";
    }

    if (event.target == Sci_Fi_modal_7) {
        Sci_Fi_modal_7.style.display = "none";
    }

    if (event.target == Action_modal_1) {
        Action_modal_1.style.display = "none";
    }

    if (event.target == Action_modal_2) {
        Action_modal_2.style.display = "none";
    }

    if (event.target == Action_modal_3) {
        Action_modal_3.style.display = "none";
    }

    if (event.target == Action_modal_4) {
        Action_modal_4.style.display = "none";
    }

    if (event.target == Action_modal_5) {
        Action_modal_5.style.display = "none";
    }

    if (event.target == Action_modal_6) {
        Action_modal_6.style.display = "none";
    }

    if (event.target == Action_modal_7) {
        Action_modal_7.style.display = "none";
    }

    if (event.target == Meilleurs_modal_1) {
        Meilleurs_modal_1.style.display = "none";
    }

    if (event.target == Meilleurs_modal_2) {
        Meilleurs_modal_2.style.display = "none";
    }

    if (event.target == Meilleurs_modal_3) {
        Meilleurs_modal_3.style.display = "none";
    }

    if (event.target == Meilleurs_modal_4) {
        Meilleurs_modal_4.style.display = "none";
    }

    if (event.target == Meilleurs_modal_5) {
        Meilleurs_modal_5.style.display = "none";
    }

    if (event.target == Meilleurs_modal_6) {
        Meilleurs_modal_6.style.display = "none";
    }

    if (event.target == Meilleurs_modal_7) {
        Meilleurs_modal_7.style.display = "none";
    }

    if (event.target == Fantasy_modal_1) {
        Fantasy_modal_1.style.display = "none";
    }

    if (event.target == Fantasy_modal_2) {
        Fantasy_modal_2.style.display = "none";
    }

    if (event.target == Fantasy_modal_3) {
        Fantasy_modal_3.style.display = "none";
    }

    if (event.target == Fantasy_modal_4) {
        Fantasy_modal_4.style.display = "none";
    }

    if (event.target == Fantasy_modal_5) {
        Fantasy_modal_5.style.display = "none";
    }

    if (event.target == Fantasy_modal_6) {
        Fantasy_modal_6.style.display = "none";
    }

    if (event.target == Fantasy_modal_7) {
        Fantasy_modal_7.style.display = "none";
    }
}


// class modal_events {
//     constructor(film_genre) {
//         this.film_genre = film_genre;
//         this.btn_1 = document.getElementById(film_genre + "_btn_modal_1");
//         this.btn_2 = document.getElementById(film_genre + "_btn_modal_2");
//         this.btn_3 = document.getElementById(film_genre + "_btn_modal_3");
//         this.btn_4 = document.getElementById(film_genre + "_btn_modal_4");
//         this.btn_5 = document.getElementById(film_genre + "_btn_modal_5");
//         this.btn_6 = document.getElementById(film_genre + "_btn_modal_6");
//         this.btn_7 = document.getElementById(film_genre + "_btn_modal_7");

//         // Get the modals
//         this.modal_1 = document.getElementById(film_genre + "_modal_1");
//         this.modal_2 = document.getElementById(film_genre + "_modal_2");
//         this.modal_3 = document.getElementById(film_genre + "_modal_3");
//         this.modal_4 = document.getElementById(film_genre + "_modal_4");
//         this.modal_5 = document.getElementById(film_genre + "_modal_5");
//         this.modal_6 = document.getElementById(film_genre + "_modal_6");
//         this.modal_7 = document.getElementById(film_genre + "_modal_7");

//         // Get the <span> element that closes the modal
//         this.span_1 = document.querySelector(film_genre + "_close_1");
//         this.span_2 = document.querySelector(film_genre + "_close_2");
//         this.span_3 = document.querySelector(film_genre + "_close_3");
//         this.span_4 = document.querySelector(film_genre + "_close_4");
//         this.span_5 = document.querySelector(film_genre + "_close_5");
//         this.span_6 = document.querySelector(film_genre + "_close_6");
//         this.span_7 = document.querySelector(film_genre + "_close_7");

//         // When the user clicks on the button, open the modal
//         this.btn_1.addEventListener('click', this.display_modal(this.modal_1));

//         this.btn_2.addEventListener('click', this.display_modal(this.modal_2));

//         this.btn_3.addEventListener('click', this.display_modal(this.modal_3));

//         this.btn_4.addEventListener('click', this.display_modal(this.modal_4));

//         this.btn_5.addEventListener('click', this.display_modal(this.modal_5));

//         this.btn_6.addEventListener('click', this.display_modal(this.modal_6));

//         this.btn_7.addEventListener('click', this.display_modal(this.modal_7));


//         // When the user clicks on <span> (x), close the modal
//         this.span_1.addEventListener('click', this.close_modal(this.modal_1));

//         this.span_2.addEventListener('click', this.close_modal(this.modal_2));

//         this.span_3.addEventListener('click', this.close_modal(this.modal_3));

//         this.span_4.addEventListener('click', this.close_modal(this.modal_4));

//         this.span_5.addEventListener('click', this.close_modal(this.modal_5));

//         this.span_6.addEventListener('click', this.close_modal(this.modal_6));

//         this.span_7.addEventListener('click', this.close_modal(this.modal_7));

//         // When the user clicks anywhere outside of the modal, close it
//         window.onclick = function(event) {
//             if (event.target == this.modal_1) {
//                 this.modal_1.style.display = "none";
//             }

//             if (event.target == this.modal_2) {
//                 this.modal_2.style.display = "none";
//             }

//             if (event.target == this.modal_3) {
//                 this.modal_3.style.display = "none";
//             }

//             if (event.target == this.modal_4) {
//                 this.modal_4.style.display = "none";
//             }

//             if (event.target == this.modal_5) {
//                 this.modal_5.style.display = "none";
//             }

//             if (event.target == this.modal_6) {
//                 this.modal_6.style.display = "none";
//             }

//             if (event.target == this.modal_7) {
//                 this.modal_7.style.display = "none";
//             }
//         }
//     }

//     display_modal(modal) {
//         modal.style.display = "block";
//     }

//     close_modal(modal) {
//         modal.style.display = "none";
//     }
// }
