import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    favoritePokemons: [],
    pokemons: [],
    offset: 1,
    lastSelectedPokemon: ''
  }),
  getters: {

  },
  actions: {
    async getPokemons(limit = 5,offset = 0,page = 1) {
     await api.get("pokemon?limit=" + limit + "&offset=" + offset).then((response) => {
        this.pokemons = response.data;
        this.offset = page;
      })
    },
    addToFavorites(pokemon){
      this.favoritePokemons.push(pokemon);
    },
    removeToFavorites(pokemon){
      let index = this.favoritePokemons.findIndex(el => el.name === pokemon.name);
      this.favoritePokemons.splice(index, 1);
    },
    setLastSelectedPokemon(link){
      this.lastSelectedPokemon = link;
    }
  },
  persist: true
});
