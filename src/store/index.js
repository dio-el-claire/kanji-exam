import Vue from 'vue'
import Vuex from 'vuex'
import { loadKanjiGroups } from '@/lib'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    kanjiGroups: []
  },
  mutations: {
    setKanjiGroupsLoading (state) {
      state.kanjiGroups.loading = true
    },
    setKanjiGroups (state, groups) {
      state.kanjiGroups.loading = false
      state.kanjiGroups = groups
    }
  },
  actions: {
    async LOAD_KANJI_GROUPS ({ commit, state }) {
      commit('setKanjiGroupsLoading')
      const groups = await loadKanjiGroups()
      commit('setKanjiGroups', groups)
      console.log(groups)
    }
  }
})
