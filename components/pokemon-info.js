const closeInfoMobile = document.querySelector("#current-pokemon-responsive-close")

function openInfo(id) {
    if (window.innerWidth > 1100) {
        slideOutPokemonInfo();

        setTimeout(function () {
            dataPokemonInfo(id);
            updateCurrentImg(id);
        }, 400);
    } 
    else {
        dataPokemonInfo(id);
        updateCurrentImg(id);
    };
};

async function dataPokemonInfo(id) {
    /* Obtain the information */
    const responsePokemons = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const responseSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const pokemon = await responsePokemons.json();
    const species = await responseSpecies.json();
    
    /* Obtain the information about pokemon evolution */
    const reponseEvolutions = await fetch(species.evolution_chain.url);
    const evolution_chain = await reponseEvolutions.json();
    /* Call the function to show the info */
    setupPokemonAbout(pokemon, id, species);
    setupPokemonStats(pokemon);
    setupPokemonAbilities(pokemon);
    setupEvolutionChain(evolution_chain);
    /* Animate the section */
    slideInPokemonInfo();
    /* Responsive mode */
    if (window.innerWidth <= 1100) {
        setupResponsiveBackground(pokemon);
        openPokemonResponsiveInfo();
    };
};

function updateCurrentImg(id) {

    const currentPokemonImage = document.getElementById('current-pokemon-image');
    const img = new Image();

    img.onload = function () {
        currentPokemonImage.src = this.src;
        currentPokemonImage.style.height = this.height * 3 + 'px';
    };

    if (id >= 650) {
        img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/' + id + '.png';
    } else {
        img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/' + id + '.gif';
    };
};

function setupPokemonAbout(pokemon, id, species) {
    document.getElementById('current-pokemon-info').classList.remove('hide');
    document.getElementById('current-pokemon-id').innerHTML = 'N° ' + pokemon.id;
    document.getElementById('current-pokemon-name').innerHTML = pokemon.name;
    document.getElementById('current-pokemon-types').innerHTML = getTypeContainers(pokemons[id - 1].types);
    document.getElementById('current-pokemon-height').innerHTML = pokemon.height / 10 + 'm';
    document.getElementById('current-pokemon-weight').innerHTML = pokemon.weight / 10 + 'kg';

    for (i = 0; i < species.flavor_text_entries.length; i++) {
        if (species.flavor_text_entries[i].language.name == 'en') {
            document.getElementById('current-pokemon-description').innerHTML = species.flavor_text_entries[i].flavor_text.replace('', ' ');
            break;
        };
    };
};

function setupPokemonStats(pokemon) {
    document.getElementById('current-pokemon-stats-atk').innerHTML = pokemon.stats[0].base_stat;
    document.getElementById('current-pokemon-stats-hp').innerHTML = pokemon.stats[1].base_stat;
    document.getElementById('current-pokemon-stats-def').innerHTML = pokemon.stats[2].base_stat;
    document.getElementById('current-pokemon-stats-spa').innerHTML = pokemon.stats[3].base_stat;
    document.getElementById('current-pokemon-stats-spd').innerHTML = pokemon.stats[4].base_stat;
    document.getElementById('current-pokemon-stats-speed').innerHTML = pokemon.stats[5].base_stat;
};

function setupPokemonAbilities(pokemon) {
    document.getElementById('current-pokemon-abilitiy-0').innerHTML = pokemon.abilities[0].ability.name;
    if (pokemon.abilities[1]) {
        document.getElementById('current-pokemon-abilitiy-1').classList.remove('hide');
        document.getElementById('current-pokemon-abilitiy-1').innerHTML = pokemon.abilities[1].ability.name;
    } else {
        document.getElementById('current-pokemon-abilitiy-1').classList.add('hide');
    };//
};

