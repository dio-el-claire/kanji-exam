<template>
  <div id="app">
    <b-navbar type="is-light" id="nav">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }"><span class="kanji kanji-brand">漢字</span>-Exam</b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/exam' }">{{ $t("message.exam") }}</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/groups' }">{{ $t("message.exploreKanji") }}</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/about' }">{{ $t("message.about") }}</b-navbar-item>
      </template>
    </b-navbar>
    <div id="content">
      <router-view/>
    </div>
    <footer class="footer" id="footer">
      <div class="content has-text-centered">
        <div>
          <router-link to="/">Home</router-link> |
          <router-link to="/groups">Kanji Groups</router-link> |
          <router-link to="/about">About</router-link>
        </div>
      </div>
    </footer>
    <LocaleSelector></LocaleSelector>
  </div>
</template>

<script>
import LocaleSelector from '@/components/LocaleSelector'

export default {
  name: 'App',
  components: { LocaleSelector }
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
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
#navbar {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 50px;
}
#content {
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 70px;
  overflow: auto;
}
#footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 70px;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-top: 2px solid #eee;
}
.kanji-brand {
  font-weight:bold;
  font-size:1.5rem;
}
</style>
