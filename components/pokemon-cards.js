export default {
    showCards() {
        let wk = new Worker("storage/wkPokemon-cards.js");

        wk.addEventListener("message", (e) => {
            let pokedexList = document.getElementById('pokedex-list-render-container');
            let pokemons = [' '];
            let actualShowPokemons = 0;
            let maxIndex = 33;
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
            pokemons = e.data;

            /* Search Engine */
            const searchInput = document.getElementById('search-input');
            searchInput.addEventListener('keyup', () => {
                let searchResults = [];
                let searchValue = searchInput.value.toLowerCase();

                searchResults = pokemons.filter(pokemon => pokemon.name.trim().includes(searchValue));

                pokedexList.innerHTML = ' ';
                currentList = searchResults;
                actualShowPokemons = 0;
                maxIndex = 0;

                showNextPokemons(33);
                updatePokemonList();
            });

            /* Principal cards functions */
            function updatePokemonList() {
                if (actualShowPokemons <= maxIndex) {
                    viewPokemons(actualShowPokemons);
                };
            };
            
            function viewPokemons(index) {
                let currentPokemon = currentList[index];

                if (currentPokemon) {
                    const pokemonResult = document.createElement('div');
                    pokemonResult.classList.add('pokemon-render-result-container', 'container', 'center', 'column');

                    pokemonResult.addEventListener("click", () => {
                        openInfo(`${currentPokemon.id}`)
                    })

                    pokemonResult.innerHTML = `
                    <img class="search-pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentPokemon.id}.png">
                    <span class="bold font-size-12">N° ${currentPokemon.id}</span>
                    <h3>${currentPokemon.name}</h3>
                    <span>${getTypeContainers(currentPokemon.types)}</span>
                    `
                    pokedexList.appendChild(pokemonResult);

                    actualShowPokemons += 1;
                    updatePokemonList();
                };
            };

            function showNextPokemons(to) {
                if (maxIndex <= currentList.length) {
                    maxIndex += to;
                } else {
                    maxIndex = currentList.length - 1;
                };
            };
            /* Show Next 33 Pokemons */
            const windowHeight = window.innerHeight;
            const toTopButton = document.querySelector("#back-to-top-button");

            const onScroll = () => {
                if (window.scrollY + 100 >= document.documentElement.scrollHeight - document.documentElement.clientHeight) {
                    showNextPokemons(33);
                    updatePokemonList();
                }
                toTopButton.classList.remove('hide', window.scrollY > windowHeight)
            };

            window.addEventListener('scroll', onScroll);
            
            function getTypeContainers(types) {
                let htmlToReturn = types.map(type => `
                <div class="type-container" style="background: ${typeColors[type]};display:inline-block">   
                   ${type}
                </div>
                `).join('');
                return htmlToReturn;
            };

            /* Funcions lateral info pokemon */
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
            
            /* Call all Data API */
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

            /* Show lateral gifs */
            function updateCurrentImg(id) {
                const currentImage = document.getElementById('current-pokemon-image');
                const img = new Image();

                img.onload = function () {
                    currentImage.src = this.src;
                    currentImage.style.height = "160px";
                };

                if (id <= 650) {
                    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
                }
                else {
                    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${id}.png`;
                };
            };

            /* Stats - All Descripcions */
            function setupPokemonAbout(pokemon, id, species) {
                const pokemonInfo = document.getElementById('current-pokemon-info');
                const pokemonId = document.getElementById('current-pokemon-id');
                const pokemonName = document.getElementById('current-pokemon-name');
                const pokemonType = document.getElementById('current-pokemon-types');
                const pokemonHeight = document.getElementById('current-pokemon-height');
                const pokemonWeight = document.getElementById('current-pokemon-weight');
                const pokemonDescription = document.getElementById('current-pokemon-description')

                pokemonInfo.classList.remove('hide');
                pokemonId.innerText = `N° ${pokemon.id}`;
                pokemonName.innerText = pokemon.name;
                pokemonType.innerHTML = getTypeContainers(pokemons[id - 1].types);
                pokemonHeight.innerText = `${pokemon.height / 10} m`
                pokemonWeight.innerText = `${pokemon.weight / 10} kg`

                const description = species.flavor_text_entries.find(entry => entry.language.name === "en");
                pokemonDescription.textContent = description.flavor_text.replace('', ' ');
            };
            function setupPokemonStats(pokemon) {
                const hp = document.getElementById('current-pokemon-stats-hp')
                const atk = document.getElementById('current-pokemon-stats-atk');
                const def = document.getElementById('current-pokemon-stats-def');
                const spa = document.getElementById('current-pokemon-stats-spa')
                const spd = document.getElementById('current-pokemon-stats-spd');
                const sp = document.getElementById('current-pokemon-stats-speed');

                hp.innerText = pokemon.stats[0].base_stat;
                atk.innerText = pokemon.stats[1].base_stat;
                def.innerText = pokemon.stats[2].base_stat;
                spa.innerText = pokemon.stats[3].base_stat;
                spd.innerText = pokemon.stats[4].base_stat;
                sp.innerText = pokemon.stats[5].base_stat;
            };
            function setupPokemonAbilities(pokemon) {
                let abilitie0Container = document.getElementById('current-pokemon-abilitiy-0');
                let abilitie1Container = document.getElementById('current-pokemon-abilitiy-1');
                let abilitie0 = pokemon.abilities[0]
                let abilitie1 = pokemon.abilities[1];

                abilitie0Container.innerText = abilitie0.ability.name;
                if (abilitie1) {
                    abilitie1Container.classList.remove('hide');
                    abilitie1Container.innerText = abilitie1.ability.name;
                }
                else {
                    abilitie1Container.classList.add('hide')
                }
            };

            /* Evolutions */
            function setupEvolutionChain(evolutionChain) {
                const chain = evolutionChain.chain
                const chainContainer = document.getElementById('current-pokemon-evolution-chain-container')
                const chainImages = [document.getElementById('current-pokemon-evolution-0'), document.getElementById('current-pokemon-evolution-1'), document.getElementById('current-pokemon-evolution-2')]
                const chainLevels = [document.getElementById('current-pokemon-evolution-level-0'), document.getElementById('current-pokemon-evolution-level-1')]

                if (chain.evolves_to.length) {
                    chainContainer.classList.remove('hide');
                    setupEvolution(chain, 0);

                    const secondEvolution = chain.evolves_to[0];

                    if (secondEvolution.evolves_to.length) {
                        setupEvolution(secondEvolution, 1);
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
                const chainImages = [
                    document.getElementById('current-pokemon-evolution-0'),
                    document.getElementById('current-pokemon-evolution-1'),
                    document.getElementById('current-pokemon-evolution-2')
                ];
                const chainLevels = [
                    document.getElementById('current-pokemon-evolution-level-0'),
                    document.getElementById('current-pokemon-evolution-level-1')
                ];
                const fromPokemonId = filterIdFromSpeciesURL(chain.species.url);
                const toPokemonId = filterIdFromSpeciesURL(chain.evolves_to[0].species.url);

                chainImages[no].src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fromPokemonId}.png`;
                chainImages[no].addEventListener("click", () => {
                    openInfo(fromPokemonId)
                })

                chainImages[no + 1].src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${toPokemonId}.png`;
                chainImages[no + 1].addEventListener("click", () => {
                    openInfo(toPokemonId)
                })

                if (chain.evolves_to[0].evolution_details[0].min_level) {
                    chainLevels[no].innerHTML = 'Lv. ' + chain.evolves_to[0].evolution_details[0].min_level;
                } else {
                    chainLevels[no].innerHTML = '?';
                };

            };

            function filterIdFromSpeciesURL(url) {
                return url.replace('https://pokeapi.co/api/v2/pokemon-species/', '').replace('/', '');
            };
            /* Responsive View */
            function setupResponsiveBackground(pokemon) {
                const resposiveBackground = document.getElementById('current-pokemon-responsive-background');
                resposiveBackground.style.background = typeColors[pokemon.types[0].type.name];
            };

            function openPokemonResponsiveInfo() {
                const defaultPokemonContainer = document.getElementById('current-pokemon-container');
                const resposiveBackground = document.getElementById('current-pokemon-responsive-background')
                const closeButton = document.getElementById('current-pokemon-responsive-close');

                defaultPokemonContainer.classList.remove('hide');
                defaultPokemonContainer.style.display = 'flex';
                resposiveBackground.classList.remove('hide');
                closeButton.classList.remove('hide');

                setTimeout(function () {
                    resposiveBackground.style.opacity = 1;
                }, 20);

                document.getElementsByTagName('html')[0].style.overflow = 'hidden';
            };
            const closeInfoMobile = document.querySelector("#current-pokemon-responsive-close")
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

            /* Main loading */
            function loadingCompletion() {
                let loadingDiv = document.getElementById('loading-div');
                loadingDiv.classList.add('hideLoading');
                /* Eliminar objeto vacio */
                pokemons.shift();
                currentList = pokemons.slice();
                updatePokemonList();
            };

            /* To top button */
            toTopButton.addEventListener('click', () => {
                window.scrollTo(0, 0);
            });
            /* Animations Functions */
            function slideOutPokemonInfo() {
                document.getElementById('current-pokemon-container').classList.remove('slide-in');
                document.getElementById('current-pokemon-container').classList.add('slide-out');
            };
            function slideInPokemonInfo() {
                document.getElementById('current-pokemon-container').classList.add('slide-in');
                document.getElementById('current-pokemon-container').classList.remove('slide-out');
            };
            /* Call important funtions */
            updatePokemonList();
            loadingCompletion();
        })
        wk.postMessage('start');
    }
}
