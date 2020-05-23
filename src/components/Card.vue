<template>
  <div id="kanji-card">
    <b-container>
      <b-container>
        <b-row>
          <b-col md="2" class="kanji-card_prev" @click="$emit('goPrev')">
            <b-icon-chevron-double-left></b-icon-chevron-double-left> prev kanji
          </b-col>
          <b-col md="2">
            <h1 class="kanji">{{kanji.kanji}}</h1>
            <h2 v-if="kanji.loaded">{{kanji.meanings[0]}}</h2>
          </b-col>
          <b-col md="6" class="kanji-card_content">
            <div v-if="kanji.loaded">
              <p>on_readings: {{kanji.on_readings.join(", ")}}</p>
              <p>kun_readings: {{kanji.kun_readings.join(", ")}}</p>
              <p>meanings: {{kanji.meanings.join(", ")}}</p>
              <p v-if="kanji.name_readings.length">name_readings: {{kanji.name_readings.join(", ")}}</p>
              <p v-if="kanji.jlpt">JLPT: {{kanji.jlpt}}</p>
              <p v-if="kanji.grade">Grade: {{kanji.grade}}</p>
              <p>stroke_count: {{kanji.stroke_count}}</p>
            </div>
            <div v-else-if="kanji.loading">
              Loading...
            </div>
          </b-col>
          <b-col md="2" class="kanji-card_next" @click="$emit('goNext')">
            next kanji <b-icon-chevron-double-right></b-icon-chevron-double-right>
          </b-col>
        </b-row>
      </b-container>
    </b-container>

  </div>
</template>

<script>
  export default {
    props: {
      kanji: Object
    },
    created() {
      console.log(this.kanji)
    },

  }
</script>

<style media="screen">
  #kanji-card {
    /* position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0; */
    /* border: 1px solid red; */
  }
  .kanji-card_content {
    text-align: left;
  }
  .kanji-card_next, .kanji-card_prev {
    cursor: pointer;
  }
  .kanji {
    font-size: 5.2em;
    font-family: "Hiragino Mincho", "MS Mincho", "Yu Mincho", "Hiragino Sans", "Hiragino Kaku Gothic Pro", "Yu Gothic", "MS Gothic",  "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  }
</style>
