<template>
  <div v-if="notFound" class="notfound">
    <h1>Not found</h1>
    <div>The page you specified was not found.</div>
  </div>
</template>

<script>
export default {
  name: 'test1',
  title: "test2",
  setup(props, context) {
    let notFound = false;
    notFound = true;
    if (notFound && context.isServer && context.ssrContext && context.ssrContext.res) {
      context.ssrContext.res.statusCode = 404;
    }
    return {
        notFound: notFound
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.notfound {
  @include for-desktop {
  }  
}
</style>