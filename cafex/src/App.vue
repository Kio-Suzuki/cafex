<template>
  <main>
    <Botao :onClick="handleClick" :titulo="label" />
  </main>
</template>

<script setup>
import Botao from './components/Botao.vue'
import axios from 'axios'

const handleClick = () => {
  axios
    .get('http://localhost:3334/txtBotao')
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.error('Erro ao buscar dados da API:', error)
    })
}

const label = "Clique aqui"
</script>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
