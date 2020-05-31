<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="/">Kanji Test</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-navbar-nav>
        <b-nav-item :to="'/exam-select'">Start Your Exam</b-nav-item>
        <b-nav-item :to="'/groups'">Kanji Groups</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <div class="app-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
@font-face {
    font-family: 'sawarabi_minchoregular', sans-serif;
    src: url('./assets/fonts/sawarabimincho-regular-webfont.woff2') format('woff2'),
         url('./assets/fonts/sawarabimincho-regular-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.kanji {
  font-family: 'sawarabi_minchoregular';
}
#app {
  font-family: 'sawarabi_minchoregular', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.app-container {
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}
</style>
