<template>
  <main>
    <Botao :funcao="handleClick" :label="label" />
  </main>
</template>

<script setup>
import Botao from './components/Botao.vue'

const handleClick = () => {
  console.log('Clicou no botão')
}

const label = 'Clique aqui'
</script>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
