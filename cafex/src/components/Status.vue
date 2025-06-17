<script>
export default {
    name: "Status",
    props:{
        template: Object,
    },
    data(){
    return {
    }
  },
  created(){
  }
}
</script>

<template>
    <v-chip
        class=""
        :color="template?.color"
        label
        variant="outlined"
    >
        <v-icon :icon="template?.icon" start></v-icon>
        {{ template?.text }}
    </v-chip>
</template>