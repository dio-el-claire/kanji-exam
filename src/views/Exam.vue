<template>
  <div class="container kanji-exam">
    <template v-if="exam && exam.ready">
      <p class="subtitle">Exam: {{exam.label}}</p>
      <div v-if="exam.currentTicket" class="card kanji-exam-ticket">
        <div class="card-header">
          <span class="ticket-counter">
            {{exam.currentTicket.number}} {{ $t('message.of') }} {{exam.tickets.length}}
          </span>
          <p class="card-header-title is-size-1 kanji">
            <span :class="`${highlightClass} kanji-highlight`">
              {{exam.currentTicket.kanji.sign}}
            </span>
          </p>
        </div>
        <div class="card-content columns">
          <ExamCheckboxesGroup
            type="ons"
            label="onReading"
            @update="updateAnswers"
            :disabled="exam.currentTicket.complete">
          </ExamCheckboxesGroup>
          <ExamCheckboxesGroup
            type="kuns"
            label="kunReadings"
            @update="updateAnswers"
            :disabled="exam.currentTicket.complete">
          </ExamCheckboxesGroup>
          <ExamCheckboxesGroup
            type="meanings"
            label="meanings"
            @update="updateAnswers"
            :disabled="exam.currentTicket.complete">
          </ExamCheckboxesGroup>
        </div>
        <div class="card-footer">
          <b-button v-if="exam.currentTicket.complete" type="is-info" @click="nextTicket">
            <span>{{ $t("message.nextTicket") }}</span>
            <b-icon icon="chevron-double-right" size="is-small"></b-icon>
          </b-button>
          <b-button v-else type="is-success" :disabled="!ticketCanBeDone" @click="completeTicket">
            <b-icon
                icon="check"
                size="is-small">
            </b-icon>
            <span>{{ $t("message.done") }}</span>
          </b-button>
        </div>
      </div>
      <ExamResult v-else :tickets="exam.tickets"></ExamResult>
    </template>
    <template v-else>
      <Spinner :message="exam && exam.loadPercents > 10 ? 'prepareExam' : 'loadingKanjies'"></Spinner>
      <b-progress v-if="exam" :value="exam.loadPercents" show-value format="percent"></b-progress>
    </template>
  </div>
</template>
<script>
import Exam from '@/models/Exam'
import { mapActions } from 'vuex'
import Spinner from '@/components/Spinner'
import ExamCheckboxesGroup from '@/components/ExamCheckboxesGroup'
import ExamResult from '@/components/ExamResult'

export default {
  data() {
    return {
      exam: null
    }
  },
  async created() {
    const config = await this.LOAD_EXAM_CONFIG()
    const dump = await this.LOAD_EXAM()
    const id = this.$route.params.id
    console.log(config, dump)
    if (!config || config.id !== id || (dump && dump.id !== id)) {
      if (config || dump) {
        this.$buefy.toast.open({
          duration: 3000,
          message: this.$t('message.invalidExamConfig'),
          position: 'is-top',
          type: 'is-danger'
        })
      }
      this.$router.push({ name: 'ExamSelector' })
    } else {
      this.exam = new Exam(config, dump)
    }
  },
  computed: {
    ticketCanBeDone() {
      const { ons, kuns, meanings } = this.exam.currentTicket.answers
      return ons.length && kuns.length && meanings.length
    },
    highlightClass() {
      const valid = this.exam.currentTicket.isValid
      return valid === true
        ? 'has-background-success'
        : valid === false ? 'has-background-danger' : ''
    }
  },
  methods: {
    ...mapActions(['LOAD_EXAM_CONFIG', 'LOAD_EXAM', 'SAVE_EXAM']),
    completeTicket() {
      this.exam.currentTicket.validate()
    },
    updateAnswers(type, values) {
      this.exam.currentTicket.answers[type] = values
    },
    nextTicket() {
      if (this.exam.currentTicket) {
        this.SAVE_EXAM(this.exam.serialize())
      }
      this.exam.nextTicket()
    }
  },
  components: { Spinner, ExamCheckboxesGroup, ExamResult }
}
</script>
<style lang="scss">
  .kanji-exam {
    margin-top: 3rem;
    margin-bottom: 3rem;
    .card {
      width: 50%;
      border-radius: 6px;
      left: 25%;
      .card-header,
      .card-footer {
        border: none;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .card-header {
        position: relative;
        .ticket-counter {
          position: absolute;
          top: 0.7rem;
          right: 1rem;
          font-size: 0.75rem;
          font-weight: normal;
        }
      }
      .card-header-title {
        text-align: center;
        display: block;
      }
      .card-footer {
        padding: 0.5rem 0.5rem 1rem 0.5rem;
        display: block;
        text-align: center;
      }
    }
    .kanji-highlight {
      padding: 0.5rem 1rem;
      border-radius: 12px;
    }
  }
</style>
