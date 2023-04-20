
/* DOM */
const toTopButton = document.querySelector("#back-to-top-button");
/* Variables */
let actualShowPokemons = 0;
let maxIndex = 20;
let currentList = [];

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
        document.getElementById('pokedex-list-render-container').insertAdjacentHTML('beforeend', `
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
    let htmlToReturn = '<div class="row">';

    for (let i = 0; i < types.length; i++) {
        htmlToReturn += `
        <div class="type-container" style="background: ${typeColors[types[i]]};">
            ${types[i]}
        </div>
        `;
    };
    return htmlToReturn;   
};



window.addEventListener('scroll', () => {
    addNewScrollPokemon();
    toTopButtonVisibility();
});

function addNewScrollPokemon() {
    if (window.scrollY + 100 >= document.documentElement.scrollHeight - document.documentElement.clientHeight) {
        showNextPokemons(33);
        updatePokemonList();
    };
};

function toTopButtonVisibility() {
    if (window.scrollY > window.innerHeight) {
        document.getElementById('back-to-top-button').classList.remove('hide');
    } else {
        document.getElementById('back-to-top-button').classList.add('hide');
    };
};

/* Listeners */
toTopButton.addEventListener('click', () => {
    window.scrollTo(0, 0);

})

