<template>
<center class="kanji-card-big">
  <div class="card">
    <header class="card-header">
      <p class="card-header-title kanji is-size-1">
        {{kanji.sign}}
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <span class="has-text-grey">Meanings:</span> <span class="has-text-black">{{kanji.meanings.join(', ')}}</span>
      </div>
      <div class="content">
        <span class="has-text-grey">On readings:</span> <span class="has-text-black kanji">{{kanji.onReadings.join(', ')}}</span>
      </div>
      <div class="content">
        <span class="has-text-grey">Kun readings:</span> <span class="has-text-black kanji">{{kanji.kunReadings.join(', ')}}</span>
      </div>
      <div class="content" v-if="kanji.nameReadings.length">
        <span class="has-text-grey">Name readings:</span> <span class="has-text-black">{{kanji.nameReadings.join(', ')}}</span>
      </div>
      <div class="content" v-if="kanji.jlpt">
        <span class="has-text-grey">JLPT level:</span> <span class="has-text-black">{{kanji.jlpt}}</span>
      </div>
      <div class="content">
        <span class="has-text-grey">Stroke count:</span> <span class="has-text-black">{{kanji.strokeCount}}</span>
      </div>
      <div class="content">
        <span class="has-text-grey">Unicode:</span> <span class="has-text-black">{{kanji.unicode}}</span>
      </div>
    </div>
  </div>
</center>
</template>
<script>
import Kanji from '@/models/Kanji'

export default {
  props: {
    kanji: { type: Kanji, require: true }
  }
}
</script>
<style media="screen">
  .kanji-card-big .card {
    max-width: 50%;
    border-radius: 12px;
  }
  .kanji-card-big .card-header {
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  .kanji-card-big .card-header-title {
    text-align: center;
    display: block;
  }

  .kanji-card-big .content {
    text-align: left;
  }
</style>
