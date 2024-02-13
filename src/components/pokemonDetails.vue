<template>
<q-card class="fit">
    <q-spinner  size="xl" v-if="isLoading === true"></q-spinner>
    <q-card-section v-if="isLoading === false">
        <q-carousel
          animated
          v-model="slide"
          arrows
          control-color="primary"
          navigation
          infinite
        >
            <q-carousel-slide v-for="(image,index) in pokemonImage" :name="index" :img-src="image" />
        </q-carousel>
        <q-card-section>
            <div class="text-weight-bold text-center text-h2 text-capitalize text-primary">{{ pokemonName }}</div>
            <div class="text-subtitle text-grey text-center q-mt-md">{{ pokemonWeight }} lbs</div>
            <div class="text-center text-weight-bold text-h5 q-mt-md">Abilities</div>
           <div class="flex flex-center skill" v-for="ability in pokemonAbility" :key="ability">
                {{ ability.name }}
            </div>
        </q-card-section>
    </q-card-section>
</q-card>

</template>

<script setup>
import { ref,onMounted } from 'vue'
import { usePokemonStore } from 'src/stores/pokemon';
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios';

const slide = ref(1);
const isLoading = ref(false);
const store = usePokemonStore();
const $q = useQuasar();
const pokemonDetails = ref(null);
const pokemonImage = ref(null);
const pokemonName = ref(null);
const pokemonAbility = ref([]);
const pokemonWeight = ref(null);


async function getPokemonDetail(){
    isLoading.value = true;
    await api.get(store.lastSelectedPokemon).then((response) => {
        pokemonDetails.value = response.data
        pokemonName.value = pokemonDetails.value.name;
        pokemonWeight.value = pokemonDetails.value.weight;
        pokemonDetails.value.abilities.forEach(element => {
            pokemonAbility.value.push(element.ability);
        });;
        let obj = pokemonDetails.value.sprites
        pokemonImage.value = Object.keys(obj)
                                    .filter(key => obj[key] !== null)
                                    .map(key => obj[key]);
        pokemonImage.value = pokemonImage.value.filter(item => typeof item === 'string');
        isLoading.value = false
    })
}

onMounted(()  => {
    getPokemonDetail()
})
</script>


<style lang="scss">
.skill{
    width: 80%;
  margin: 0 auto;
  padding: 20px;
  margin-bottom: 20px;
  margin-top:20px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);

  h1 {
    font-size: 2em;
    color: #212529;
    margin-bottom: 10px;
  }

  p {
    font-size: 1em;
    color: #6c757d;
  }
}
</style>