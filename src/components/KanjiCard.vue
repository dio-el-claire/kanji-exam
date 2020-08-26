<template>
<center class="kanji-card-big">
  <div class="card">
    <header class="card-header">
      <p class="card-header-title kanji is-size-1">
        {{kanji.sign}}
        <button type="button" class="delete is-large" @click="close"></button>
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <span class="has-text-grey">{{ $t("message.meanings") }}:</span> <span class="has-text-black">{{kanji.meanings.join(', ')}}</span>
      </div>
      <div class="content">
        <span class="has-text-grey">{{ $t("message.onReading") }}:</span> <span class="has-text-black kanji">{{kanji.onReadings.join(', ')}}</span>
      </div>
      <div class="content">
        <span class="has-text-grey">{{ $t("message.kunReadings") }}:</span> <span class="has-text-black kanji">{{kanji.kunReadings.join(', ')}}</span>
      </div>
      <div class="content" v-if="kanji.nameReadings.length">
        <span class="has-text-grey">{{ $t("message.nameReadings") }}:</span> <span class="has-text-black">{{kanji.nameReadings.join(', ')}}</span>
      </div>
      <div class="content" v-if="kanji.jlpt">
        <span class="has-text-grey">{{ $t("message.JLPTLevel") }}:</span> <span class="has-text-black">{{kanji.jlpt}}</span>
      </div>
      <div class="content">
        <span class="has-text-grey">{{ $t("message.strokeCount") }}:</span> <span class="has-text-black">{{kanji.strokeCount}}</span>
      </div>
      <div class="content">
        <span class="has-text-grey">{{ $t("message.unicode") }}:</span> <span class="has-text-black">{{kanji.unicode}}</span>
      </div>
      <div class="content">
        <a href="#" @click.prevent="toggleWords">
          <span>{{ $t(showWords ? 'message.hideWords' : 'message.showWords') }}</span>
          <span v-if="kanji.words.length">({{kanji.words.length}})</span>
          <b-icon :icon="showWords ? 'menu-down' : 'menu-right'" style="mrgin-top:3px"></b-icon>
        </a>
      </div>
      <div class="content" v-if="showWords">
        <div v-if="kanji.words.loading">
          Loading...
        </div>
        <div v-else class="kanji-words-container">
          <div v-for="(word, i) in kanji.words" :key="`Word${i}`" class="kanji-word is-clearfix">
            <div class="kanji-word-meanings is-pulled-right">
              <div v-for="(mean, j) in word.meanings" :key="`Word${i}_${j}`">
                <span v-if="word.meanings.length > 1">{{j+1}}.</span> {{mean}}
              </div>
            </div>
            <div class="kanji-word-written kanji">{{word.written}}</div>
            <div class="kanji-word-pronounced kanji">{{word.pronounced}}</div>
          </div>
        </div>
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
  },
  data() {
    return {
      showWords: false
    }
  },
  methods: {
    toggleWords() {
      this.showWords = !this.showWords
      if (this.showWords && !this.kanji.words.length) {
        this.kanji.loadWords()
      }
    },
    close() {
      this.$parent.closeKanjiCard()
    }
  },
  watch: {
    kanji() {
      this.showWords = false
    }
  }
}
</script>
<style media="screen">
  .kanji-card-big .card {
    max-width: 50%;
    border-radius: 12px;
    background-color: rgba(0, 0, 0, 0.008);
  }
  .kanji-card-big .card-header {
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  .kanji-card-big .card-header-title {
    text-align: center;
    display: block;
    position: relative;
  }

  .kanji-card-big .delete {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }

  .kanji-card-big .content {
    text-align: left;
  }

  .kanji-words-container {
    max-height: 500;
    height: 500px;
    overflow: auto;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 0.5rem 0;
  }

  .kanji-word {
    padding: 0.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .kanji-word-written {
    font-weight: bold;
  }
  .kanji-word-meanings {
    width: 50%;
  }
</style>
