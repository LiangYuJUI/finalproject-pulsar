<template>
    <footer class="w-full bg-white  shadow dark:bg-gray-900 m-0 ">
        <div class="w-full mx-auto p-4 md:px-6 md:py-8 shadow-lg">
            <div class="container mx-auto">
                <div class="lg:flex sm:justify-between py-4">
                    <NuxtLink href="/" class="flex p-2">
                        <img src="../assets/images/NeoPowerSmallLogo.png" class="h-8 mr-3" alt="Logo" />
                        <span class="text-2xl font-semibold whitespace-nowrap dark:text-white font-handwriting">NeoPower x gochabar</span>
                    </NuxtLink>
                    <div class="text-sm p-2">
                        <p class="text-lg">NeoPower 新動智能股份有限公司</p>
                        <p>台北市大安區新生南路三段8號4樓</p>
                        <p>(02)23696680</p>
                        <p>neopowertechinfo@gmail.com</p>
                    </div>
                    <div class="text-sm p-2">
                        <p class="text-lg">gochabar 充壩技術服務股份有限公司</p>
                        <p>新北市土城區承天路37之1號8樓</p>
                        <p>(02)22697887</p>
                    </div>
                    <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400 p-2">© 
                        <NuxtLink href="/" class="hover:underline">NeoPower</NuxtLink>. All Rights Reserved.
                    </span>
                </div>
            </div>
        </div>
        <div class="fixed w-full bottom-0 left-0 bg-gradient-to-r hover:bg-gradient-to-l from-blue-300/20 via-green-300/40 to-red-300/20  font-npc text-center hover:opacity-80 transition-all duration-1000 cursor-pointer">
            <label class="text-2xl text-gray-700 cursor-pointer font-black">
                {{ footerTimeString.toLocaleString('zh', {year:'numeric', month:'2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})  }}
            </label>
        </div>
        <div class="fixed bottom-12 right-0 text-right font-black -mt-8 px-1 py-0.5 cursor-pointer bg-gray-600/30 opacity-90 rounded-l-md transition duration-1000 border-l border-y border-amber-400 hover:bg-gradient-to-l hover:from-blue-300/50 hover:to-green-300/50 shadow-lg select-none">
            <div class="flex flex-row">
                <div class="spinner-boxx">
                    <div class="circle-borderx">
                        <div class="circle-corex transition duration-600">
                            <img src="/images/NeoPowerSmallLogo.png" class="bg-gradient-to-r from-blue-50/20 via-green-50/40 to-red-50/20 rounded-full hover:opacity-60 duration-1000" alt="NeoPower Logo" />
                        </div>
                    </div>
                </div>
                <div class="font-npc font-black px-0.5 transition-all">NeoPower EVCMS, Version - 1.7.0</div>
            </div>
        </div>
        
    </footer>
</template>
<script setup>
    const footerTimeString = ref("")
    const updateTime = () => {
        footerTimeString.value = new Date();
        setTimeout( updateTime, 1000 );
    }
    updateTime();
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
.spinner-boxx {
    width: 25px;
    height: 25px;
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
    background-color: transparent;
}
.circle-borderx {
    width: 20px;
    height: 20px;
    padding: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: rgb(63,249,220);
    background: linear-gradient(0deg, rgba(249,220,9,1) 23%, rgba(63,249,220,1) 55%, rgba(255,133,220,1) 100%);
    animation: spin 8s linear 0s infinite;
}
.circle-corex {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
</style>
