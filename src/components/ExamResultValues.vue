<template>
  <div class="column">
    <div v-for="item in results" :key="`er${item.value}`" :class="item.className">
      {{item.value}}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    questions: { type: Array, require: true }
  },
  computed: {
    results() {
      return this.questions
        .filter(q => q.isValid != null)
        .sort((q1, q2) => {
          if ((q1.isValid && !q2.isValid) || (!q1.isValid && q2.isValid)) {
            return q1.isValid ? -1 : 1
          }
          return q1.value.localeCompare(q2.value)
        })
        .map(q => ({
          value: q.value,
          className: q.isValid ? 'has-text-success' : 'has-text-danger'
        }))
    }
  }
}
</script>
