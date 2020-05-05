<template>
  <div class="card-container">
    <div class="card-group">
      <b-nav vertical align="left">
        <b-nav-item
          class="card-group-item"
          v-for="item in group.collection.models"
          :key="item.kanji"
          :to="{name: 'card', params: {groupId: group.label, kanji: item.kanji}}">
          <b>{{item.kanji}}</b> {{item.getMeaning()}}
        </b-nav-item>
      </b-nav>

    </div>
    <h1>{{kanji.kanji}}</h1>
    <p>{{kanji.getMeanings()}}</p>
  </div>
</template>

<script>
  import kanjiCollection from '../models/KanjiCollection'

  export default {
    data() {
      return {
        kanji: null,
        group: null,
        groupName: ''
      }
    },

    created() {
      const symbol = this.$route.params.kanji;
      const groupId = this.$route.params.groupId;
      console.log(symbol, groupId)
      this.group = kanjiCollection.getGroup(groupId);
      if (this.group) {
        this.selectKanji(symbol)
      }
    },

    watch: {
      $route(to) {
        this.selectKanji(to.params.kanji)
      }
    },

    methods: {
      selectKanji(symbol) {
        this.kanji = this.group.collection.findKanji(symbol);
      }
    }
  }
</script>

<style media="screen">
  .card-container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    /* border: 1px solid red; */
  }
  .card-group {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 120px;
    overflow: auto;
  }
</style>
