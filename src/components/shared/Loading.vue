<template>
  <div class="loader">
    <div class="container">
      <div class="loader-outter"></div>
      <div class="loader-inner"></div>
    </div>
    <div class="caption">{{ caption }}</div>
  </div>
</template>
<script>
export default {
  name: "Loading",
  data: () => ({}),
  props: {
    caption: String
  }
};
</script>
<style scoped>
.loader {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: #f1f1f1;
  z-index: 999999;
}
.loader .container {
  width: 100%;
  top: 50%;
}
.loader .caption {
  position: relative;
  color: #0298d3;
  height: 50px;
  width: 100%;
  top: 52%;
  padding-left: 5%;
  font-size: 20px !important;
  text-align: center;
}
.loader .container .loader-outter {
  position: absolute;
  border: 2px solid orange;
  border-left-color: transparent;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  left: calc(50% - 15px);
  top: calc(50% - 15px);
  -webkit-animation: loader-outter 1s cubic-bezier(0.42, 0.61, 0.58, 0.41)
    infinite;
  animation: loader-outter 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
}

.loader .container .loader-inner {
  position: absolute;
  border: 2px solid #0298d3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  left: calc(50% - 10px);
  top: calc(50% - 10px);
  border-right: 0;
  border-top-color: transparent;
  -webkit-animation: loader-inner 1s cubic-bezier(0.42, 0.61, 0.58, 0.41)
    infinite;
  animation: loader-inner 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
}

@-webkit-keyframes loader-outter {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loader-outter {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader-inner {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}

@keyframes loader-inner {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}
</style>
