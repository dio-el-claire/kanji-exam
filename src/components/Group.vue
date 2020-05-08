<template>
  <b-container>
    <b-row>
      <b-col cols="2">
        <b-nav vertical align="left">
          <b-nav-item v-for="(group, i) in groups" :key="i" :to="{name: 'group', params: { id: group.label, page: 1 } }">
            {{group.label}}
            <div v-if="group.loading" class="spinner-border spinner-border-sm float-right" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div v-else-if="group.loaded" style="float:right">
              {{group.count}}
            </div>
          </b-nav-item>
        </b-nav>
      </b-col>
      <b-col>
        <h2>{{selectedGroup.label}} {{selectedGroup.loading}}</h2>
        <div v-if="models.length" class="overflow-auto">
          <b-pagination-nav limit="10" :link-gen="linkGen" :number-of-pages="totalPages" use-router></b-pagination-nav>
        </div>
        <div v-if="models.length" class="container-fluid group-container">
          <div class="row">
            <div v-for="kanji in models" :key="kanji.kanji" class="col-auto" @click="goToCard(kanji.kanji)">
              <list-item :kanji="kanji"/>
            </div>
          </div>
        </div>
        <div v-else-if="selectedGroup.error">
          <div class="error">
            Unable to load kanji list<br>
            {{selectedGroup.error}}
          </div>
        </div>
        <div v-else-if="selectedGroup.loading" class="spinner-border spinner-border-sm" role="status">
          <span class="sr-only">Loading...</span>
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
    setModels(page) {
      const limit = CONFIG.ITEMS_PER_PAGE;
      const start = limit * (page - 1);
      const end = start + CONFIG.ITEMS_PER_PAGE;
      this.models = this.selectedGroup.loaded ? this.selectedGroup.getModels(start, end) : [];
    },
    goToCard(kanji) {
      this.$router.push({ name: 'card', params: { groupId: this.selectedGroup.label, kanji }});
    },
    linkGen(pageNum) {
      // @todo
      return `/groups/${this.selectedGroup.label}/${pageNum}`;
    }
  },
  computed: {
    selectedGroup() {
      return kanjiCollection.getGroup(this.$route.params.id);
    },
    models() {
      const limit = CONFIG.ITEMS_PER_PAGE;
      const start = limit * (this.$route.params.page - 1);
      const end = start + limit;

      return this.selectedGroup.loaded ? this.selectedGroup.getModels(start, end) : []
    },
    totalPages() {
      return Math.ceil(this.selectedGroup.models.length / CONFIG.ITEMS_PER_PAGE);
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
