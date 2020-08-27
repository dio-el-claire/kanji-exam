<template>
  <section class="section">
    <center v-if="message" class="subtitle">{{ $t(`message.${message}`) }}</center>
    <div class="cssload-loader">
      <div class="cssload-inner cssload-one"></div>
      <div class="cssload-inner cssload-two"></div>
      <div class="cssload-inner cssload-three"></div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    message: { type: String }
  }
}
</script>
