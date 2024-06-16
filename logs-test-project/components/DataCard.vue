<template>
    <h1>
        {{ test.data[0] }}
    </h1>
    <span>
      <slot />
    </span>
</template>
<script setup>
    const props = defineProps(["test"])
    console.log("test")
    console.log(props.test.data)
</script>