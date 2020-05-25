<template>
  <div> 
    <component :is="component" />
    <div v-if="notFound" class="notfound">
      <h1>Not found</h1>
      <div @click="test()">The page you specified was not found.</div>
    </div>
  </div>
</template>

<script>

import { catalogResolveSlug } from '@vue-storefront/commerceapi-api';

import { onSSR } from '@vue-storefront/core';
import { ref, computed, watch } from '@vue/composition-api';


export default {
  name: 'NotFound',
  title: "Not Found",

  setup(props, context) {
    let component = ref(null);
    let notFound = ref(false);
    onSSR(async () =>{ 
      try {
      let result = await catalogResolveSlug(context.root.$route.params.slug);
        if (result.type == 2) {
          context.root.$route.params.id = result.product.sku;
          component.value = () => import("./Product");
        } else if (result.type == 1) {
          component.value = () => import("./Category");
        } else  {
          notFound.value = true;
        }
      } catch(e) {
        notFound.value = true;
      }
    })
    if (notFound && context.isServer && context.ssrContext && context.ssrContext.res) {
      context.ssrContext.res.statusCode = 404;
    }
    return {
      component,
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