<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12 kanji-group-content">
      <article v-for="kanji in kanjies" :key="kanji.sign"  class="tile is-child kanji-box">
        <div class="kanji-card-small" @click="showKanji(kanji)">
          <p class="title kanji">{{kanji.sign}}</p>
          <div v-if="kanji.isLoaded">
            {{kanji.meanings[0]}}
          </div>
          <div v-else>
            Loading...
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    kanjies: { type: Array, require: true },
    showKanji: { type: Function, require: true }
  }
}
</script>
<style media="screen">
.kanji-group-content {
  flex-wrap: wrap;
}
.kanji-box {
  min-width: 190px;
  /* max-width: 190px; */
  padding: 1rem;
  text-align: center;
}

.kanji-card-small {
  padding: 1rem;
  border: 2px solid rgba(10, 10, 10, .2);
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
}
</style>
