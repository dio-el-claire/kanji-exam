<template>
  <b-container id="exam-select">
    <b-row>
      <b-col></b-col>
      <b-col>
        <b-form v-if="groups.length" @submit.prevent="goToExam">
          <b-form-group  label="Select kanji group to start test">
            <b-form-radio size="lg" v-model="selected" v-for="group in groups" :key="group.label" name="group" :value="group.label">
              {{group.name}} ({{group.count}})
            </b-form-radio>
          </b-form-group>
          <b-form-group>
            <b-button type="submit" variant="success" :disabled="!selected">Start exam</b-button>
          </b-form-group>
        </b-form>
        <div v-else>
          <b-spinner class="kanji-group-spinner" label="Large Spinner"></b-spinner>
        </div>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
  import kanjiCollection from '../models/KanjiCollection';

  export default {
    data() {
      return {
        groups: [],
        selected: ''
      }
    },
    async created() {
      await kanjiCollection.init();
      this.groups = kanjiCollection.groups.filter(g => g.label !== 'all');
      this.selected = this.groups[0].label;
    },
    methods: {
      goToExam() {
        this.$router.push({ name: 'exam', params: { groupId: this.selected } });
      }
    }
  }
</script>

<style media="screen">
  #exam-select .form-group {
    margin-top: 2em;
  }
</style>
