<template>
<div class="kanji-list-item" @click="onclick">
  <h3 class="kanji">{{kanji.kanji}}</h3>
  <div v-if="kanji.loaded">
    {{kanji.meanings[0]}}
    <b-form-checkbox v-if="allowSelect" ref="checkbox"
      v-model="checked"
      :value="kanji.kanji"
      @change="onChange" />
    <span ref="trash">
      <b-icon-trash v-if="allowDelete" @click.stop="deleteKanji(kanji)" />
    </span>

  </div>
  <div v-else>
    <b-spinner small label="Loading..."></b-spinner>
  </div>
</div>
</template>

<script>
export default {
  props: {
    kanji: Object,
    selectedKanji: Array,
    allowSelect: Boolean,
    allowDelete: Boolean,
    selectKanji: Function,
    unselectKanji: Function,
    deleteKanji: Function
  },
  data() {
    return {
      checked: []
    }
  },
  created() {
    this.checkSelected();
  },
  methods: {
    onChange(value) {
      console.log(this.checked)
      if (value) {
        this.selectKanji(this.kanji);
      } else {
        this.unselectKanji(this.kanji);
      }
    },
    onclick(e) {
      if (e.target.parentNode === this.$refs.checkbox.$el) {
        e.stopPropagation();
      }
    },
    checkSelected() {
      if (this.selectedKanji.find(k => k.kanji === this.kanji.kanji)) {
        this.checked.push(this.kanji.kanji);
      } else {
        this.checked.pop();
      }
    }
  },
  watch: {
    selectedKanji() {
      this.checkSelected();
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
