<template>
  <b-dropdown class="locale-changer" v-model="$i18n.locale" position="is-bottom-left">
    <button class="button" type="button" slot="trigger" slot-scope="{ active }">
      <span>{{ $t(`message.langs.${$i18n.locale}`) }}</span>
      <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
    </button>
    <b-dropdown-item v-for="(lang, i) in langs" :key="`lang${i}`" :value="lang">
      {{ $t(`message.langs.${lang}`) }}
    </b-dropdown-item>
  </b-dropdown>
</template>
<script>
export default {
  name: 'LocaleChanger',
  created() {
    console.log(this.$i18n)
  },
  computed: {
    langs() {
      return Object.keys(this.$i18n.messages)
    }
  }
}
</script>
<style media="screen">
  .locale-changer.dropdown {
    position: absolute;
    top: 0.3rem;
    right: 1rem;
    z-index: 100;
  }
</style>
