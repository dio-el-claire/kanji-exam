<template>
  <b-container id="exam-select">
    <b-row>
      <b-col></b-col>
      <b-col>
        <b-form @submit.prevent="goToExam">
          <b-form-group  label="Select kanji group to start test">
            <b-form-radio size="lg" v-model="selected" v-for="group in groups" :key="group.label" name="group" :value="group.label">
              {{group.name}} ({{group.count}})
            </b-form-radio>
          </b-form-group>
          <b-form-group>
            <b-button type="submit" variant="success" :disabled="!selected">Start exam</b-button>
          </b-form-group>
        </b-form>
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
        groups: kanjiCollection.groups.filter(g => g.label !== 'all'),
        selected: kanjiCollection.groups[0].label
      }
    },
    methods: {
      goToExam() {
        console.log(this.selected)
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
