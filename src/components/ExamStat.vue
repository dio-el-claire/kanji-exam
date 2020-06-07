<template>
  <div>
    passed: {{stat.passed}}<br>
    failed: {{stat.failed}}
  </div>
</template>
<script>
  export default {
    props: {
      stat: Object
    }
  }
</script>
