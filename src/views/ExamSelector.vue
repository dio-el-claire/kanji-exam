<template>
  <div class="container kanji-exam-selector">
    <template v-if="kanjiGroups.length">
      <section class="section">
        <div class="columns kanji-exam-groups">
          <div class="column" style="text-align: right">
            <h2 class="subtitle">{{ $t("message.selectGroupExam") }}: </h2>
          </div>
          <div class="column">
            <b-dropdown v-model="selectedGroup">
              <button class="button" slot="trigger" slot-scope="{ active }">
                  <span>{{selectedGroup.label}}</span>
                  <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
              </button>
              <b-dropdown-item v-for="(group, i) in kanjiGroups" :key="`group${i}`" :value="group">
                {{group.label}} ({{group.kanjies.length}})
              </b-dropdown-item>
            </b-dropdown>
            <b-button type="is-success" @click="start">{{ $t("message.startExam") }}</b-button>
          </div>
        </div>
      </section>
      <section class="section kanji-exam-delim">
        <div class="subtitle">{{ $t('message.or') }}</div>
        <hr>
      </section>
      <section class="section kanji-exam-random">
        <div class="columns">
          <div class="column" style="text-align: right">
            <h2 class="subtitle">{{ $t("message.configureExam") }}: </h2>
          </div>
          <div class="column">
            <b-field :label="messageLevel">
              <b-select v-model="level" placeholder="Select level" rounded>
                  <option v-for="(level, i) in levels" :key="`level${i}`" :value="level.label">{{level.label}}</option>
              </b-select>
            </b-field>
            <b-field :label="messageNumber" style="width: 220px">
              <b-numberinput rounded v-model="qnt" :min="10" width="10"></b-numberinput>
            </b-field>
            <b-field>
              <b-button type="is-success" style="width: 220px" @click="startRandom">{{ $t("message.startExam") }}</b-button>
            </b-field>
          </div>
        </div>
      </section>
    </template>
    <Spinner v-else></Spinner>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { shuffleArray } from '@/utils'
import Spinner from '@/components/Spinner'

export default {
  data() {
    return {
      configureModalActive: false,
      levels: [
        { label: 'JLPT-5 - JLPT-4', groups: ['jlpt-5', 'jlpt-4'] },
        { label: 'JLPT-5 - JLPT-3', groups: ['jlpt-5', 'jlpt-4', 'jlpt-3'] },
        { label: 'JLPT-5 - JLPT-2', groups: ['jlpt-5', 'jlpt-4', 'jlpt-3', 'jlpt-2'] },
        { label: 'JLPT-5 - JLPT-1', groups: ['jlpt-5', 'jlpt-4', 'jlpt-3', 'jlpt-2', 'jlpt-1'] },
        { label: 'jinmeiyo', groups: ['jinmeiyo'] },
        { label: 'teacher (> JLPT-1)', hardcore: true }
      ],
      selectedGroup: null,
      level: 'JLPT-5 - JLPT-4',
      qnt: 10
    }
  },
  created() {
    this.setDefaultGroup()
  },
  computed: {
    ...mapState(['kanjiGroups']),
    messageLevel() { return this.$t('message.examLevel') },
    messageNumber() { return this.$t('message.kanjiNumber') }
  },
  methods: {
    ...mapActions(['SAVE_EXAM_CONFIG']),
    start() {
      const { id, label, kanjies: groupKanjies } = this.selectedGroup
      const kanjies = shuffleArray(groupKanjies.map(k => k.sign))
      const config = { id, label, kanjies }
      this.goToExam(config)
    },
    startRandom() {
      const level = this.levels.find(l => l.label === this.level)
      if (!(this.qnt && level)) return

      let kanjies = []
      if (level.hardcore) {
        kanjies = this.kanjiGroups
          .find(g => g.id === 'all')
          .kanjies
          .filter(k => !k.jlpt)
      } else {
        kanjies = level.groups.map(id => this.kanjiGroups.find(kg => kg.id === id).kanjies).flat()
      }

      kanjies = shuffleArray(kanjies).slice(0, this.qnt)

      const config = {
        id: uuidv4(),
        label: `Random (${this.level})`,
        kanjies: kanjies.map(k => k.sign)
      }
      this.goToExam(config)
    },
    goToExam(config) {
      this.SAVE_EXAM_CONFIG(config)
      this.$router.push({ name: 'Exam', params: { id: config.id } })
    },
    setDefaultGroup() {
      if (this.kanjiGroups.length && !this.selectedGroup) {
        this.selectedGroup = this.kanjiGroups[0]
      }
    }
  },
  watch: {
    kanjiGroups() {
      this.setDefaultGroup()
    }
  },
  components: { Spinner }
}
</script>
<style media="screen">
  .kanji-exam-selector .section {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .kanji-exam-selector .section:first-child {
    padding-top: 2rem;
  }
  .kanji-exam-selector .section:last-child {
    padding-bottom: 2rem;
  }

  .kanji-exam-groups h2 {
    line-height: 2;
  }

  .kanji-exam-groups button.is-success {
    margin-left: 0.5rem;
  }

  .kanji-exam-random h2 {
    line-height: 1;
  }

  .kanji-exam-delim {
    position: relative;
  }
  .kanji-exam-delim div {
    position: absolute;
    left: calc(50% - 25px);
    top: calc(50% - 15px);
    background: #fff;
    /* border: 1px solid #111; */
    width: 50px;
    height: 30px;
    text-align: center;
  }
</style>
