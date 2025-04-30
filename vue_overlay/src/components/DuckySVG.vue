<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { SpriteStateKey } from '@/stores/sprites.ts';
import {
  getEyeBlinkDuration,
  getFootBounceDuration,
  getRandomHeadBobDuration,
  getRandomWingFlapDuration,
} from '@/util/helpers.ts';

const { color, username, state, size } = defineProps<{
  color: string;
  username: string;
  state: SpriteStateKey;
  size: number;
}>();

const isWalking = computed(() => state === 'walk');
const isIdle = computed(() => state === 'idle');
const isTalking = computed(() => state === 'talk');
const footBounceDuration = getFootBounceDuration(size);
const wingFlapDuration = getRandomWingFlapDuration(size);
const headBobDuration = getRandomHeadBobDuration(size);
const eyeBlinkDuration = getEyeBlinkDuration();
</script>

<template>
  <svg
    :id="username"
    width="100%"
    height="100%"
    viewBox="0 0 74 92"
    xmlns="http://www.w3.org/2000/svg"
    fill-rule="evenodd"
    clip-rule="evenodd"
    stroke-linecap="round"
    stroke-miterlimit="2"
  >
    <clipPath id="_clip1">
      <rect
        x="0"
        y="0"
        width="73.5"
        height="91.35"
      />
    </clipPath>
    <g clip-path="url(#_clip1)">
      <g id="Feet">
        <path
          id="Left-Foot"
          :class="{ walkingLeft: isWalking }"
          d="M21.714,89.323c1.8,-0.058 5.507,-0.896 5.454,1.057l3.997,0c0.01,-1.358 3.359,-1.162 6.08,-1.042l0.044,-3.771l-6.277,-0.062l-1.147,-4.959l-5.323,-0.046l-0.102,4.92l-2.729,-0.04l0.003,3.943Z"
          fill="#f58d2a"
          stroke-width="2px"
          stroke="#000"
          :style="{ animationDuration: `${footBounceDuration}s` }"
        />
        <path
          id="Right-Foot"
          :class="{ walkingRight: isWalking }"
          d="M42.214,89.442c1.8,-0.057 5.507,-0.895 5.454,1.058l3.997,-0c0.01,-1.358 3.359,-1.162 6.08,-1.042l0.044,-3.771l-6.277,-0.063l-1.147,-4.958l-5.323,-0.046l-0.102,4.92l-2.729,-0.04l0.003,3.942Z"
          fill="#f58d2a"
          stroke-width="2px"
          stroke="#000"
          :style="{ animationDuration: `${footBounceDuration}s` }"
        />
      </g>
      <g id="Body">
        <path
          id="Right-Wing"
          :class="{ flappingRight: isWalking || isIdle || isTalking }"
          d="M63.693,66.441c-0.077,3.972 -2.205,5.721 -4.553,6.053c-5.093,0.249 -18.614,-7.792 -19.747,-11.944c-1.574,-5.171 1.539,-7.238 10.044,-5.736c3.033,0.499 4.036,2.522 3.937,5.372c-0,0 -0.318,-5.371 3.353,-5.439l5.413,0.247c1.438,0.02 6.133,-0.354 7,2c0.637,4.632 -4.56,3.254 -5.447,9.447Z"
          :fill="`url(#_linear_${username})`"
          stroke-width="2px"
          stroke="#000"
          :style="{ animationDuration: `${wingFlapDuration}s` }"
        />
        <path
          id="Nugget"
          d="M15.267,60.742c-7.05,4.364 -10.845,1.07 -10.267,8.758c0.23,3.162 7.98,8.218 13.138,11.213c4.83,2.577 6.372,1.293 12.381,1.919c4.848,0.355 8.645,0.027 12.481,-0.132c2.358,-0.105 8.208,-0.759 10,-2c4.629,-3.067 7.943,-7.411 8.381,-11.672l0.648,-10.36c0.094,-3.288 -3.691,-8.249 -6.876,-8.781c-9.854,-1.643 -19.701,-4.218 -29.653,-0.717l-10.233,6.772Z"
          :fill="`url(#_linear_${username})`"
          stroke-width="2px"
          stroke="#000"
        />
        <path
          id="Left-Wing"
          :class="{ flappingLeft: isWalking || isIdle || isTalking }"
          d="M25.553,65.946c-0.077,3.973 -2.204,5.721 -4.553,6.054c-5.093,0.249 -18.613,-7.792 -19.747,-11.945c-1.573,-5.17 1.539,-7.238 10.044,-5.735c3.034,0.499 4.036,2.522 3.937,5.372c0,-0 -0.318,-5.371 3.354,-5.44l5.412,0.248c1.438,0.019 6.133,-0.354 7,2c0.637,4.631 -4.559,3.254 -5.447,9.446Z"
          :fill="`url(#_linear_${username})`"
          stroke-width="2px"
          stroke="#000"
          :style="{ animationDuration: `${wingFlapDuration}s` }"
        />
      </g>
      <g
        id="HeadGroup"
        :class="{ bobHead: isWalking }"
        :style="{ animationDuration: `${headBobDuration}s` }"
      >
        <path
          id="Head"
          d="M15.774,45.095c-3.676,5.442 8.352,11.34 24.226,11.375c2.893,0.251 4.226,1.145 5,2.53c2.425,0.3 6.203,0.015 8,-3.03c1.053,-1.392 4.238,-2.102 6.507,-2.381c5.344,-1.234 6.996,-3.34 8.434,-7.883c1.843,-1.286 4.287,-3.507 4.465,-6.713c0.612,-7.689 -4.86,-4.667 -4.969,-11.095l0.005,-5.1c-0.007,-3.7 -8.754,-17.125 -17.004,-17.105c-1.26,-0.023 -2.989,-0.988 -2.938,-2.636c-0.25,-5.213 -2.327,0.519 -3.267,2.513c-0.885,1.513 -2.22,-1.747 -3.733,-4.57c-3.842,-0.189 -2.888,3.349 -3.516,4.961c-2.674,-5.462 -5.247,-4.981 -5.319,-4.961c0.71,4.394 0.343,5.805 -6.165,7.658c-13.863,3.991 -12.338,20.378 -12.338,20.378c0.096,2.298 -1.542,2.681 -3.199,3.789l3.268,2.06c0.038,0.912 -1.684,0.955 -3.168,0.863c-0.05,1.767 0.494,3.132 3.124,3.876l0.001,0.82c-6.709,0.099 -0.889,4.072 2.586,4.651Z"
          :fill="`url(#_linear_${username})`"
          stroke-width="2px"
          stroke="#000"
        />
        <g id="Eyes">
          <path
            id="Right-Eye"
            d="M57.228,24.057l6.33,0.04c-0.101,1.396 0.736,2.188 2.587,2.327l-0.02,9.31c-2.113,-0.091 -2.822,0.611 -2.682,1.793l-5.54,0.068c0.113,-1.758 -0.926,-2.263 -2.603,-2.073l-0.059,-9.219c1.52,0.137 2.201,-0.592 1.987,-2.246Z"
            :class="{ blinkingEye: isWalking || isIdle || isTalking }"
            :style="{ animationDuration: `${eyeBlinkDuration}s` }"
          />
          <clipPath id="_clip7">
            <path
              d="M57.228,24.057l6.33,0.04c-0.101,1.396 0.736,2.188 2.587,2.327l-0.02,9.31c-2.113,-0.091 -2.822,0.611 -2.682,1.793l-5.54,0.068c0.113,-1.758 -0.926,-2.263 -2.603,-2.073l-0.059,-9.219c1.52,0.137 2.201,-0.592 1.987,-2.246Z"
            />
          </clipPath>
          <g clip-path="url(#_clip7)">
            <path
              d="M60.456,26.312l3.02,0.069l0.057,3.241l-3.033,-0.218l-0.044,-3.092Z"
              fill="#fff"
              :class="{ blinkingEye: isWalking || isIdle || isTalking }"
              :style="{ animationDuration: `${eyeBlinkDuration}s` }"
            />
          </g>
          <path
            id="Left-Eye"
            :class="{ blinkingEye: isWalking || isIdle || isTalking }"
            d="M33.14,26.46l8.056,0.05c-0.098,1.897 0.81,2.96 3.023,2.938l0.065,8.918c-2.42,-0.267 -3.395,0.831 -3.084,3.141l-7.83,-0.108c0.244,-2.058 -0.611,-3.146 -2.885,-2.982l0.024,-9.029c1.699,-0.044 2.616,-0.755 2.631,-2.928Z"
            :style="{ animationDuration: `${eyeBlinkDuration}s` }"
          />
          <clipPath id="_clip8">
            <path
              id="Left-Eye1"
              d="M33.14,26.46l8.056,0.05c-0.098,1.897 0.81,2.96 3.023,2.938l0.065,8.918c-2.42,-0.267 -3.395,0.831 -3.084,3.141l-7.83,-0.108c0.244,-2.058 -0.611,-3.146 -2.885,-2.982l0.024,-9.029c1.699,-0.044 2.616,-0.755 2.631,-2.928Z"
            />
          </clipPath>
          <g clip-path="url(#_clip8)">
            <path
              d="M37.946,29.269l3.106,0.065l0.011,3.321l-3.084,-0.119l-0.033,-3.267Z"
              fill="#fff"
              :class="{ blinkingEye: isWalking || isIdle || isTalking }"
              :style="{ animationDuration: `${eyeBlinkDuration}s` }"
            />
          </g>
        </g>
        <g id="Beak">
          <path
            id="Beak-Lower"
            d="M49.616,48.866c-2,-0.63 -3.992,-3.784 -2.585,-5.397c0.275,-1.592 4.995,-2.322 5.215,0.193c-0.198,2.459 3.12,3.028 6.188,1.619c0.02,1.452 -0.724,3.195 -2.271,3.907c-1.979,0.777 -4.3,0.409 -6.547,-0.322Z"
            fill="#df8926"
            stroke="#000"
            stroke-width="2px"
            :class="{ beakTalking: isTalking }"
          />
          <path
            id="Beak-Upper"
            d="M46.333,41.355c1.978,-1 4.339,-1.395 5.187,-3.56c1.852,-3.885 5.934,-1.367 7.034,-0.505c0.935,0.545 5.249,-0.187 7.193,1.17c2.494,2.029 -0.758,2.877 -2.385,3.387c-2.074,0.854 -2.69,3.014 -4.165,3.02l-12.814,-0.061c-3.127,0.072 -1.998,-2.608 -0.05,-3.451Z"
            style="fill: #df8926"
            stroke="#000"
          />
          <g clip-path="url(#_clip10)">
            <path
              d="M53.926,38.297l0.36,0.878l1.151,0.143l-0.343,-0.743l-1.168,-0.278Z"
              stroke-width="1px"
              stroke="#000"
            />
          </g>
          <path
            id="Beak-Upper2"
            d="M46.333,41.355c1.978,-1 4.339,-1.395 5.187,-3.56c1.852,-3.885 5.934,-1.367 7.034,-0.505c0.935,0.545 5.249,-0.187 7.193,1.17c2.494,2.029 -0.758,2.877 -2.385,3.387c-2.074,0.854 -2.69,3.014 -4.165,3.02l-12.814,-0.061c-3.127,0.072 -1.998,-2.608 -0.05,-3.451Z"
            style="fill: none"
            stroke-width="2px"
            stroke="#000"
          />
        </g>
        <g id="Eyebrows">
          <path
            id="Left-Eyebrow"
            d="M34,22l3.5,-0.5"
            stroke-width="2px"
            stroke="#000"
            fill="none"
          />
          <path
            id="Right-Eyebrow"
            d="M57,18.97l3.5,-0"
            stroke-width="2px"
            stroke="#000"
            fill="none"
          />
        </g>
      </g>
      <path
        d="M15.774,45.095c-3.676,5.442 8.352,11.34 24.226,11.375c2.893,0.251 4.226,1.145 5,2.53c2.425,0.3 6.203,0.015 8,-3.03c1.053,-1.392 4.238,-2.102 6.507,-2.381c5.344,-1.234 6.996,-3.34 8.434,-7.883c1.843,-1.286 4.287,-3.507 4.465,-6.713c0.612,-7.689 -4.86,-4.667 -4.969,-11.095l0.005,-5.1c-0.007,-3.7 -8.754,-17.125 -17.004,-17.105c-1.26,-0.023 -2.989,-0.988 -2.938,-2.636c-0.25,-5.213 -2.327,0.519 -3.267,2.513c-0.885,1.513 -2.22,-1.747 -3.733,-4.57c-3.842,-0.189 -2.888,3.349 -3.516,4.961c-2.674,-5.462 -5.247,-4.981 -5.319,-4.961c0.71,4.394 0.343,5.805 -6.165,7.658c-13.863,3.991 -12.338,20.378 -12.338,20.378c0.096,2.298 -1.542,2.681 -3.199,3.789l3.268,2.06c0.038,0.912 -1.684,0.955 -3.168,0.863c-0.05,1.767 0.494,3.132 3.124,3.876l0.001,0.82c-6.709,0.099 -0.889,4.072 2.586,4.651Z"
        style="fill: none; stroke-width: 2px"
      />
    </g>
    <defs>
      <linearGradient
        :id="`_linear_${username}`"
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
.walkingLeft {
  position: absolute;
  animation: footBounce 200ms infinite;
  transform-origin: center;
  animation-delay: 0s;
}

