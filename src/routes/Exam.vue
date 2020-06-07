<template>
  <b-container id="exam-select">
    <b-row style="margin-top: 1.2em">
      <b-col v-if="group.name"><h5>Exam group "{{group.name}}"</h5></b-col>
    </b-row>
    <template v-if="ticket && ticket.kanji">
      <b-row>
        <b-col><h1 style="text-align:center;" class="kanji">{{ticket.kanji.kanji}}</h1></b-col>
      </b-row>
      <hr>
      <ticket :questions="ticket.questions" :disabled="ticket.complete" />
      <hr>
      <b-row>
        <b-col>
          <b-form-group class="float-right" style="margin-top: 0.5em">
            <template v-if="ticket.complete">
              <b-button v-if="ticket.isLast" variant="success"  @click="exam.createStat()">Show results</b-button>
              <b-button v-else variant="success"  @click="exam.next()">Next</b-button>
            </template>
            <b-button v-else variant="success"  @click="exam.completeTicket()">Done</b-button>
          </b-form-group>
        </b-col>
      </b-row>
    </template>
    <template v-else-if="exam.complete">
      <exam-stat :stat="exam.stat"/>
    </template>
    <template v-else>
      <b-row>
        <b-col>
          <b-spinner class="kanji-group-spinner" label="Large Spinner"></b-spinner>
        </b-col>
      </b-row>
    </template>
  </b-container>
</template>

<script>
  import kanjiCollection from '../models/KanjiCollection';
  import KanjiExam from '../models/KanjiExam';
  import Ticket from '../components/Ticket';
  import ExamStat from '../components/ExamStat';
  export default {
    data() {
      return {
        groups: kanjiCollection.groups,
        exam: null,
        // group: null
      }
    },
    async created() {
      this.exam = new KanjiExam(this.$route.params.groupId);
      await this.exam.init();
    },
    computed: {
      group() {
        const groupId = this.$route.params.groupId;
        return this.groups.find(group => group.label === groupId) || {};
      },
      ticket() {
        return this.exam.ticket;
      },
      completeEnabled() {
        return false;
        // return this.exam.ticket.kunReadings.selected.length
        //   && this.exam.ticket.onReadings.selected.length
        //   && this.exam.ticket.meanings.selected.length;
      }
    },
    methods: {
      completeTicket() {
        this.exam.completeTicket()
      }
    },
    components: { Ticket, ExamStat }
  }
</script>
