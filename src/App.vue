<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
};
</script>

<style>

* {
  scroll-behavior: smooth;
}
html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
}
#app {
  font-family: 'Poppins', sans-serif;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>
