import Vue from 'vue'
import Vuex from 'vuex'
import cacheDb from '@/cacheDb'
import KanjiGroup from '@/models/KanjiGroup'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: localStorage.getItem('locale'),
    kanjiGroups: [],
    examConfig: null,
    exam: null
  },

  getters: {
  },

  mutations: {
    setLocale(state, locale) {
      state.locale = locale
      localStorage.setItem('locale', locale)
    },
    setKanjiGroupsLoading (state) {
      state.kanjiGroups.loading = true
    },
    setKanjiGroups (state, groups) {
      state.kanjiGroups.loading = false
      state.kanjiGroups = groups
    },
    setExamConfig(state, config) {
      state.examConfig = config
    },
    setExam(state, exam) {
      console.log('setExam', exam)
      state.exam = exam
    }
  },
  actions: {
    async LOAD_KANJI_GROUPS({ commit }) {
      commit('setKanjiGroupsLoading')
      const groups = await KanjiGroup.loadGroups()
      commit('setKanjiGroups', groups)
    },
    SAVE_EXAM_CONFIG({ commit }, config) {
      commit('setExamConfig', config)
      cacheDb.putExamConfig(config)
    },
    async LOAD_EXAM_CONFIG({ commit, state }) {
      if (!state.examConfig) {
        const configs = await cacheDb.getExamConfigs()
        if (configs.length) {
          commit('setExamConfig', configs[0])
        }
      }
      return state.examConfig
    }
  },
  async SAVE_EXAM({ commit, state }, exam) {
    commit('setExam', exam)
  }
})
