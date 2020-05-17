<template>
  <div id="kanji-group">
    <div id="kanji-group_nav">
      <b-container>
      <b-nav>
        <b-nav-form>
          <div>
            Select kanji group:
            <b-dropdown id="dropdown-1" :text="selectedGroup.name" class="m-md-2">
              <b-dropdown-item v-for="group in groups" :key="group.label" :active="group.label === selectedGroup.label" @click="goToGroup(group)">
                <div>{{group.name}}</div>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </b-nav-form>
      </b-nav>
    </b-container>
    </div>
    <div id="kanji-group_view">
      <b-container>
        <b-row>
          <b-col>
            <pagination v-if="models.length" :limit=itemsPerPage :linkGen="linkGen" :total="totalPages" />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div v-if="models.length" class="container-fluid group-container">
              <div class="row">
                <div v-for="(kanji, i) in models" :key="i" class="col-auto" @click="goToCard(kanji.kanji)">
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
        <b-row>
          <b-col>
            <pagination v-if="models.length" :limit=itemsPerPage :linkGen="linkGen" :total="totalPages" />
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import kanjiCollection from '../models/KanjiCollection';
import Pagination from './Pagination';
import ListItem from './ListItem';
import CONFIG from '../config';

const PAGINATION_LIMIT = 10;

export default {

  data() {
    return {
      groups: kanjiCollection.groups,
      itemsPerPage: PAGINATION_LIMIT
    }
  },
  methods: {
    goToGroup(group) {
      console.log(group)
      this.$router.push({ name: 'group', params: { id: group.label, page: 1 } });
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

      const m = this.selectedGroup.loaded ? this.selectedGroup.slice(start, end) : [];

      return m;
    },
    totalPages() {
      return Math.ceil(this.selectedGroup.models.length / CONFIG.ITEMS_PER_PAGE);
    }

  },
  components: { ListItem, Pagination }
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

  #kanji-group_nav {
    position:absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 54px;
    border-bottom: 1px solid #eee;
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
