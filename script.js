const title = document.getElementById('title');
const searchBar = document.getElementsByClassName('search_bar')[0];
const cardDisplay = document.getElementsByClassName('card_display')[0];
const beerDisplay = document.getElementsByClassName('beer_display')[0];
let infoView = false;
let favoriteStar;
let favoritesView = false;
const favorites = [];
let scrollPosition;

document.getElementById('search_button').onclick = function() {
    let search = document.getElementById('search_bar').value;
    if(search) {
        loadXMLDoc(search);
    } else {
        alert('Please enter search term(s).');
    }
}

function search(keyCode) {
    let phrase = document.getElementById('search_bar').value;
    if (keyCode == 13) {
        loadXMLDoc(phrase);
        return false;
    }
    else {
      return true;
    }
}

document.getElementById('nav_favorites').onclick = function() {
    favoritesView = true;
    if(!beerDisplay.className.split('').includes('hidden')) {
        //beerDisplay.classList.add('hidden');
        switchView(null);
    }
    $('html').scrollTop(0);
    searchBar.classList.add('hidden');
    loadBeersToHTML(favorites);
}

document.getElementById('nav_catalog').onclick = function() {
    favoritesView = false;
    if(!beerDisplay.classList.contains('hidden')) {
        switchView(null);
    }
    $('html').scrollTop(0);
    searchBar.classList.remove('hidden');
    loadBeersToHTML([]);
}

document.getElementById('back_button').onclick = function() {
    switchView(null);
}

function loadXMLDoc(searchPhrase) {
    var xhr = new XMLHttpRequest();
    var url = 'https://api.punkapi.com/v2/beers?beer_name=' + searchPhrase;

    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var beers = getBeersFromJSON(xhr.response);
                if(beers.length === 0) {
                    alert('No items found, try another search phrase.');
                } else {
                    loadBeersToHTML(beers);
                }
                
            }
            else if(xhr.status === 400) {
                alert('failed api request');
            }
        }
    }

    
    xhr.open('GET', url);
    xhr.responseType = "text";
    xhr.send();
}

function getBeersFromJSON(json) {
    return JSON.parse(json);
}

function loadBeersToHTML(beers) {
    
    var beerCards = document.getElementsByClassName('beer_card');
    //remove any from previous search
    while (beerCards.length) {
        beerCards[0].parentNode.removeChild(beerCards[0]);
    }

    //populate cards with new data
    beers.sort((a,b) => {
        return a.name.localeCompare(b.name);
    });
    for(var i = 0; i < beers.length; i++) {
        let beerCard = createBeerCard(beers[i]);
        cardDisplay.appendChild(beerCard);
        beerCard.classList.add('active');
    }
    
}

function createBeerCard(beer) {
    if (favorites.some((favorite) => favorite.id === beer.id)) {beer.favorited = true;}
    else {beer.favorited = false;}
    let beerCard = document.createElement('div');
    beerCard.className = 'beer_card';

    let beerImage = document.createElement('img');
    beerImage.src = beer.image_url;
    beerImage.className = 'beer_poster';
    beerImage.style.height = '90px';
    beerImage.style.width = '80px';
    beerCard.appendChild(beerImage);

    let beerInfo = document.createElement('div');
    beerInfo.className = 'beer_info';

    let favoriteContainer = document.createElement('div');
    favoriteContainer.className = 'favorite_container';

    let beerFavorite = document.createElement('img');
    beerFavorite.className = 'beer_favorite';
    if (beer.favorited) {
        beerFavorite.src = './assets/images/icons/favorite_star_filled_yellow.png';
    } else {
        beerFavorite.src = './assets/images/icons/favorite_star_empty.png';
    }
    
    beerFavorite.onmouseover = function() {
        if(beer.favorited) {
            this.src = './assets/images/icons/favorite_star_filled_yellow.png';
        } else {
            this.src = './assets/images/icons/favorite_star_empty_yellow.png';
        }
    }
    beerFavorite.onmouseout = function() {
        if(beer.favorited) {
            this.src = './assets/images/icons/favorite_star_filled_yellow.png';
        } else {
            this.src = './assets/images/icons/favorite_star_empty.png';
        }
    }
    beerFavorite.style.height = '25px';
    beerFavorite.style.width = '25px';
    beerFavorite.addEventListener('click',(e) => {
        e.stopPropagation();
        favoriteBeer(beerFavorite, beer);
    }, false);
    
    
    let beerHeader = document.createElement('div');
    beerHeader.className = 'beer_header';

    let beerName = document.createElement('h3');
    beerName.className = 'beer_name';
    beerName.innerHTML = beer.name;

    let beerAbv = document.createElement('h6');
    beerAbv.className = 'beer_abv';
    beerAbv.innerHTML = beer.abv + "%";

    let beerDetails = document.createElement('div');
    beerDetails.classList = 'beer_details';

    let beerDescription = document.createElement('p');
    beerDescription.className = 'beer_description';
    beerDescription.innerHTML = beer.description;

    let descriptionFadeDiv = document.createElement('div');
    descriptionFadeDiv.className = 'description_fade';

    beerHeader.appendChild(beerName);
    beerHeader.appendChild(beerAbv);
    favoriteContainer.appendChild(beerFavorite);
    beerInfo.appendChild(favoriteContainer);
    beerInfo.appendChild(beerHeader);
    beerDetails.appendChild(beerDescription);
    beerDetails.appendChild(descriptionFadeDiv);
    beerInfo.appendChild(beerDetails);

    beerCard.addEventListener('click', (e) => {
        e.stopPropagation();
        switchView(beer);
    }, false);
    beerCard.appendChild(beerInfo);
    return beerCard;
}

