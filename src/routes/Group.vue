<template>
  <div id="kanji-group">
    <group-selector :groups="groups" :selectedGroup="selectedGroup" :selectGroup="selectGroup">
      <div v-if="kanji">
        <span>{{kanjiIndex + 1}} of {{selectedGroup.count}}</span>
        <a href="#" @click.prevent="unsetKanji">&nbsp; Return to group</a>
      </div>
    </group-selector>
    <div id="kanji-group_view">
      <b-container>
        <b-row>
          <b-col v-show="!kanji">
            <pagination v-if="models.length" v-model="$route.params.page" :limit=itemsPerPage :linkGen="linkGen" :total="totalPages" />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div v-if="kanji">
              <card :kanji="kanji" @goPrev="showPrevKanji" @goNext="showNextKanji"></card>
            </div>
            <div v-else-if="models.length" class="container-fluid group-container">
              <div class="row">
                <div v-for="(kanji, i) in models" :key="i" class="col-auto" @click="showKanji(kanji)">
                  <group-item :kanji="kanji"/>
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
        <b-row>
          <b-col v-show="!kanji">
            <pagination v-if="models.length" v-model="$route.params.page" :limit=itemsPerPage :linkGen="linkGen" :total="totalPages" />
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import kanjiCollection from '../models/KanjiCollection';
import Pagination from '../components/Pagination';
import GroupItem from '../components/GroupItem';
import GroupSelector from '../components/GroupSelector';
import Card from '../components/Card';
import CONFIG from '../config';

const PAGINATION_LIMIT = 10;

export default {

  data() {
    return {
      groups: kanjiCollection.groups,
      itemsPerPage: PAGINATION_LIMIT,
      kanji: null
    }
  },

  methods: {
    selectGroup(group) {
      this.kanji = null;
      this.$router.push({ name: 'group', params: { id: group.label, page: 1 } });
    },
    showKanji(kanji) {
      this.$route.query.kanji = kanji.kanji;
      this.kanji = kanji;
    },
    linkGen(pageNum) {
      // @todo
      return `/groups/${this.selectedGroup.label}/${pageNum}`;
    },
    showPrevKanji() {
      this.showSiblingKanji(-1);
    },
    showNextKanji() {
      this.showSiblingKanji(1);
    },
    showSiblingKanji(delta) {
      const count = this.selectedGroup.count;
      let ndx = this.selectedGroup.indexOf(this.kanji) + delta;
      if (ndx >= count) {
        ndx = 0;
      } else if (ndx < 0) {
        ndx = count - 1;
      }
      this.kanji = this.selectedGroup.models[ndx];
      if (!this.kanji.loaded) this.kanji.fetch();

      let page = parseInt(ndx/CONFIG.ITEMS_PER_PAGE) + 1;
      if (page !== this.$route.params.page) {
        this.$router.push({ name: 'group', params: { id: this.selectedGroup.label, page: page } });
      }
    },
    unsetKanji() {
      this.kanji=null
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

      const m = this.selectedGroup.loaded ? this.selectedGroup.slice(start, end) : [];

      return m;
    },
    totalPages() {
      return Math.ceil(this.selectedGroup.models.length / CONFIG.ITEMS_PER_PAGE);
    },
    kanjiIndex() {
      return this.selectedGroup.indexOf(this.kanji);
    }
  },
  components: { GroupItem, Pagination, GroupSelector, Card }
}

</script>

<style media="screen">
  #kanji-group {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }



  #kanji-group_view {
    position: absolute;
    top: 54px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 12px 0;
  }

  .col-auto {
    cursor: pointer;
  }
</style>
