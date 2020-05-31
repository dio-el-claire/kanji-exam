<template>
  <div id="kanji-group">
    <group-selector v-if="selectedGroup"
      :groups="groups"
      :selectedGroup="selectedGroup"
      :customGroups="customGroups"
      :selectGroup="selectGroup"
      :createCustomGroup="createCustomGroup"
      :deleteCustomGroup="deleteCustomGroup"
      :addKanjiToGroup="addKanjiToGroup"
      :selectedKanjiCount="selectedKanji.length">
    </group-selector>
    <div id="kanji-group_view">
      <b-container v-if="selectedGroup">
        <b-row>
          <b-col v-show="!kanji">
            <div class="float-right" style="cursor: pointer">
              <div v-if="selectedKanji.length" @click.stop="unselectAll()">
                <b-icon-check-all  />
                unselect all
              </div>
              <div v-else-if="models.length" @click.stop="selectAll()">
                <b-icon-check-all  />
                select all
              </div>
              <div v-if="selectedGroup.custom && selectedKanji.length" @click="deleteSelected()">
                <b-icon-trash />
                delete selected
              </div>
            </div>

            <pagination v-if="models.length" v-model="$route.params.page" :limit=itemsPerPage :linkGen="linkGen" :total="totalPages" />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div v-if="kanji">
              <card :kanji="kanji" :prevKanji="prevKanji" :nextKanji="nextKanji" @goToKanji="goToKanji"></card>
              <hr>
              <div style="text-align: center;">
                <span>{{kanjiIndex + 1}} of {{selectedGroup.count}}</span>
                <br>
                <a href="#" @click.prevent="returnToGroup()">Return to group</a>
              </div>
            </div>
            <div v-else-if="models.length" class="container-fluid group-container">
              <div class="row">
                <div v-for="(kanji, i) in models" :key="i" class="col-auto" @click="goToKanji(kanji)">
                  <group-item
                    :kanji="kanji"
                    :selectedKanji="selectedKanji"
                    :allowSelect="!!customGroups.length"
                    :allowDelete="selectedGroup.custom"
                    :selectKanji="selectKanji"
                    :unselectKanji="unselectKanji"
                    :deleteKanji="deleteKanjiFromGroup" />
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
        <b-row style="margin-top: 12px;">
          <b-col v-show="!kanji">
            <pagination v-if="models.length" v-model="$route.params.page" :limit=itemsPerPage :linkGen="linkGen" :total="totalPages" />
          </b-col>
        </b-row>
      </b-container>
      <b-container v-else>
        <b-spinner class="kanji-group-spinner" label="Large Spinner"></b-spinner>
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
      newGroupName: '',
      selectedKanji: []
    }
  },

  methods: {
    selectGroup(group) {
      this.$router.push({ name: 'group', params: { id: group.label, page: 1 } });
    },
    goToKanji(kanji) {
      const id = this.selectedGroup.label;
      const page = this.getPageByKanji();
      const query = { kanji: kanji.kanji };
      this.$router.push({ name: 'group', params: { id, page }, query });
    },
    goToPrevKanji() {
      this.goToKanji(this.prevKanji);
    },
    goToNextKanji() {
      this.goToKanji(this.nextKanji);
    },
    linkGen(pageNum) {
      // @todo
      return `/groups/${this.selectedGroup.label}/${pageNum}`;
    },
    getKanjiAtIndex(ndx) {
      const count = this.selectedGroup.count;

      if (ndx >= count) {
        ndx = 0;
      } else if (ndx < 0) {
        ndx = count - 1;
      }

      return this.selectedGroup.models[ndx];
    },
    getPageByKanji() {
      const ndx = this.selectedGroup.indexOf(this.kanji)
      return parseInt(ndx/CONFIG.ITEMS_PER_PAGE) + 1;
    },
    returnToGroup() {
      const id = this.selectedGroup.label;
      const page = this.getPageByKanji();
      this.$router.push({ name: 'group', params: { id, page } });
    },

    createCustomGroup(name) {
      kanjiCollection.createCustomGroup(name);
    },
    deleteCustomGroup() {
      kanjiCollection.deleteCustomGroup(this.selectedGroup);
      this.$router.push({ name: 'group', params: { id: 'grade-1', page: 1 } });
    },
    isSelected(kanji) {
      return !!this.selectedKanji.find(k => k.kanji === kanji.kanji)
    },
    selectKanji(kanji) {

      if (!this.isSelected(kanji)) {
        this.selectedKanji.push(kanji);
      }
    },
    unselectKanji(kanji) {
      const ndx = this.selectedKanji.indexOf(kanji);
      this.selectedKanji.splice(ndx, 1);
    },
    addKanjiToGroup(group) {
      group.addModels(this.selectedKanji);
      this.selectedKanji = [];
    },
    deleteKanjiFromGroup(kanji) {
      this.selectedGroup.deleteModel(kanji);
    },
    selectAll() {
      this.models.forEach(this.selectKanji, this);
    },
    unselectAll() {
      this.selectedKanji = [];
    },
    deleteSelected() {
      this.selectedKanji.forEach(this.selectedGroup.deleteModel, this.selectedGroup);
      this.unselectAll();
    }
  },
  computed: {
    selectedGroup() {
      return this.groups.find(group => group.label === this.$route.params.id)
    },
    models() {
      const limit = CONFIG.ITEMS_PER_PAGE;
      const start = limit * (this.$route.params.page - 1);
      const end = start + limit;

      const m = this.selectedGroup ? this.selectedGroup.slice(start, end) : [];

      return m;
    },
    kanji() {
      return this.selectedGroup ? this.selectedGroup.findKanji(this.$route.query.kanji) : null;
    },
    nextKanji() {
      if (this.kanji) {
        return this.getKanjiAtIndex(this.selectedGroup.indexOf(this.kanji) + 1);
      }
      return null;
    },
    prevKanji() {
      if (this.kanji) {
        return this.getKanjiAtIndex(this.selectedGroup.indexOf(this.kanji) - 1);
      }
      return null;
    },
    customGroups() {
      return kanjiCollection.groups.filter(group => group.custom);
    },
    totalPages() {
      return Math.ceil(this.selectedGroup.models.length / CONFIG.ITEMS_PER_PAGE);
    },
    kanjiIndex() {
      return this.selectedGroup.indexOf(this.kanji);
    },
    groupURL() {
      return `/groups/${this.$route.params.id}/${this.$route.params.page}`;
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

  .kanji-group-spinner {
    width: 5rem !important;
    height: 5rem !important;
    position: absolute;
    top: 50%;
    left: 50%;
  }

  .col-auto {
    cursor: pointer;
  }
</style>
