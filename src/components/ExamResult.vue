<template>
  <div>
    <b-notification :closable="false" :type="notyficationType">
      {{ $t('message.examResult') }}: {{successPercent}}% ({{successCount}} {{ $t('message.of') }} {{tickets.length}})
    </b-notification>
    <div class="tile is-ancestor kanji-exam-result">
      <div class="tile is-parent is-12 kanji-group-content">
        <article v-for="(ticket, i) in tickets" :key="`ticket${i}`" class="tile is-child kanji-box">
          <div class="kanji-card-small">
            <p class="title kanji" style="color: #fff">
              <span :class="`${highlightClass(ticket)} kanji-highlight`">
                {{ticket.kanji.sign}}
              </span>
            </p>
            <div class="columns">
              <ExamResultValues :questions="ticket.questions.ons"></ExamResultValues>
              <ExamResultValues :questions="ticket.questions.kuns"></ExamResultValues>
              <ExamResultValues :questions="ticket.questions.meanings"></ExamResultValues>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
<script>
import ExamResultValues from '@/components/ExamResultValues'
export default {
  props: {
    tickets: { type: Array, require: true }
  },
  methods: {
    highlightClass(ticket) {
      return ticket.isValid ? 'has-background-success' : 'has-background-danger'
    }
  },
  computed: {
    successPercent() {
      return parseInt(this.successCount * 100 / this.tickets.length)
    },
    successCount() {
      return this.tickets.filter(t => t.isValid).length
    },
    notyficationType() {
      const prc = this.successPercent
      let type = 'is-danger'
      if (prc >= 25) {
        type = 'is-warning'
      } else if (prc >= 50) {
        type = 'is-info'
      } else if (prc > 75) {
        type = 'is-success'
      }
      return type
    }
  },
  components: { ExamResultValues }
}
</script>
<style scoped>
.kanji-group-content {
  flex-wrap: wrap;
}
.kanji-box {
  min-width: 25%;
  max-width: 100%;
  padding: 1rem;
  text-align: center;
}
.kanji-card-small {
  padding: 1rem;
  border: 2px solid rgba(10, 10, 10, .2);
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  height: 100%;
}
.kanji-highlight {
  padding: 0.5rem 1rem;
  border-radius: 12px;
}
</style>
