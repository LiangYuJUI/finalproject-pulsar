<template>
    <div :class="[ status == 'error' ? 'bg-red-100/40' : 'bg-green-100/40' ]" class="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-200/80 rounded-lg backdrop-blur-sm shadow-xl">
        <div class="spinner-box">
            <div class="circle-borderok">
                <div class="circle-core bg-black/90 transition duration-600">
                    <img src="/images/NeoPowerSmallLogo.png" class="p-2 h-100 bg-black/50 rounded-full hover:opacity-60 duration-1000" alt="NeoPower Logo" />
                </div>
            </div>
        </div>
        <div class="mb-6 px-6 text-center text-5xl font-npc font-bold">
            {{ props.msg ? props.msg : "OK" }}
        </div>
        <div class="mb-6 px-6 text-center text-5xl font-npc font-bold">
        </div>
    </div>
</template>
<script setup>
    const props = defineProps(["isSuccess", "msg", "status"]);
</script>
<style scope>
@keyframes spin {
    from {
      transform: rotate(0);
    }
    to{
      transform: rotate(359deg);
    }
  }
  
  @keyframes spin3D {
    from {
      transform: rotate3d(1.5, 1.5, 1.5, 360deg);
    }
    to{
      transform: rotate3d(0deg);
    }
  }
  
  @keyframes configure-clockwise {
    0% {
        transform: rotate(0deg);
    }
    50% {
        transform: rotate(30deg);
    }
    100% {
        transform: rotate(666deg);
    }
  }
  
  @keyframes configure-xclockwise {
    0% {
      transform: rotate(45deg);
    }
    25% {
      transform: rotate(-45deg);
    }
    50% {
      transform: rotate(-135deg);
    }
    75% {
      transform: rotate(-225deg);
    }
    100% {
      transform: rotate(-315deg);
    }
  }
  @keyframes ok {
    0% {
      transform: rotate(3600deg);
    }
    20% {
        transform: rotate(2600deg);
    }
    40% {
        transform: rotate(300deg);
    }
    90% {
        transform: rotate(330deg);
    }
    95% {
        transform: rotate(355deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes pulse {
    from {
      opacity: 0.5;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
.spinner-box {
    width: 300px;
    height: 250px;
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
    background-color: transparent;
}
.circle-borderok {
    width: 150px;
    height: 150px;
    padding: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: rgb(63,249,220);
    background: linear-gradient(0deg, rgba(249,220,9,1) 23%, rgba(63,249,220,1) 55%, rgba(255,133,220,1) 100%);
    animation: ok 1s linear 0s 1;
}
.circle-core {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
</style>