<template>
  <b-container>
    <b-row>
      <b-col cols="2">
        <b-nav vertical align="left">
          <b-nav-item v-for="(group, i) in groups" :key="i" :to="{name: 'group', params: { id: group.label } }">
            {{group.label}}
            <div v-if="group.collection.loading" class="spinner-border spinner-border-sm float-right" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div v-else-if="group.collection.loaded" style="float:right">
              {{group.collection.models.length}}
            </div>
          </b-nav-item>
        </b-nav>
      </b-col>
      <b-col>
        <div v-if="group" class="container-fluid">
          <div class="row">
            <div v-for="kanji in group.collection.models" :key="kanji.kanji" class="col-auto" @click="goToCard(kanji.kanji)">
              <list-item :kanji="kanji"/>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import kanjiCollection from '../models/KanjiCollection';
import ListItem from './ListItem';

export default {

  data() {
    return {
      groups: kanjiCollection.groups,
      group: null
    }
  },

  created() {
    if (this.$route.params.id) {
      this.selectGroup(this.$route.params.id)
    }
  },

  watch: {
    $route(to) {
      console.log(to)
      if (to.params.id) {
        this.selectGroup(to.params.id)
      }
    }
  },
  methods: {
    selectGroup(label) {
      this.group = kanjiCollection.getGroup(label)
    },
    goToCard(kanji) {
      this.$router.push({ name: 'card', params: { groupId: this.group.label, kanji}});
    }
  },

  components: {ListItem}
}

</script>

<style media="screen">
  .col-auto {
    cursor: pointer;
  }
</style>