.walkingRight {
  position: absolute;
  animation: footBounce 200ms infinite;
  transform-origin: center;
  animation-delay: 100ms;
}

.blinkingEye {
  animation: eyeBlink 10s infinite;
  transform-origin: center;
}

.bobHead {
  animation: headBob 10s infinite;
  transform-origin: center;
}

.flappingRight {
  animation: rightFlap 10s infinite;
  transform-origin: center;
}

.flappingLeft {
  animation: leftFlap 10s infinite;
  transform-origin: center;
}

.beakTalking {
  animation: beakTalk 2s infinite;
  transform-origin: top left;
}

@keyframes footBounce {
  0%,
  49.9999% {
    transform: translateY(0);
  }
  50%,
  100% {
    transform: translateY(-4px);
  }
}

@keyframes eyeBlink {
  0%,
  49%,
  50%,
  100% {
    transform: scaleY(1) translateY(0);
  }
  49.9999% {
    transform: scaleY(0.2) translateY(-5px);
  }
}

@keyframes headBob {
  0%,
  19%,
  80%,
  100% {
    transform: translateY(0) rotate(0);
  }
  20%,
  39% {
    transform: translateY(5px) rotate(-10deg);
  }
  40%,
  79% {
    transform: translateY(5px) rotate(10deg);
  }
}

@keyframes leftFlap {
  0%,
  48%,
  52%,
  53% {
    transform: rotate(0);
  }
  49%,
  51% {
    transform: rotate(20deg);
  }
}

@keyframes rightFlap {
  0%,
  48%,
  52%,
  53% {
    transform: rotate(0);
  }
  49%,
  51% {
    transform: rotate(-20deg);
  }
}

@keyframes beakTalk {
  0%,
  10%,
  20%,
  30%,
  100% {
    transform: rotate(0);
  }
  5%,
  15%,
  25% {
    transform: rotate(1deg);
  }
}
</style>
