<template>
  <div>
    <b-pagination-nav :limit="limit" :link-gen="linkGen" :number-of-pages="total" use-router></b-pagination-nav>
  </div>
</template>

<script>
  export default {
    props: {
      limit: Number,
      linkGen: Function,
      total: Number
    }
  }
</script>
