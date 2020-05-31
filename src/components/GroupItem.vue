<template>
<div class="kanji-list-item">
  <h3 class="kanji">{{kanji.kanji}}</h3>
  <div v-if="kanji.loaded">{{kanji.meanings[0]}}</div>
  <div v-else>
    <b-spinner small label="Loading..."></b-spinner>
  </div>
</div>
</template>

<script>
export default {
  props: ['kanji'],
}
</script>

<style media="screen">
  .kanji-list-item {
    display: inline-block;
    padding: 12px;
    margin: 2px;
    border: 1px solid #aaa;
    border-radius: 4px;
    max-width: 160px;
    width: 160px;
    min-height: 100px;
    text-align: center;
  }

  .kanji-list-item .kanji {
    font-weight: bold;
    font-size: 2em;
  }
</style>
