<template>
  <b-dropdown class="locale-changer" v-model="locale" position="is-bottom-left">
    <button class="button" type="button" slot="trigger" slot-scope="{ active }">
      <span>{{ $t(`message.langs.${$i18n.locale}`) }}</span>
      <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
    </button>
    <b-dropdown-item v-for="(loc, i) in locales" :key="`lang${i}`" :value="loc">
      {{ $t(`message.langs.${loc}`) }}
    </b-dropdown-item>
  </b-dropdown>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  name: 'LocaleChanger',
  created() {
    const locale = this.$store.state.locale || navigator.language.substr(0, 2)
    if (this.locales.includes(locale)) {
      this.$i18n.locale = locale
    }
  },
  computed: {
    locale: {
      get() { return this.$i18n.locale },
      set(val) {
        this.setLocale(val)
        this.$i18n.locale = val
      }
    },
    locales() {
      return Object.keys(this.$i18n.messages)
    }
  },
  methods: {
    ...mapMutations(['setLocale'])
  }
}
</script>
<style media="screen">
  .locale-changer.dropdown {
    position: absolute;
    top: 0.3rem;
    right: 1rem;
    z-index: 30;
  }
</style>
