<script setup lang="ts">

// let { color, username, state, size } = defineProps<{
//   color: string;
//   username: string;
//   state: SpriteStateKey;
//   size: number;
// }>();

const username = 'foo';
const state = 'walk';
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xml:space="preserve" fill-rule="evenodd"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-miterlimit="1.5"
    clip-rule="evenodd"
    viewBox="0 0 23 22"
  >
  <path fill="url(#a)" d="M4 11.52c-.6-.17-1.23-.1-1.67-1.2-.23-.7-.01-1.44.2-1.8.5-.86.93-2.87-.22-4.06C1.6 3.8.85 3.6.37 4.14c-.26.3-.17.84.28 1.23.66.57.76 1.48.43 2.23a5.7 5.7 0 0 0-.57 2.23c-.04 1.22.73 2.17 1.95 2.96 2.03 1.25 4.34-.54 1.55-1.27Z"/>
    <clipPath id="b">
    <path d="M4 11.52c-.6-.17-1.23-.1-1.67-1.2-.23-.7-.01-1.44.2-1.8.5-.86.93-2.87-.22-4.06C1.6 3.8.85 3.6.37 4.14c-.26.3-.17.84.28 1.23.66.57.76 1.48.43 2.23a5.7 5.7 0 0 0-.57 2.23c-.04 1.22.73 2.17 1.95 2.96 2.03 1.25 4.34-.54 1.55-1.27Z"/>
  </clipPath>
    <g clip-path="url(#b)">
    <path fill="#e19950" d="M4 11.52c-.6-.17-1.23-.1-1.67-1.2-.23-.7-.01-1.44.2-1.8.5-.86.93-2.87-.22-4.06C1.6 3.8.85 3.6.37 4.14c-.26.3-.17.84.28 1.23.66.57.76 1.48.43 2.23a5.7 5.7 0 0 0-.57 2.23c-.04 1.22.73 2.17 1.95 2.96 2.03 1.25 4.34-.54 1.55-1.27Z"/>
  </g>
    <path fill="none" stroke="#000" stroke-width=".45" d="M4 11.52c-.6-.17-1.23-.1-1.67-1.2-.23-.7-.01-1.44.2-1.8.5-.86.93-2.87-.22-4.06C1.6 3.8.85 3.6.37 4.14c-.26.3-.17.84.28 1.23.66.57.76 1.48.43 2.23a5.7 5.7 0 0 0-.57 2.23c-.04 1.22.73 2.17 1.95 2.96 2.03 1.25 4.34-.54 1.55-1.27Z"/>
    <path fill="url(#c)" stroke="#000" stroke-width=".45" d="m9.53 20.4-.2-.58.2.58c1.11.04.83-1.28-.17-1.49-.2-.22-.7-.82-.52-1.65.19-.67.77-7.48-3.7-6.65-3.02 1.12-1.85 3.82 1.62 6.06l-.01.77c0 .64.27 1.12.68 1.76.88 1.29 1.19 1.21 2.1 1.2Z"/>
    <path fill="url(#d)" d="M16.52 14.51a6.23 6.23 0 0 0 .55 4.5c.15.24.79.36 1 .8.17.5-.03.86-.8.94l-.2-.66.2.66c-1.05.02-1.25-.1-1.45-.17-.99-.62-1.14-4.13-2.96-5.13-8.16-6.83 5.75-8.02 3.66-.94Z"/>
    <clipPath id="e">
    <path d="M16.52 14.51a6.23 6.23 0 0 0 .55 4.5c.15.24.79.36 1 .8.17.5-.03.86-.8.94l-.2-.66.2.66c-1.05.02-1.25-.1-1.45-.17-.99-.62-1.14-4.13-2.96-5.13-8.16-6.83 5.75-8.02 3.66-.94Z"/>
  </clipPath>
    <g clip-path="url(#e)">
    <path fill="#e19950" d="m17.27 20.75-.2-.66.2.66c.77-.08.97-.44.8-.94-.21-.43-.85-.56-1-.8a6.23 6.23 0 0 1-.55-4.5c2.09-7.08-11.82-5.89-3.66.94 1.82 1 1.97 4.51 2.96 5.13.2.08.4.2 1.46.17Z"/>
  </g>
    <path fill="none" stroke="#000" stroke-width=".45" d="M16.52 14.51a6.23 6.23 0 0 0 .55 4.5c.15.24.79.36 1 .8.17.5-.03.86-.8.94l-.2-.66.2.66c-1.05.02-1.25-.1-1.45-.17-.99-.62-1.14-4.13-2.96-5.13-8.16-6.83 5.75-8.02 3.66-.94Z"/>
    <path fill="url(#f)" stroke="#000" stroke-width=".45" d="M17.28 11.88a4.9 4.9 0 0 1-.9 3.31c-1.1 1.2-2.04 1.77-4.32 1.8-5.6.17-7.62-2.43-7.62-2.43C2.54 13 3.97 9.9 7.5 10.43c2.08.18 1.82.63 4.4-.56 2.87-1.24 5.32.6 5.38 2Z"/>
    <path fill="url(#g)" stroke="#000" stroke-width=".45" d="m7.5 20.77-.2-.58.2.58c1.1.05.82-1.27-.17-1.48a1.9 1.9 0 0 1-.53-1.66c.2-.66 3.94-7.1-.54-7.17-2.9.17-4.85 3.18-1.53 6.59 0 0-.02.25-.02.77 0 .63.28 1.12.68 1.76.88 1.28 1.2 1.21 2.1 1.2Z"/>
    <path fill="none" d="M14.42 14.67a6.23 6.23 0 0 0 .38 4.52c.15.23.78.38.97.83.16.5-.05.85-.82.9l-.18-.65.18.66c-1.06-.01-1.26-.14-1.45-.23-.96-.65-2.11-3.4-2.77-5.22-3.94-7.57 10-8.26 3.69-.81Z"/>
    <clipPath id="h">
    <path d="M14.42 14.67a6.23 6.23 0 0 0 .38 4.52c.15.23.78.38.97.83.16.5-.05.85-.82.9l-.18-.65.18.66c-1.06-.01-1.26-.14-1.45-.23-.96-.65-2.11-3.4-2.77-5.22-3.94-7.57 10-8.26 3.69-.81Z"/>
  </clipPath>
    <g clip-path="url(#h)">
    <path fill="url(#i)" d="m14.95 20.92-.18-.65.18.65c.77-.05.98-.4.82-.9-.19-.44-.82-.6-.97-.83a6.23 6.23 0 0 1-.38-4.52c6.31-7.45-7.63-6.76-3.7.8.67 1.83 1.82 4.58 2.78 5.23.2.1.39.22 1.45.23Z"/>
  </g>
    <path fill="none" stroke="#000" stroke-width=".45" d="M14.42 14.67a6.23 6.23 0 0 0 .38 4.52c.15.23.78.38.97.83.16.5-.05.85-.82.9l-.18-.65.18.66c-1.06-.01-1.26-.14-1.45-.23-.96-.65-2.11-3.4-2.77-5.22-3.94-7.57 10-8.26 3.69-.81Z"/>
    <path fill="#e19950" d="M19.94 4.6c0-.02-.68-.93-.67-.96 0-.04.7.8.7.8A6.75 6.75 0 0 0 19.7.22c-1.15.5-1.93 1.4-2.76 2.49a7.92 7.92 0 0 0-3.46.06C12.27 1.25 11.31.57 10.46.24c-.65.6-1 1.97-.7 5.04-1.83 4.12 1.14 6.53 5.65 6.52 3.26-.07 7.13-2.29 4.53-7.2Z"/>
    <path fill="url(#j)" stroke="#000" stroke-width=".45" d="M19.94 4.6c2.6 4.91-1.27 7.13-4.53 7.2-4.5 0-7.48-2.4-5.64-6.52-.31-3.07.04-4.44.69-5.04.85.33 1.8 1.01 3.02 2.53a7.92 7.92 0 0 1 3.46-.06C17.77 1.62 18.55.73 19.7.23c.62 1.42.24 4.35.24 4.37Z"/>
    <g fill="#fff">
    <ellipse cx="13.85" cy="7.44" rx="1.2" ry=".9"/>
      <ellipse cx="18.17" cy="7.38" rx="1.2" ry=".9"/>
  </g>
    <ellipse cx="19.07" cy="7.41" rx=".29" ry=".52"/>
    <ellipse cx="14.76" cy="7.47" rx=".29" ry=".52"/>
    <path fill="none" stroke="#000" stroke-width=".45" d="M12.35 6.66c.9-.07 1.65-.13 2.47.11m4.78-.26c-1.36-.08-2.17-.04-2.4.33"/>
    <path fill="#d46a6c" stroke="#000" stroke-linecap="butt" stroke-miterlimit="2" stroke-width=".23" d="m17.09 10.2-.6-.48-.84.48.71.53.73-.53Z"/>
    <path d="M17.24 8.4c0-.15-.08-.21-.23-.22l-.92-.01c-.15 0-.22.09-.2.24.01.25.25.4.51.62v.55l-.96.46c-.2.11.04.4.26.29l.84-.35.52.32c.13.08.38-.1.24-.26l-.56-.47v-.51c.31-.23.5-.46.5-.67Z"/>
    <path fill="none" stroke="#000" stroke-width=".4" d="M19.37 9.72c.95 0 1.83.16 2.64.5m-10.56-.53c-1.04.01-2 .17-2.88.5M19.6 8.97a4.08 4.08 0 0 1 2.65.07m-10.68.06a6.54 6.54 0 0 0-3.36.07"/>
    <path d="M19.4 1.08a7.92 7.92 0 0 0-1.97 1.9c.85.18 1.25.39 2 1.25.07-.8.22-2.34-.03-3.15Zm-8.8 0a6 6 0 0 0-.1 3.6 4.2 4.2 0 0 1 2.33-1.54 5 5 0 0 0-2.22-2.06Z"/>
    <defs>
    <linearGradient id="a" x1="0" x2="1" y1="0" y2="0" gradientTransform="matrix(1.4 0 0 -1.4 1.13 8.04)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#efc79f"/>
      <stop offset="1" stop-color="#e19950"/>
    </linearGradient>
      <linearGradient id="c" x1="0" x2="1" y1="0" y2="0" gradientTransform="matrix(5 0 0 -5 3.6 13.08)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#efc79f"/>
        <stop offset="1" stop-color="#e19950"/>
    </linearGradient>
      <linearGradient id="d" x1="0" x2="1" y1="0" y2="0" gradientTransform="matrix(6.2 0 0 -6.2 10.49 12.36)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#efc79f"/>
        <stop offset="1" stop-color="#e19950"/>
    </linearGradient>
      <linearGradient id="f" x1="0" x2="1" y1="0" y2="0" gradientTransform="matrix(13.2 .2 .2 -13.2 3.77 12.6)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#efc79f"/>
        <stop offset="1" stop-color="#e19950"/>
    </linearGradient>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="0" gradientTransform="matrix(4.8 0 0 -4.8 3.29 13.56)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#efc79f"/>
        <stop offset="1" stop-color="#e19950"/>
    </linearGradient>
      <linearGradient id="i" x1="0" x2="1" y1="0" y2="0" gradientTransform="matrix(5.3 0 0 -5.3 10.49 12.12)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#efc79f"/>
        <stop offset="1" stop-color="#e19950"/>
    </linearGradient>
      <linearGradient id="j" x1="0" x2="1" y1="0" y2="0" gradientTransform="matrix(11 .2 .2 -11 9.53 6.84)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#efc79f"/>
        <stop offset="1" stop-color="#e19950"/>
    </linearGradient>
  </defs>
