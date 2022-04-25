<template>
  <div class="photo-sorter">
    <h1 align="center">IMAGE SORTER FINAL PROJECT</h1>
    <div class="row">
      <div class="col">
        <ul class="d-flex justify-content-center">
          <li
            id="1"
            :class="[option === '1' ? 'active' : '', 'list-group-item']"
            @click="all"
          >
            ALL
          </li>
          <li
            id="2"
            :class="[option === '2' ? 'active' : '', 'list-group-item']"
            @click="outdoor"
          >
            outdoor scenes (cluster - 1)
          </li>
          <li
            id="3"
            :class="[option === '3' ? 'active' : '', 'list-group-item']"
            @click="people"
          >
            people (cluster - 2)
          </li>
          <li
            id="4"
            :class="[option === '4' ? 'active' : '', 'list-group-item']"
            @click="sky"
          >
            images containing sky (cluster - 3)
          </li>
          <li
            id="5"
            :class="[option === '5' ? 'active' : '', 'list-group-item']"
            @click="flowers"
          >
            images containing flowers (cluster - 4)
          </li>
          <li
            id="6"
            :class="[option === '6' ? 'active' : '', 'list-group-item']"
            @click="buildings"
          >
            images containing structures (cluster - 5)
          </li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div v-for="img in images" class="m-3" :key="img.id">
          <div class="m-3 col" align="center">
            <div class="row">
              <div class="col-3"></div>
              <div class="info col-2">
                <label>ID: {{ img.id }}</label>
                <label v-if="selected">Similarity: {{ img.similarity }}</label>
                <label v-if="!selected">Distance: {{ img.distance }}</label>
              </div>
              <div class="col-5">
                <img @click="selectedImg(img)" :src="getImgUrl(img.path)" />
              </div>
              <div class="col-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as data from '../../../models/data.json';
let { sorted_images, clusters, cluster_map } = data;
sorted_images = Object.assign({}, ...sorted_images);

export default {
  name: 'photoSorter',
  data() {
    return {
      sorted_images,
      clusters,
      cluster_map,
      images: sorted_images,
      selected: true,
      option: 1,
    };
  },
  computed: {},
  methods: {
    getImgUrl(path) {
      return require('./' + path);
    },
    all(e) {
      this.selected = true;
      this.option = e.target.id;
    },
    outdoor(e) {
      this.selected = false;
      this.images = clusters[0];
      this.option = e.target.id;
    },
    people(e) {
      this.selected = false;
      this.images = clusters[1];
      this.option = e.target.id;
    },
    sky(e) {
      this.selected = false;
      this.images = clusters[2];
      this.option = e.target.id;
    },
    flowers(e) {
      this.selected = false;
      this.images = clusters[3];
      this.option = e.target.id;
    },
    buildings(e) {
      this.selected = false;
      this.images = clusters[4];
      this.option = e.target.id;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 3.5rem;
  padding: 2rem;
}
.photo-sorter {
  background-image: linear-gradient(
    to right,
    rgb(242, 112, 156),
    rgb(255, 148, 114)
  );
}
.info {
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
}
img {
  width: 500px;
  height: 350px;
}
.list-group-item {
  border: 1px solid black;
}
</style>
