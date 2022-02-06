<template>
    <div>
        <div class="container">
            <div class="d-flex">
                <b-form-input v-on:keyup.enter="getNews(params)" v-model="params.q" placeholder="Search For News"></b-form-input>
                <b-button class="btn-success mx-2" @click="getNews(params)">Search</b-button>
            </div> 
            <div class="news-section" v-if="showNews">
                <news-card :searchedNews="news"/>
            </div>
            
        </div>
    </div>
</template>
<script>
import NewsCard from '../components/NewsCard.vue';
export default {
    components: { 
        NewsCard 
    },
    data (){
        return {
            showNews: false,
            news: [],
            params: {
                apiKey: process.env.VUE_APP_APIKEY,
                q: ''
            }
        }
    },
    computed: {
        options() {
            const params = new URLSearchParams();
            params.append(this.apiKey);
            return params;
        }
    }, 
    methods: {
        getNews(params) {
            let url = 'https://newsapi.org/v2/everything?' + 'from=2022-01-25&' + 'sortBy=popularity';
            this.axios.get(url, { params }).then((res) => {
                this.news = res.data.articles.slice(0,5);
                this.showNews = true;
            })
        },
    }
}
</script>

<style scoped>
    .news-section {
        margin-top: 50px;
    }
</style>