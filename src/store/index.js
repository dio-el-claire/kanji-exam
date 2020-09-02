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
    exam: null,
    stat: []
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
      state.exam = exam
    },
    clearExam(state) {
      state.exam = null
      state.examConfig = null
    },
    setStat(state, stat) {
      state.stat = stat
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
        const config = await cacheDb.getExamConfig()
        if (config) {
          commit('setExamConfig', config)
        }
      }
      return state.examConfig
    },
    async SAVE_EXAM({ commit }, exam) {
      commit('setExam', exam)
      cacheDb.putExam(exam)
    },
    async LOAD_EXAM({ commit }) {
      const dump = await cacheDb.getExam()
      if (dump && dump.id) {
        commit('setExam', dump)
      }
      return dump
    },
    async CLEAR_EXAM({ commit }) {
      commit('clearExam')
      return cacheDb.clearExam()
    },
    async LOAD_STAT({ commit }) {
      const stat = await cacheDb.getAllStat()
      commit.setStat(stat)
      return stat
    },
    async SAVE_STAT({ commit }, stat) {
      console.log('SAVE_STAT', stat)
      return cacheDb.putStat(stat)
    }
  }
})
