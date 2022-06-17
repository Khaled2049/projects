<template>
    <div>
        <div v-for="(news, idx) in searchedNews" :key="idx">
            <h4>{{ news.title }}</h4>
            <h5>{{ news.author }}</h5>
            <p>
                {{ news.description }}
            </p>
            <a :href="news.url">Read More</a>
            <hr>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        searchedNews: []
    }
}
</script>