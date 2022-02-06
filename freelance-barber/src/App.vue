<template>
  <div>
    <Header />
  </div>
  <router-view/>
</template>

<script>
import Header from './components/layout/Header.vue'
export default {
  components: {
    Header
  }
}
</script>


<style lang="scss">
#app {
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
  * {
    box-sizing: border-box;
  }

  html {
    font-family: "Roboto", sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
  }
}
</style>
