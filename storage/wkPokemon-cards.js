self.addEventListener('message', async () => {
    /* Use the url API Name, Id and Types */
    let urlAPI = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1006");
    let responseAsJson = await urlAPI.json();
    /* Pokemons Array with empty text */
    let pokemons = [' '];
    /* Iteration for each pokemon by ID */
    for (let i = 0; i < responseAsJson.results.length; i++) {
        pokemons.push({
            id: i + 1,
            name: responseAsJson.results[i].name,
            types: []
        });
    }
    /* Call each type of pokemon */
    const requests = [];
    for (let i = 1; i <= 18; i++) {
        const urlTypesAPI = `https://pokeapi.co/api/v2/type/${i}`;
        requests.push(fetch(urlTypesAPI));
    }
    /* Simultaneous Requests types pokemons*/
    const responses = await Promise.all(requests);
    const responsesAsJson = await Promise.all(responses.map((response) => response.json()));

    /* Iteration for each Json response */
    responsesAsJson.forEach((responseAsJson) => {
        const pokemonInType = responseAsJson.pokemon;
        pokemonInType.forEach((pokemon) => {
            const pokemonId = pokemon.pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');
            /* Verify if the pokemon is in object pokemons */
            if (pokemonId <= pokemons.length && pokemons[pokemonId]) {
                pokemons[pokemonId].types.push(responseAsJson.name);
            }
        });
    });
    /* Send the pokemons to the main thread */
    self.postMessage(pokemons);
});
