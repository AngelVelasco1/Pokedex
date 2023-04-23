
/* Variables */
let actualShowPokemons = 0;
let maxIndex = 20;
let currentList = [];
let pokedexList =  document.getElementById('pokedex-list-render-container');

const typeColors = {
    'normal': '#BCBCAC',
    'fighting': '#BC5442',
    'flying': '#669AFF',
    'poison': '#AB549A',
    'ground': '#DEBC54',
    'rock': '#BCAC66',
    'bug': '#ABBC1C',
    'ghost': '#6666BC',
    'steel': '#ABACBC',
    'fire': '#FF421C',
    'water': '#2F9AFF',
    'grass': '#78CD54',
    'electric': '#FFCD30',
    'psychic': '#FF549A',
    'ice': '#78DEFF',
    'dragon': '#7866EF',
    'dark': '#785442',
    'fairy': '#FFACFF',
    'shadow': '#0E2E4C'
};
/* Functions */
function updatePokemonList() {
    if (actualShowPokemons <= maxIndex) {
        renderPokemons(actualShowPokemons);
    };
};

function renderPokemons(index) {
    if (currentList[index]) {
       pokedexList.insertAdjacentHTML('beforeend', `
                <div onclick="openInfo(${currentList[index].id})" class="pokemon-render-result-container container center column">
                                                                                                            
                <img class="search-pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentList[index].id}.png">
                                                                                                           
                <span class="bold font-size-12">N° ${currentList[index].id}</span>
                                                                                                            
                <h3>${currentList[index].name}</h3>

                <span>${getTypeContainers(currentList[index].types)}</span>
                                                                                                        
                </div>
            `);

        actualShowPokemons += 1;

        updatePokemonList();
    };
};

function showNextPokemons(to) {
    if (maxIndex + to <= currentList.length) {
        maxIndex += to;
    } else {
        maxIndex = currentList.length - 1;
    };
};

function getTypeContainers(types) {
    let htmlToReturn = types.map(type => `
    <div class="type-container" style="background: ${typeColors[type]};display:inline-block">   
       ${type}
    </div>

    `).join('');
    return htmlToReturn;
};
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keyup', () => {
    let searchResults = [];
    let searchValue = searchInput.value.toLowerCase();

    for (let index = 0; index < pokemons.length; index++) {
        if(pokemons[index].name) {
            if (pokemons[index].name.replaceAll('-', ' ').includes(searchValue)) {
                searchResults.push(pokemons[index])
            }
        }
         
    }
    pokedexList.innerHTML = '';

    currentList = searchResults;
    actualShowPokemons = 0;
    maxIndex = 0;

    showNextPokemons(30);
    updatePokemonList();
}) 



const windowHeight = window.innerHeight;
const toTopButton = document.querySelector("#back-to-top-button");

const onScroll = () => {
    if(window.scrollY + 100 >= document.documentElement.scrollHeight - document.documentElement.clientHeight) {
        showNextPokemons(33);
        updatePokemonList();
    }
   
    toTopButton.classList.remove('hide', window.scrollY > windowHeight)
};

window.addEventListener('scroll', onScroll)
toTopButton.addEventListener('click', () => {
    window.scrollTo(0, 0);
});
