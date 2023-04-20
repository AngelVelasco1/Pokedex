export default {
    principal() {


        const wk = new Worker("../storage/wkPokeapi.js");

        wk.onmessage = (e) => {
            
        }
    }
}