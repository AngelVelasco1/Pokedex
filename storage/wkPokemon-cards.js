self.addEventListener('message', async () => {
    let urlAPI = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1000");
    let responseAsJson = await urlAPI.json();

    const pokemons = [];

    for (let i = 0; i < responseAsJson.results.length; i++) {
        pokemons.push({
            id: i ,
            name: responseAsJson.results[i].name,
            types: []
        });
    }

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


    self.postMessage(pokemons);
});
