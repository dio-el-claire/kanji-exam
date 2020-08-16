<template>
  <div>
    Kanji groups {{kanjiGroups.loading}}
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'KanjiGroup',
  computed: {
    ...mapState(['kanjiGroups'])
  }
}
</script>

<style media="screen">

</style>
