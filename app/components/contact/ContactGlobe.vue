<template>
  <div class="globe-scene" aria-hidden="true">
    <svg class="holographic-globe" focusable="false" viewBox="0 0 220 260" fill="none">
      <defs>
        <radialGradient id="contact-globe-fill">
          <stop offset="0" stop-color="#812bd4" stop-opacity=".12" />
          <stop offset=".85" stop-color="#a448fb" stop-opacity=".2" />
          <stop offset="1" stop-color="#c56bff" stop-opacity=".45" />
        </radialGradient>
        <filter id="contact-globe-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <clipPath id="contact-globe-clip"><circle cx="110" cy="119" r="76" /></clipPath>
      </defs>
      <ellipse
        cx="110"
        cy="224"
        rx="48"
        ry="7"
        fill="#b940ff"
        opacity=".14"
        filter="url(#contact-globe-glow)"
      />
      <circle
        cx="110"
        cy="119"
        r="77"
        stroke="#bb60ff"
        stroke-width="4"
        opacity=".5"
        filter="url(#contact-globe-glow)"
      />
      <circle
        cx="110"
        cy="119"
        r="76"
        fill="url(#contact-globe-fill)"
        stroke="#c878ff"
        stroke-width="1.5"
      />
      <g clip-path="url(#contact-globe-clip)" stroke="#b65aff" stroke-width=".65" opacity=".68">
        <ellipse
          v-for="radius in [20, 43, 62]"
          :key="`meridian-${radius}`"
          cx="110"
          cy="119"
          :rx="radius"
          ry="76"
        />
        <path d="M34 119h152M110 43v152" />
        <ellipse cx="110" cy="119" rx="76" ry="21" />
        <ellipse cx="110" cy="119" rx="76" ry="45" />
        <ellipse cx="110" cy="119" rx="76" ry="64" />
        <path d="M38 88q72 26 144 0M38 150q72-26 144 0M56 62q54 26 108 0M56 176q54-26 108 0" />
      </g>
      <g
        clip-path="url(#contact-globe-clip)"
        fill="#b65aff"
        fill-opacity=".25"
        stroke="#d08aff"
        stroke-width="1.1"
        stroke-linejoin="round"
      >
        <path
          d="m92 49-7 8 5 7-9 4-1 12-12 1-1 8 9 10 15-3 7 9 15 1 6 10-6 13 6 10 1 18 9 13 8-6 2-13 8-8 3-13 8-8-6-13-11-7-3-10-13-3-4-10-12-3-2-13Z"
        />
        <path d="m138 55 12 3 10 11-5 10 7 5 12-1 11 21-12 4-8-9-12 3-4-10-13-4-4-12 7-8Z" />
        <path d="m47 76 13-8 6 8-7 12 6 8-5 9-12-5-8 5-6-10Z" />
        <path d="m44 113 13 1 8 12 8 4-2 10 8 9-8 15-2 13-7 4-4-15-8-7-2-14-9-13Z" />
        <path d="m157 151 9-3 12 9-3 9-14 1-8-6Z" />
      </g>
      <ellipse
        cx="110"
        cy="119"
        rx="99"
        ry="22"
        transform="rotate(23 110 119)"
        stroke="#d173ff"
        stroke-width="1.3"
      />
      <ellipse
        cx="110"
        cy="119"
        rx="90"
        ry="37"
        transform="rotate(-57 110 119)"
        stroke="#c55fff"
        stroke-width=".7"
        opacity=".55"
      />
      <circle cx="197" cy="154" r="3" fill="#edbdff" />
      <circle cx="80" cy="48" r="2" fill="#e3aaff" />
      <path d="M110 201v13m-13-6h26" stroke="#b153f3" opacity=".6" />
    </svg>
    <span class="globe-label">CONNECTED WORLDWIDE</span>
  </div>
</template>

<style scoped>
.globe-scene {
  position: relative;
  z-index: 1;
  margin-left: -25px;
  margin-right: -13px;
  padding-top: 28px;
  text-align: center;
}

.holographic-globe {
  display: block;
  width: 100%;
  min-width: 155px;
  filter: drop-shadow(0 0 12px #bd3dff66);
}

.globe-label {
  display: block;
  margin-top: -12px;
  color: #b57fd0;
  font-family: ui-monospace, monospace;
  font-size: 6px;
  letter-spacing: 1.7px;
  white-space: nowrap;
}

@media (max-width: 1000px) {
  .globe-scene {
    display: none;
  }
}
</style>