function favoriteBeer(beerFavorite, beer) {
    //debugger;
    console.log('beer ' + beer.id + ':' + beer.name);
    console.log(favorites);
    let fav = favorites.some(e => {return e.id === beer.id;});
    console.log(fav);
    //beer.favorited = !beer.favorited;
    
    if(!fav) {
        beer.favorited = true;
        favorites.push(beer);
        beerFavorite.src = './assets/images/icons/favorite_star_filled_yellow.png';
    }else {
        beer.favorited = false;
        favorites.forEach((e, i) => {
            if(e.id === beer.id) {
                favorites.splice(i,1);
            }
        });
        //favorites.splice(favorites.indexOf(beer.id) ,1);
        beerFavorite.src = './assets/images/icons/favorite_star_empty_yellow.png';
    }
    console.log(favorites);
}

function switchView(beer) {
    if (beer !== null) {
        scrollPosition = $('html').scrollTop();
        $('html').scrollTop(0);
        cardDisplay.classList.add('hidden');
        searchBar.classList.add('hidden');
        beerDisplay.classList.remove('hidden');
        populateBeerDisplay(beer);
    } else {
        cardDisplay.classList.remove('hidden');
        if (!favoritesView) {
            searchBar.classList.remove('hidden');
            let search = document.getElementById('search_bar').value;
            if(search) {
                loadXMLDoc(search);
            } else {
                alert('Please enter search term(s).');
            }
        } else {
            loadBeersToHTML(favorites);
        }
        beerDisplay.classList.add('hidden');
        $('html').scrollTop(scrollPosition);
    }
    
    
}

function populateBeerDisplay(beer) {
    //console.log(beer);

    let title = document.getElementById('beer_title');
    title.innerHTML = beer.name;

    let poster = document.getElementById('beer_poster');
    poster.src = beer.image_url;
    poster.style.height = '240px';
    poster.style.width = '120px';

    let tagline = document.getElementById('beer_tagline');
    tagline.innerHTML = beer.tagline;

    let beerFavorite = document.getElementById('beer_favorite');
    //beerFavorite.className = 'beer_favorite';
    if (beer.favorited) {
        beerFavorite.src = './assets/images/icons/favorite_star_filled_yellow.png';
    } else {
        beerFavorite.src = './assets/images/icons/favorite_star_empty.png';
    }
    
    beerFavorite.onmouseover = function() {
        if(beer.favorited) {
            this.src = './assets/images/icons/favorite_star_filled_yellow.png';
        } else {
            this.src = './assets/images/icons/favorite_star_empty_yellow.png';
        }
    }
    beerFavorite.onmouseout = function() {
        if(beer.favorited) {
            this.src = './assets/images/icons/favorite_star_filled_yellow.png';
        } else {
            this.src = './assets/images/icons/favorite_star_empty.png';
        }
    }
    //debugger;
    beerFavorite.style.height = '25px';
    beerFavorite.style.width = '25px';
    //unbind previous beer's on click first
    let favorite = function() {
        favoriteBeer(beerFavorite, beer);
    }
    beerFavorite.onclick = favorite;

    let abv = document.getElementById('beer_abv');
    abv.innerHTML = beer.abv + '% alc/vol';

    let ibu = document.getElementById('beer_ibu');
    ibu.innerHTML = beer.ibu + ' ibu';

    let description = document.getElementById('beer_description');
    description.innerHTML = beer.description;
}

