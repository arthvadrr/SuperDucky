<template>
  <main class="scaffold">
    <div class="grid">
      {{ JSON.stringify(state.messages) }}
      <Header />
      <Footer />
      <Sidebar />
    </div>
  </main>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Sidebar from './components/Sidebar.vue'
import state from '../src/stores/state'
import './controllers/MessageController'

console.log(state.messages);
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'MonaspaceKrypton';
  src: url('src/assets/fonts/MonaspaceKrypton-Regular.ttf') format('truetype');
}

:root {
  font-weight: 400;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'MonaspaceKrypton', serif;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  margin: 0;
  padding: 0;
}

.scaffold {
  height: 100vh;

  .grid {
    height: 100%;
    display: grid;
    grid-template-areas:
      'header header sidebar'
      'body body sidebar';
  }

  .grid > div:nth-child(1) {
    grid-area: header;
  }

  .grid > div:nth-child(2) {
    position: relative;
    grid-area: body;
    display: grid;
    align-items: end;
  }

  .grid > div:nth-child(3) {
    grid-area: sidebar;
  }
}
</style>
