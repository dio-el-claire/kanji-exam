<template>
  <b-row>
    <b-col v-for="q in questions" :key="q.name">
      <b-form-group :label="q.label">
        <b-form-checkbox
          v-for="option in q.options"
          v-model="q.selected"
          :key="option.value"
          :value="option.value"
          :state="option.isValid"
          name="on-readings">
            {{option.text}}
        </b-form-checkbox>
      </b-form-group>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: "ticket",
    props: {
      questions: Array
    }
  }
</script>
