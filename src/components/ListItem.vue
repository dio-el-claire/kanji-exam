<template>
<div class="kanji-list-item">
  <h3>{{kanji.kanji}}</h3>
  {{kanji.loaded}}
  <span>{{kanji.meanings}} {{kanji.grade}}</span>
</div>
</template>

<script>
export default {
  props: ['kanji'],
  created() {
    console.log('->', this.kanji.kanji, this.kanji.loaded)
  },
  watch: {
    'kanji.loaded'() {
      console.log(this.kanji.kanji, this.kanji.loaded)
    }
  }
}
</script>

<style media="screen">
  .kanji-list-item {
    display: inline-block;
    padding: 12px;
    margin: 2px;
    border: 1px solid #aaa;
    border-radius: 4px;
    max-width: 200px;
    width: 200px;
    min-height: 100px;
  }
</style>
