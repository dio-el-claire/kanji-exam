<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="/">Kanji Test</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-navbar-nav>
        <b-nav-item :to="'/exam'">Test</b-nav-item>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
