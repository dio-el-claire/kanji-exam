<template>
<div class="kanji-list-item">
  <h3>{{kanji.kanji}}</h3>
  <span v-for="(word, i) in kanji.meanings" :key="i">{{word}} </span>
</div>
</template>

<script>
export default {
  props: ['kanji']
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