</svg>

</template>

<style scoped lang="scss">
svg {
  overflow: visible;
}

svg * {
  will-change: transform;
}

.CatSVG {
  position: relative;
}

.mouth {
  &.talk {
    animation: talk 500ms linear infinite;
  }
}

.tail {
  animation: tail 30s linear infinite;
  animation-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);
  transform-origin: 20% 100%;
}

.walk {
  animation-timing-function: linear;

  &.front {
    animation: walk-front 1s linear infinite;
    transform-origin: 65% 50%;
  }

  &.hind {
    animation: walk-hind 1s linear infinite;
    transform-origin: 30% 60%;
  }
}

@keyframes walk-front {
  0%,
  100% {
    transform: rotate(0deg);
  }
  33% {
    transform: rotate(12deg);
  }
  75% {
    transform: rotate(-2deg);
  }
}

@keyframes walk-hind {
  0%,
  100% {
    transform: rotate(0deg);
  }
  33% {
    transform: rotate(12deg);
  }
  75% {
    transform: rotate(0deg);
  }
}

@keyframes tail {
  0%,
  100% {
    transform: skewX(0deg) rotate(0deg);
  }
  10% {
    transform: skewX(8deg) rotate(10deg);
  }
  25% {
    transform: skewX(-8deg) rotate(-6deg);
  }
  40% {
    transform: skewX(6deg) rotate(8deg);
  }
  55% {
    transform: skewX(-6deg) rotate(-5deg);
  }
  70% {
    transform: skewX(7deg) rotate(5deg);
  }
  85% {
    transform: skewX(-5deg) rotate(-7deg);
  }
}

@keyframes talk {
  0%,
  49.9999%,
  65% {
    visibility: visible;
  }
  50%,
  64.9999%,
  100% {
    visibility: hidden;
  }
}
</style>
