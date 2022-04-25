<template>
  <div>  
    <photo-sorter />
  </div>
</template>

<script>
import photoSorter from './components/PhotoSorter.vue'

export default {
  name: 'App',
  components: {
    photoSorter
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
