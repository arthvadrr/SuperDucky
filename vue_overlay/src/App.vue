<script setup lang="ts">
import OverlayHeader from './components/OverlayHeader.vue'
import OverlayFooter from './components/OverlayFooter.vue'
import OverlaySidebar from './components/OverlaySidebar.vue'
import './controllers/MessageController'
import './controllers/SpriteController'
import './controllers/ExcerptController.ts'
import { FONT_SIZE } from '@/util/constants.ts';
</script>

<template>
  <main class="scaffold">
    <div class="grid" :style="{ fontSize: FONT_SIZE }">
      <OverlayHeader />
      <OverlayFooter />
      <OverlaySidebar />
    </div>
  </main>
</template>

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
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'header header sidebar'
      'footer footer sidebar';
  }

  .grid > div:nth-child(1) {
    grid-area: header;

  }

  .grid > div:nth-child(2) {
    position: relative;
    display: grid;
    align-items: end;
    grid-area: footer;
  }

  .grid > div:nth-child(3) {
    grid-area: sidebar;
  }
}
</style>
