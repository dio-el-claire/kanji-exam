<template>
  <b-container>GROUPS
    <b-row>
      <b-col cols="2">
        <b-nav vertical align="left">
          <b-nav-item v-for="(group, i) in groups" :key="i" :to="{name: 'group', params: { id: group.label, page: 1 } }">
            {{group.label}}
            <div v-if="group.loading" class="spinner-border spinner-border-sm float-right" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div v-else-if="group.loaded" style="float:right">
              {{group.models.length}}
            </div>
          </b-nav-item>
        </b-nav>
      </b-col>
      <b-col>
        <div v-if="models.length" class="overflow-auto">
          <b-pagination-nav limit="10" :link-gen="linkGen" :number-of-pages="totalPages" use-router></b-pagination-nav>
        </div>
        <div v-if="group" class="container-fluid group-container">
          <div class="row">
            <div v-for="kanji in models" :key="kanji.kanji" class="col-auto" @click="goToCard(kanji.kanji)">
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
import CONFIG from '../config';

export default {

  data() {
    return {
      groups: kanjiCollection.groups
    }
  },

  methods: {
    goToCard(kanji) {
      this.$router.push({ name: 'card', params: { groupId: this.group.label, kanji }});
    },
    linkGen(pageNum) {
      // @todo
      return `/groups/${this.group.label}/${pageNum}`;
    }
  },
  computed: {
    group() {
      return kanjiCollection.getGroup(this.$route.params.id);
    },
    models() {
      console.log('models')
      return this.group.loaded ? this.group.getPage(this.$route.params.page) : [];
    },
    totalPages() {
      return Math.ceil(this.group.models.length / CONFIG.ITEMS_PER_PAGE);
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
