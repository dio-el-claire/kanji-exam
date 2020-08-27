<template>
  <div class="column kanji-exam-checkboxes-group">
    <label class="label">{{ $t(`message.${label}`) }}</label>
    <div v-for="(item, i) in items" :key="`${type}${i}`">
      <b-checkbox
        v-model="model"
        :native-value="item.value"
        @input="$emit('update', type, model)"
        :type="item.isValid === true ? 'is-success' : item.isValid === false ? 'is-danger' : ''"
        @click.native="onClick">
        <span :class="item.isValid === true ? 'has-text-success' : item.isValid === false ? 'has-text-danger' : ''">
          {{item.value}}
        </span>
      </b-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ExamCheckboxesGroup',
  props: {
    type: { type: String, require: true },
    label: { type: String, require: true },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      model: []
    }
  },
  computed: {
    items() {
      return this.$parent.exam.currentTicket.questions[this.type]
    }
  },
  methods: {
    onClick(e) {
      if (this.disabled) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  },
  watch: {
    items() {
      this.model = []
    }
  }
}
</script>
<style media="screen">
  .check.is-danger {
    border-color: #f14668 !important;
  }
</style>
