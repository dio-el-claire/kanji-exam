<template>
  <div id="kanji-group">
    <b-navbar :transparent="true" :shadow="true" :spaced="true" id="kanji-group-nav">
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
          <a href="#" @click.prevent="goToKanji(prevKanji)" class="pagination-link pagination-previous">
            <span class="icon">
              <i class="mdi mdi-chevron-left mdi-24px"></i>
            </span>
            <span class="kanji">{{prevKanji.sign}}</span>
          </a>
        </span>
        <span class="kanji-nav kanji-nav-next pagination is-rounded">
          <a href="#" @click.prevent="goToKanji(nextKanji)" class="pagination-link pagination-previous">
            <span class="icon">
              <span class="kanji">{{nextKanji.sign}}</span>
              <i class="mdi mdi-chevron-right mdi-24px"></i>
            </span>
          </a>
        </span>
      </div>
      <KanjiesList v-else-if="visibleKanjies.length" :kanjies="visibleKanjies" :showKanji="showKanji"></KanjiesList>
      <Spinner v-else></Spinner>
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
import Spinner from '@/components/Spinner'

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
    totalPages() {
      return Math.ceil(this.selectedGroup.kanjies.length / ITEMS_PER_PAGE)
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
    },
    nextKanji() {
      return this.siblingKanji('next')
    },
    prevKanji() {
      return this.siblingKanji('prev')
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
    closeKanjiCard() {
      const { id, page } = this.$route.params
      this.goTo(id, page)
    },
    showKanji(kanji) {
      const { id, page } = this.$route.params
      this.goTo(id, page, kanji.sign)
    },
    siblingKanji(direction = 'next') {
      const kanjies = this.selectedGroup.kanjies
      const step = direction === 'next' ? 1 : -1
      let ndx = kanjies.indexOf(this.kanji) + step
      if (ndx < 0) {
        ndx = kanjies.length - 1
      } else if (ndx >= kanjies.length) {
        ndx = 0
      }
      return kanjies[ndx]
    },
    goToKanji(kanji) {
      const ndx = this.selectedGroup.kanjies.indexOf(kanji)
      const page = Math.ceil((ndx + 1) / ITEMS_PER_PAGE)
      this.goTo(this.$route.params.id, page, kanji.sign)
    }
  },
  components: { KanjiesList, KanjiCard, Spinner }
}
</script>

<style media="screen">
  #kanji-group {
    /* background-color: rgba(0, 0, 0, 0.008) */
  }

  #kanji-group-nav {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 50px;
  }
  .dropdown-content .nav-custom-group:first {
    border-top: 1px solid #000;
  }
  .kanji-group-container {
    position: relative;
    padding: calc(50px + 1rem) 0 1rem 0;
    height: 100%;
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
    /* background-color: #fff; */
    background-color: rgba(0, 0, 0, 0.008);
    cursor: pointer;
  }

  .kanji-nav {
    position: absolute;
    top: 280px;
  }
  .kanji-nav-prev {
    left: 3rem;
  }

  .kanji-nav-next {
    right: 3rem;
  }
</style>
