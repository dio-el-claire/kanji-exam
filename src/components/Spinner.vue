<template>
  <section class="section">
    <center v-if="showText" class="subtitle">{{ $t('message.loadingKanjiGroups') }}</center>
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
    showText: { type: Boolean, default: true }
  }
}
</script>
