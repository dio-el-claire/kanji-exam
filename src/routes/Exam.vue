<template>
  <b-container id="exam-select">
    <b-row style="margin-top: 1.2em">
      <b-col><h4>Exam {{group.name}}</h4></b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col><h1 style="text-align:center;" v-if="exam.ready">{{ticket.kanji.kanji}}</h1></b-col>
    </b-row>
    <hr>
    <b-row v-if="exam.ready">
      <b-col>
        <b-form-group label="On readings:">
          <b-form-checkbox
            v-for="option in ticket.onReadings.options"
            v-model="ticket.onReadings.selected"
            :key="option.value"
            :value="option.value"
            :state="option.isValid"
            name="on-readings">
              {{option.text}}
          </b-form-checkbox>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Kun readings:">
          <b-form-checkbox
            v-for="option in ticket.kunReadings.options"
            v-model="ticket.kunReadings.selected"
            :key="option.value"
            :value="option.value"
            :state="option.isValid"
            name="kun-readings">
              {{option.text}}
          </b-form-checkbox>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Meanings:">
          <b-form-checkbox
            v-for="option in ticket.meanings.options"
            v-model="ticket.meanings.selected"
            :key="option.value"
            :value="option.value"
            :state="option.isValid"
            name="meanings">
              {{option.text}}
          </b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>
    <hr>
    <b-row v-if="exam.ready">
      <b-col>
        <b-form-group class="float-right" style="margin-top: 0.5em">
          <b-button v-if="ticket.complete" variant="success"  @click="exam.next()">Next</b-button>
          <b-button v-else-if="!exam.complete" variant="success"  @click="exam.completeTicket()">Done</b-button>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import kanjiCollection from '../models/KanjiCollection';
  import KanjiExam from '../models/KanjiExam';

  export default {
    data() {
      return {
        // exam: null,
        // group: null
      }
    },
    created() {
      // this.group = kanjiCollection.groups[this.$route.params.groupId];
      // console.log(this.group)
      // this.exam = new KanjiExam(this.group);
    },
    computed: {
      group() {
        const groupId = this.$route.params.groupId;
        return kanjiCollection.groups.find(group => group.label === groupId);
      },
      exam() {
        console.log(this.group)
        return this.group.loaded ? new KanjiExam(this.group) : null;
      },
      ticket() {
        console.log(this.exam.ticket)
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
        console.log('completeTicket')
        this.exam.completeTicket()
      }
    }
  }
</script>
