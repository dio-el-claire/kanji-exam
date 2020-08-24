<template>
  <div  id="app">
    <b-navbar type="is-light">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">Kanji-Exam</b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/groups' }">{{ $t("message.exploreKanji") }}</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/about' }">{{ $t("message.about") }}</b-navbar-item>
      </template>
    </b-navbar>

    <router-view/>

    <footer class="footer">
      <div class="content has-text-centered">
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/groups">Kanji Groups</router-link> |
          <router-link to="/about">About</router-link>
        </div>
      </div>
    </footer>
    <LocaleChanger></LocaleChanger>
  </div>
</template>

<script>
import LocaleChanger from '@/components/LocaleChanger'

export default {
  name: 'App',
  components: { LocaleChanger }
}
</script>

<style lang="scss">
.kanji {
  font-family: 'Sawarabi Mincho';
  font-weight: normal;
  font-style: normal;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }

}
</style>
