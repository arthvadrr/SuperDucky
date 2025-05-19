<script setup lang="ts">
import { defineProps } from 'vue';
import type { SpriteStateKey } from '@/stores/sprites';
import type { walk } from 'vue/compiler-sfc';
import type { hideLinkEmbed } from 'discord.js';

// let { color, username, state, size } = defineProps<{
//   color: string;
//   username: string;
//   state: SpriteStateKey;
//   size: number;
// }>();

const username = 'foo';
const color = '#ff0000';
const state: 'walk' | 'talk' | 'idle' = 'walk';
</script>

<template>
  <svg
    :id="username"
    class="CatSVG"
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    xml:space="preserve"
    fill-rule="evenodd"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-miterlimit="2"
    viewBox="0 0 22.5 19.1"
  >
    <path
      data-section="Hind-Right-Leg"
      stroke="#000"
      stroke-width=".4"
      d="m9.53 20.4-.2-.58.2.58c1.11.04.83-1.28-.17-1.49-.2-.22-.7-.82-.52-1.65.19-.67.77-7.48-3.7-6.65-3.02 1.12-1.85 3.82 1.62 6.06l-.01.77c0 .64.27 1.12.68 1.76.88 1.29 1.19 1.21 2.1 1.2Z"
      :fill="`url(#_cat_linear_gradient_${username})`"
      :class="{
        hind: true,
        walk: state === 'walk',
      }"
      style="animation-delay: 0.5s"
    />
    <path
      data-section="Front-Right-Leg"
      :fill="`url(#_cat_linear_gradient_${username})`"
      stroke="#000"
      stroke-width=".4"
      d="m17.27 20.75-.2-.66.2.66c.77-.08.97-.44.8-.94-.21-.43-.85-.56-1-.8a6.23 6.23 0 0 1-.55-4.5c2.09-7.08-11.82-5.89-3.66.94 1.82 1 1.97 4.51 2.96 5.13.2.08.4.2 1.46.17Z"
      :class="{
        front: true,
        walk: state === 'walk',
      }"
    />
    <path
      data-section="Cat-Body"
      :fill="`url(#_cat_linear_gradient_${username})`"
      stroke="#000"
      stroke-width=".4"
      d="M17.28 11.88a4.9 4.9 0 0 1-.9 2.91c-1.1 1-2.04 1.43-4.32 1.46-5.6.1-7.62-2.03-7.62-2.03C2.54 12.6 3.97 9.9 7.5 10.43c2.08.18 1.82.63 4.4-.56 2.87-1.24 5.32.6 5.38 2Z"
    />
    <path
      data-section="Tail"
      :fill="`url(#_cat_linear_gradient_${username})`"
      stroke="#000"
      stroke-width="0.4"
      d="M4 11.52c-.6-.17-1.23-.1-1.67-1.2-.23-.7-.01-1.44.2-1.8.5-.86.93-2.87-.22-4.06C1.6 3.8.85 3.6.37 4.14c-.26.3-.17.84.28 1.23.66.57.76 1.48.43 2.23a5.7 5.7 0 0 0-.57 2.23c-.04 1.22.73 2.17 1.95 2.96 2.03 1.25 4.34-.54 1.55-1.27Z"
      :class="{ tail: true }"
    />
    <path
      data-section="Cat-Body"
      :fill="`url(#_cat_linear_gradient_${username})`"
      stroke="#000"
      stroke-width=".4"
      d="M17.28 11.88a4.9 4.9 0 0 1-.9 2.91c-1.1 1-2.04 1.43-4.32 1.46-5.6.1-7.62-2.03-7.62-2.03C2.54 12.6 3.97 9.9 7.5 10.43c2.08.18 1.82.63 4.4-.56 2.87-1.24 5.32.6 5.38 2Z"
    />
    <path
      data-section="Hind-Left-Leg"
      :fill="`url(#_cat_linear_gradient_${username})`"
      stroke="#000"
      stroke-width=".4"
      d="m7.5 20.77-.2-.58.2.58c1.1.05.82-1.27-.17-1.48a1.9 1.9 0 0 1-.53-1.66c.2-.66 3.94-7.1-.54-7.17-2.9.17-4.85 3.18-1.53 6.59 0 0-.02.25-.02.77 0 .63.28 1.12.68 1.76.88 1.28 1.2 1.21 2.1 1.2Z"
      :class="{
        hind: true,
        walk: state === 'walk',
      }"
    />
    <path
      data-section="Front-Left-Leg"
      :fill="`url(#_cat_linear_gradient_${username})`"
      stroke="#000"
      stroke-width=".4"
      d="M14.42 14.67a6.23 6.23 0 0 0 .38 4.52c.15.23.78.38.97.83.16.5-.05.85-.82.9l-.18-.65.18.66c-1.06-.01-1.26-.14-1.45-.23-.96-.65-2.11-3.4-2.77-5.22-3.94-7.57 10-8.26 3.69-.81Z"
      :class="{
        front: true,
        walk: state === 'walk',
      }"
      style="animation-delay: 0.4s"
    />
    <g id="Head">
      <path
        d="M19.941,4.283c0.269,0.475 0.155,1.258 0.607,1.317c0.92,0.119 0.077,0.236 0.107,0.35c0.058,0.218 -0.093,0.588 0.117,0.623c0.845,0.14 0.02,0.245 0.02,0.362c-0.004,1.418 -0.98,2.297 -2.289,2.925c-0.938,0.45 -2.046,1.099 -3.091,1.122c-1.266,0.001 -1.966,-0.873 -2.917,-1.211c-1.681,-0.598 -2.969,-1.37 -3.174,-2.695c-0.021,-0.132 -0.813,-0.086 -0.029,-0.414c0.163,-0.068 0.02,-0.339 0.053,-0.521c0.023,-0.123 -0.73,-0.202 0.092,-0.383c0.287,-0.063 0.186,-0.545 0.329,-0.844c-0.306,-2.847 0.043,-4.125 0.69,-4.686c0.853,0.311 1.813,0.944 3.027,2.352c1.239,-0.257 2.388,-0.272 3.453,-0.054c0.839,-1.01 1.617,-1.844 2.768,-2.309c0.614,1.324 0.241,4.05 0.237,4.066Z"
        style="stroke: #000; stroke-width: 0.43px"
        :fill="`url(#_cat_linear_gradient_${username})`"
      />
      <g id="Mouth">
        <path
          id="Mouth-Open"
          serif:id="Mouth Open"
          d="M15.928,9.09l-0.6,-0.48l-0.84,0.48l0.719,0.537l0.721,-0.537Z"
          style="
            fill: #d46a6c;
            display: none;
            stroke: #000;
            stroke-width: 0.23px;
            stroke-linecap: butt;
            stroke-miterlimit: 2;
          "
        />
        <path
          d="M16.089,7.29c0.002,-0.145 -0.081,-0.209 -0.231,-0.211l-0.913,-0.016c-0.156,0.007 -0.222,0.091 -0.211,0.241c0.017,0.25 0.26,0.4 0.52,0.623l-0.009,0.548l-0.952,0.456c-0.195,0.114 0.036,0.398 0.261,0.294l0.832,-0.345l0.528,0.32c0.128,0.072 0.38,-0.105 0.24,-0.264l-0.561,-0.466l0.002,-0.516c0.31,-0.232 0.502,-0.455 0.494,-0.664Z"
        />
      </g>
      <g id="Whiskers">
        <path
          d="M19.046,8.359c0.952,0.012 1.839,0.168 2.64,0.508"
          style="fill: none; stroke: #000; stroke-width: 0.4px"
        />
        <path
          d="M11.126,8.33c-1.039,0.013 -2.005,0.168 -2.88,0.509"
          style="fill: none; stroke: #000; stroke-width: 0.4px"
        />
        <path
          d="M19.286,7.61c1.202,-0.241 1.389,-0.275 2.64,0.071"
          style="fill: none; stroke: #000; stroke-width: 0.4px"
        />
        <path
          d="M11.246,7.738c-1.529,-0.242 -1.767,-0.275 -3.36,0.07"
          style="fill: none; stroke: #000; stroke-width: 0.4px"
        />
      </g>
      <g id="Ears">
        <path
          d="M19.397,1.016c-0.652,0.355 -1.577,1.223 -1.97,1.754c0.856,0.172 1.251,0.369 2.002,1.171c0.076,-0.745 0.217,-2.173 -0.032,-2.925Z"
        />
        <path
          d="M10.606,1.009c-0.422,1.337 -0.425,2.399 -0.103,3.347c0.701,-0.805 1.461,-1.228 2.332,-1.429c-0.496,-0.827 -1.188,-1.416 -2.229,-1.918Z"
        />
      </g>
      <g id="Eyes">
        <g>
          <path
            d="M11.465,6.207c-0.315,-0.923 0.228,-2.157 1.257,-2.333c1.123,-0.192 1.879,0.48 2.116,1.202c0.431,1.308 -1.257,2.803 -3.373,1.131Z"
            style="
              fill: #fff;
              stroke: #000;
              stroke-width: 0.1px;
              stroke-linecap: butt;
              stroke-miterlimit: 2;
            "
          />
          <ellipse
            cx="13.247"
            cy="5.332"
            rx="1.411"
            ry="1.354"
          />
        </g>
        <g>
          <path
            d="M19.312,6.207c0.316,-0.923 -0.227,-2.157 -1.257,-2.333c-1.122,-0.192 -1.878,0.48 -2.116,1.202c-0.43,1.308 1.258,2.803 3.373,1.131Z"
            style="
              fill: #fff;
              stroke: #000;
              stroke-width: 0.1px;
              stroke-linecap: butt;
              stroke-miterlimit: 2;
            "
          />
          <ellipse
            cx="17.53"
            cy="5.332"
            rx="1.411"
            ry="1.354"
          />
        </g>
      </g>
      <g id="Pupils">
        <ellipse
          cx="13.79"
          cy="4.897"
          rx="0.542"
          ry="0.708"
          style="fill: #fff"
        />
        <ellipse
          cx="18.073"
          cy="4.897"
          rx="0.542"
          ry="0.708"
          style="fill: #fff"
        />
      </g>
    </g>
    <defs>
      <linearGradient
        :id="`_cat_linear_gradient_${username}`"
        gradientUnits="objectBoundingBox"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        <stop
          offset="0%"
          :stop-color="color"
          stop-opacity="1"
        />
        <stop
          offset="100%"
          stop-color="#ccc"
          stop-opacity="1"
        />
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
