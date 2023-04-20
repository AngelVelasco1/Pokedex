let pokemons = [' '];

window.addEventListener("DOMContentLoaded",  async () => {
        let urlAPI = "https://pokeapi.co/api/v2/pokemon/?limit=1200";
        let response = await fetch(urlAPI);
        let responseAsJson = await response.json();
    
        for (let i = 0; i < responseAsJson.results.length; i++) {
            pokemons.push({
                id: i + 1,
                name: responseAsJson.results[i].name,
                types: []
            });
        };
        getAllTypes();  
})

async function getAllTypes() {
  const requests = [];

  for (let i = 1; i <= 18; i++) {
    const urlAPI = `https://pokeapi.co/api/v2/type/${i}`;
    requests.push(fetch(urlAPI));
  }

  const responses = await Promise.all(requests);

  const responsesAsJson = await Promise.all(responses.map((response) => response.json()));

  responsesAsJson.forEach((responseAsJson) => {
    const pokemonInType = responseAsJson.pokemon;

    pokemonInType.forEach((pokemon) => {
      const pokemonId = pokemon.pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');

      if (pokemonId <= pokemons.length && pokemons[pokemonId]) {
        pokemons[pokemonId].types.push(responseAsJson.name);
      }
    });
  });

  loadingCompletion();
}


function loadingCompletion() {
    let loadingDiv = document.getElementById('loading-div');
    loadingDiv.classList.add('hideLoading');

    setTimeout(function() {
        loadingDiv.classList.replace('hideLoading', 'hide');
        document.body.style.overflow = 'unset';
    }, 500);

    pokemons.splice(0, 1);
    currentList = pokemons;
    updatePokemonList();
};