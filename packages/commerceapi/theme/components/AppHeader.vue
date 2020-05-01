<template>
  <SfHeader
    active-sidebar="activeSidebar"
    @click:cart="toggleCartSidebar"
    @click:account="onAccountClicked"
    :cartItemsQty="cartTotalItems"
    >
    <template #logo>
      <nuxt-link :to="localePath('/')" class="sf-header__logo">
        <SfImage src="/icons/logo.svg" alt="Vue Storefront Next" class="sf-header__logo-image"/>
      </nuxt-link>
    </template>
    <template #navigation>
      <SfHeaderNavigationItem v-for="(x, i) in tree" :key="i">
        <nuxt-link :to="'/c/'+ x.slug">
          {{x.label}}
        </nuxt-link>
      </SfHeaderNavigationItem>
    </template>
  </SfHeader>
</template>

<script>
import { SfHeader, SfImage } from '@storefront-ui/vue';
import uiState from '~/assets/ui-state';
import { useCart, useUser, cartGetters, useCategory, categoryGetters } from '@vue-storefront/commerceapi';
import { computed } from '@vue/composition-api';
const { toggleCartSidebar, toggleLoginModal } = uiState;

export default {
  components: {
    SfHeader,
    SfImage
  },
  setup(props, { root }) {
    const { isAuthenticated } = useUser();
    const onAccountClicked = () => {
      isAuthenticated && isAuthenticated.value ? root.$router.push('/my-account') : toggleLoginModal();
    };
    const { cart } = useCart();
    const { tree, loadingTree, loadTree } = useCategory('categories');

    if (!root.$isServer)
      loadTree();

    const cartTotalItems = computed(() => {
      const count = cartGetters.getTotalItems(cart.value);
      // TODO: remove once resolved by UI team: https://github.com/DivanteLtd/storefront-ui/issues/922
      return count ? count.toString() : null;
    });
    return {
      tree: computed(() => categoryGetters.getTree(tree.value).items),
      loadingTree,
      cartTotalItems,
      toggleLoginModal,
      onAccountClicked,
      toggleCartSidebar
    };
  }
};
</script>

<style lang="scss" scoped>
.sf-header__logo-image {
  height: 100%;
}
</style>
