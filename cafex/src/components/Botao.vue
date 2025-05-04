<template>
  <button @click="onClick">{{ titulo }}</button>
</template>

<script>
export default {
  name: 'Botao',
  props: {
    titulo: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
button {
  background-color: #42b983;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
