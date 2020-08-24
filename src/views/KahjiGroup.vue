<template>
  <div id="kanji-group">
    <b-navbar :transparent="true" :shadow="true" :spaced="true">
      <template slot="start">
        <b-navbar-item>
          <b-dropdown v-model="selectedGroup">
            <button class="button" type="button" slot="trigger" slot-scope="{ active }">
              <span>{{selectedGroup.label}}</span>
              <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
            </button>
            <b-dropdown-item v-for="group in kanjiGroups" :key="group.id" :value="group">
              <hr v-if="isFirstCustomGroup(group)" class="dropdown-divider">
              <div>
                {{group.label}} ({{group.kanjies.length}})
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </b-navbar-item>
      </template>
      <template slot="end">
        custom groups control
      </template>
    </b-navbar>
    <div class="container kanji-group-container">
      <div v-if="kanji">
        <KanjiCard :kanji="kanji"></KanjiCard>
        <span class="kanji-nav kanji-nav-prev pagination is-rounded">
          <a href="#" class="pagination-link pagination-previous">
            <span class="icon">
              <i class="mdi mdi-chevron-left mdi-24px"></i>
            </span>
            1
          </a>
        </span>
        <span class="kanji-nav kanji-nav-next pagination is-rounded">
          <a href="#" class="pagination-link pagination-previous">
            <span class="icon">
              2
              <i class="mdi mdi-chevron-right mdi-24px"></i>
            </span>
          </a>
        </span>

        <div style="text-align: center; margin-top: 2rem">
          <a @click.prevent="returnToGroup">Return to group</a>
        </div>
      </div>
      <KanjiesList v-else :kanjies="visibleKanjies" :showKanji="showKanji"></KanjiesList>
      <b-pagination v-if="selectedGroup.kanjies.length" v-show="!kanji"
          :total="totalKanjies"
          :current.sync="currentPage"
          :range-before="4"
          :range-after="4"
          :simple="false"
          :rounded="true"
          :per-page="kanjiesPerPage"
          icon-prev="chevron-left"
          icon-next="chevron-right"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page">
      </b-pagination>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ITEMS_PER_PAGE } from '@/config'
import KanjiesList from '@/components/KanjiesList'
import KanjiCard from '@/components/KanjiCard'

export default {
  data () {
    return {
      groupId: 'grade-1',
      kanjiesPerPage: ITEMS_PER_PAGE
    }
  },
  name: 'KanjiGroup',
  computed: {
    ...mapState(['kanjiGroups']),
    ...mapState({
      visibleKanjies (state) {
        const kanjies = this.selectedGroup.kanjies || []
        const offset = (this.$route.params.page - 1) * ITEMS_PER_PAGE
        return kanjies.slice(offset, offset + ITEMS_PER_PAGE)
      }
    }),
    currentPage: {
      get() { return parseInt(this.$route.params.page) },
      set(val) { this.goTo(this.$route.params.id, val) }
    },
    totalKanjies () {
      return this.selectedGroup.kanjies.length
    },
    selectedGroup: {
      get () {
        const groups = this.kanjiGroups
        const selectedId = this.$route.params.id
        return groups.length
          ? groups.find(g => g.id === selectedId)
          : { label: '...loading', kanjies: [] }
      },
      set (val) {
        this.goTo(val.id)
      }
    },
    kanji() {
      const sign = this.$route.params.kanji
      const kanjies = this.selectedGroup.kanjies
      return sign && kanjies.length
        ? kanjies.find(k => k.sign === sign)
        : null
    }
  },
  methods: {
    isFirstCustomGroup(group) {
      if (group.custom) {
        const ndx = this.kanjiGroups.indexOf(group)
        return !this.kanjiGroups.[ndx - 1].custom
      }
    },
    goTo(id, page = 1, kanji) {
      const params = { id, page }
      if (kanji) {
        params.kanji = kanji
      }
      this.$router.push({ name: 'KanjiGroup', params })
    },
    returnToGroup() {
      const { id, page } = this.$route.params
      this.goTo(id, page)
    },
    showKanji(kanji) {
      console.log('showKanji', kanji.sign)
      const { id, page } = this.$route.params
      this.goTo(id, page, kanji.sign)
    }
  },
  components: { KanjiesList, KanjiCard }
}
</script>

<style media="screen">
  #kanji-group {
    background-color: rgba(0, 0, 0, 0.008)
  }
  .dropdown-content .nav-custom-group:first {
    border-top: 1px solid #000;
  }
  .kanji-group-container {
    position: relative;
    padding: 1rem 0;
  }
  .kanji-group-content {
    flex-wrap: wrap;
  }
  .kanji-box {
    min-width: 190px;
    /* max-width: 190px; */
    padding: 1rem;

  }

  .kanji-card-small {
    padding: 1rem;
    border: 2px solid rgba(10, 10, 10, .2);
    border-radius: 6px;
    background-color: #fff;
    cursor: pointer;
  }

  .kanji-nav {
    position: absolute;
    top: calc(50% - 50px);
  }
  .kanji-nav-prev {
    left: 3rem;
  }

  .kanji-nav-next {
    right: 3rem;
  }
</style>
