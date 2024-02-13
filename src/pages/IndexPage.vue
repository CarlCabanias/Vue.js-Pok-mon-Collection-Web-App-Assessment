<template>
  <q-page class="">
    <div class="row justify-center q-mt-xl">
      <div class="col-12 col-md-6 q-mr-xl q-mb-xl ">
        <div class=" q-mb-xl">
          <div class="text-center text-weight-bold text-h4 q-mb-md">List of Pokemons</div>
          <q-card  class="q-mb-md row skill" v-for="pokemon in store.pokemons.results" :key="pokemon">
            <q-card-section class="listItem ">
              {{ pokemon.name }}
            </q-card-section>
            <q-card-actions class="absolute-right">
              <q-btn class="bg-primary text-white" push rounded @click="openDetails(pokemon.url)">Details</q-btn>
              <q-btn class="cursor-pointer" push icon="star" :text-color="changeColor(pokemon.name)" round @click="addToFavorites(pokemon)"></q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <q-pagination
          class="flex flex-center"
          v-model="page"
          max-pages="10"
          :max="store.pokemons.count/5 + 1"
          @update:model-value="getPokemons"
        />
      </div>
      <div class="col-12 col-md-4">
        <div class="text-center text-weight-bold text-h4 q-mb-md">Favorites</div>
        <q-virtual-scroll
            style="max-height: 70vh;"
            :items="store.favoritePokemons"
            v-slot="{ item : pokemon, index }"
          >
    <q-item
      :key="index"
      dense
    >
        <q-card style="width: 30vw;" class="q-mb-md row skill">
            <q-card-section class="listItem ">
              {{ pokemon.name }}
            </q-card-section>
            <q-card-actions class="absolute-right">
              <q-btn class="bg-primary text-white" push  rounded @click="openDetails(pokemon.url)">Details</q-btn>
              <q-btn class="cursor-pointer" push icon="delete" color="negative" round @click="addToFavorites(pokemon)"></q-btn>
            </q-card-actions>
          </q-card>
          </q-item>
          </q-virtual-scroll>
      </div>  
    </div>
  </q-page>
  <q-dialog v-model="detailsModal">
    <pokemonDetails />
  </q-dialog>

</template>

<script setup>
import { ref,onMounted } from 'vue'
import { usePokemonStore } from 'src/stores/pokemon';
import { useQuasar } from 'quasar'
import pokemonDetails from 'src/components/pokemonDetails.vue';

const detailsModal = ref(false)
const page = ref(1);
const limit = 5;
const store = usePokemonStore();
const $q = useQuasar();
const toRemove = "https://pokeapi.co/api/v2/";


function openDetails(link){
  let newLink = link.replace(toRemove, "");
  store.lastSelectedPokemon = newLink;
  detailsModal.value = true;
}


async function getPokemons(){
  $q.loading.show()
  await store.getPokemons(limit,(page.value - 1) * limit,page.value).then(() => {$q.loading.hide()});
}

function addToFavorites(pokemon){
  if(store.favoritePokemons.some((el) => el.name === pokemon.name)){
    store.removeToFavorites(pokemon)
  }
  else{
    if(store.favoritePokemons.length < 20){
      store.addToFavorites(pokemon)
    }
    else{
      $q.notify(
        {
          message:'Favorites Max Limit Reached',
          color:'negative'
        }
      )
    }
  }
}


function changeColor(pokemon){
  if(store.favoritePokemons.some((el) => el.name === pokemon)){
    return 'orange';
  }
  else{
    return 'grey';
  }
}


onMounted(() => {
  page.value = store.offset
  getPokemons()

})
</script>

<style lang="scss">
  .listItem{
    font-weight: bold;
    font-size:x-large;
    text-transform: uppercase;
  }

</style>