function setupEvolutionChain(evolutionChain) {
    const chain = evolutionChain.chain
    const chainContainer = document.getElementById('current-pokemon-evolution-chain-container')
    const chainImages = [document.getElementById('current-pokemon-evolution-0'), document.getElementById('current-pokemon-evolution-1'), document.getElementById('current-pokemon-evolution-2')]
    const chainLevels = [document.getElementById('current-pokemon-evolution-level-0'), document.getElementById('current-pokemon-evolution-level-1')]

    if (chain.evolves_to.length != 0) {
        chainContainer.classList.remove('hide');

        setupEvolution(chain, 0);

        if (chain.evolves_to[0].evolves_to.length != 0) {
            setupEvolution(chain.evolves_to[0], 1);

            chainImages[2].classList.remove('hide');
            chainLevels[1].classList.remove('hide');
        } else {
            chainImages[2].classList.add('hide');
            chainLevels[1].classList.add('hide');
        };
    } else {
        chainContainer.classList.add('hide');
    };
};

function setupEvolution(chain, no) {
    const chainImages = [document.getElementById('current-pokemon-evolution-0'), document.getElementById('current-pokemon-evolution-1'), document.getElementById('current-pokemon-evolution-2')];
    const chainLevels = [document.getElementById('current-pokemon-evolution-level-0'), document.getElementById('current-pokemon-evolution-level-1')];

    chainImages[no].src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + filterIdFromSpeciesURL(chain.species.url) + '.png';
    chainImages[no].setAttribute('onClick', 'javascript: ' + 'openInfo(' + filterIdFromSpeciesURL(chain.species.url) + ')');
    chainImages[no + 1].src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + filterIdFromSpeciesURL(chain.evolves_to[0].species.url) + '.png';
    chainImages[no + 1].setAttribute('onClick', 'javascript: ' + 'openInfo(' + filterIdFromSpeciesURL(chain.evolves_to[0].species.url) + ')');

    if (chain.evolves_to[0].evolution_details[0].min_level) {
        chainLevels[no].innerHTML = 'Lv. ' + chain.evolves_to[0].evolution_details[0].min_level;
    } else {
        chainLevels[no].innerHTML = '?';
    };
};

function filterIdFromSpeciesURL(url) {
    return url.replace('https://pokeapi.co/api/v2/pokemon-species/', '').replace('/', '');
};



function setupResponsiveBackground(pokemon) {
    document.getElementById('current-pokemon-responsive-background').style.background = typeColors[pokemon.types[0].type.name];
};

function openPokemonResponsiveInfo() {
    document.getElementById('current-pokemon-container').classList.remove('hide');
    document.getElementById('current-pokemon-container').style.display = 'flex';
    document.getElementById('current-pokemon-responsive-close').classList.remove('hide');

    document.getElementById('current-pokemon-responsive-background').classList.remove('hide');

    document.getElementById('current-pokemon-responsive-background').style.opacity = 0;
    setTimeout(function () {
        document.getElementById('current-pokemon-responsive-background').style.opacity = 1;
    }, 20);

    document.getElementsByTagName('html')[0].style.overflow = 'hidden';
};

closeInfoMobile.addEventListener("click", () => {
    setTimeout(function () {
        document.getElementById('current-pokemon-container').classList.add('hide');
        document.getElementById('current-pokemon-responsive-close').classList.add('hide');

        document.getElementById('current-pokemon-responsive-background').classList.add('hide');
    }, 350);

    document.getElementById('current-pokemon-responsive-background').style.opacity = 1;
    setTimeout(function () {
        document.getElementById('current-pokemon-responsive-background').style.opacity = 0;
    }, 10);

    document.getElementsByTagName('html')[0].style.overflow = 'unset';

    slideOutPokemonInfo();
})


window.addEventListener('resize', function () {
    if (document.getElementById('current-pokemon-container').classList.contains('slide-out')) {
        document.getElementById('current-pokemon-container').classList.replace('slide-out', 'slide-in');
    };

    if (window.innerWidth > 1100) {
        document.getElementsByTagName('html')[0].style.overflow = 'unset';
    };
});




function slideOutPokemonInfo() {
    document.getElementById('current-pokemon-container').classList.remove('slide-in');
    document.getElementById('current-pokemon-container').classList.add('slide-out');
};

function slideInPokemonInfo() {
    document.getElementById('current-pokemon-container').classList.add('slide-in');
    document.getElementById('current-pokemon-container').classList.remove('slide-out');
};


