<template>
  <div class="hologram-decoration" aria-hidden="true">
    <div class="hologram-beam" />
    <div class="hologram-pedestal"><i /><i /><i /><span /></div>
  </div>
</template>

<style scoped>
.hologram-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hologram-beam {
  position: absolute;
  z-index: 0;
  width: 88%;
  height: 86%;
  bottom: -12px;
  left: 6%;
  background: linear-gradient(0deg, #d743ff2b, #a13aff05 80%);
  clip-path: polygon(12% 0, 88% 0, 100% 100%, 0 100%);
  filter: blur(10px);
}
.hologram-pedestal {
  position: absolute;
  z-index: 1;
  bottom: -13px;
  left: -12%;
  width: 124%;
  height: 65px;
  border: 2px solid #a74ae9a3;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    #d139ff23 10%,
    #ae39dc4a 53%,
    #43115d80 63%,
    #c260ff88 67%,
    #2d093f80 70%
  );
  box-shadow:
    0 0 18px #b52eff63,
    inset 0 0 12px #bb2cff52,
    0 8px 0 #59197175;
}
.hologram-pedestal i {
  position: absolute;
  inset: 9px 5%;
  border: 2px solid #e783ff;
  border-radius: 50%;
  box-shadow:
    0 0 7px #df42ff,
    inset 0 0 8px #ac2bff;
}
.hologram-pedestal i:nth-child(2) {
  inset: -10px -3%;
  border-width: 1px;
  opacity: 0.55;
}
.hologram-pedestal i:nth-child(3) {
  inset: 18px 16%;
  opacity: 0.6;
}
.hologram-pedestal span {
  position: absolute;
  bottom: -3px;
  left: 24%;
  width: 30%;
  height: 5px;
  border-radius: 2px;
  background: #f9c1ff;
  box-shadow:
    0 0 8px 3px #df32ff,
    0 0 16px #df32ff;
}

@media (max-width: 760px) {
  .hologram-pedestal {
    height: 53px;
  }
}

@media (max-width: 520px) {
  .hologram-pedestal {
    width: 112%;
    left: -6%;
    bottom: -14px;
  }
  .hologram-pedestal i:nth-child(2) {
    inset: -5px -2%;
  }
}
</style>
