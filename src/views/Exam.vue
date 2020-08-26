<template>
  <div class="container kanji-exam">
    exam
  </div>
</template>
<script>
import Exam from '@/models/Exam'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      exam: null
    }
  },
  async created() {
    await this.LOAD_EXAM_CONFIG()
    this.createExam()
  },
  computed: {
    ...mapState(['examConfig'])
  },
  methods: {
    ...mapActions(['LOAD_EXAM_CONFIG']),
    createExam() {
      if (this.examConfig && !this.exam) {
        if (this.$route.params.id !== this.examConfig.id) {
          return alert('Invalid exam id')
        }
        this.exam = new Exam(this.examConfig)
      }
    }
  }
}
</script>
