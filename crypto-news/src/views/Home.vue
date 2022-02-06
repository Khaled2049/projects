<template>
  <div class="home"> 
    <News />
  </div>
</template>

<script>
// @ is an alias to /src
import News from '../components/News.vue'
export default {
  name: 'Home',
  components: {
    News
  },
  methods: {
    getNews() {
      this.axios.get('https://api.coindesk.com/v1/bpi/currentprice.json').then(response => {
        console.log(response.data);
      })
    }
  }
}
</script>
