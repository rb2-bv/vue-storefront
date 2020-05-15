<template>
  <transition name="fade">
    <SfTabs
      v-if="editAddress"
      key="edit-address"
      :open-tab="1"
      class="tab-orphan"
    >
      <SfTab data-cy="shipping-details-tab_change" title="Change the address">
        <SfButton data-cy="shipping-details-btn_add" class="action-button" @click="editAddress = false">All Addresses</SfButton>
        <p class="message">
          Keep your addresses and contact details updated.
        </p>
        

        <ValidationObserver v-slot="{ handleSubmit }">
          <form id="shipping-details-form" class="form" @submit.prevent="handleSubmit(updateAddress)">
            <div class="form__horizontal">
              <ValidationProvider rules="required|min:2" v-slot="{ errors }" class="form__element">
                <SfInput
                  data-cy="shipping-details-input_firstName"
                  v-model="firstName"
                  name="firstName"
                  label="First Name"
                  required
                  :valid="!errors[0]"
                  :errorMessage="errors[0]"
                />
              </ValidationProvider>
              <ValidationProvider rules="required|min:2" v-slot="{ errors }" class="form__element">
                <SfInput
                  data-cy="shipping-details-input_lastName"
                  v-model="lastName"
                  name="lastName"
                  label="Last Name"
                  required
                  :valid="!errors[0]"
                  :errorMessage="errors[0]"
                />
              </ValidationProvider>
            </div>
            <ValidationProvider rules="required|min:5" v-slot="{ errors }" class="form__element">
              <SfInput
                data-cy="shipping-details-input_streetName"
                v-model="streetName"
                name="streetName"
                label="Street Name"
                required
                :valid="!errors[0]"
                :errorMessage="errors[0]"
              />
            </ValidationProvider>
            <SfInput
              data-cy="shipping-details-input_apartment"
              v-model="apartment"
              name="apartment"
              label="House/Apartment number"
              required
              class="form__element"
            />
            <div class="form__horizontal">
              <ValidationProvider rules="required|min:2" v-slot="{ errors }" class="form__element">
                <SfInput
                  data-cy="shipping-details-input_city"
                  v-model="city"
                  name="city"
                  label="City"
                  required
                  :valid="!errors[0]"
                  :errorMessage="errors[0]"
                />
              </ValidationProvider>
              <ValidationProvider rules="required|min:2" v-slot="{ errors }" class="form__element">
              <SfInput
                data-cy="shipping-details-input_state"
                  v-model="state"
                  name="state"
                  label="State/Province"
                  required
                  :valid="!errors[0]"
                  :errorMessage="errors[0]"
                />
              </ValidationProvider>
            </div>
            <div class="form__horizontal">
              <ValidationProvider rules="required|min:4" v-slot="{ errors }" class="form__element">
                <SfInput
                  data-cy="shipping-details-input_zipCode"
                  v-model="zipCode"
                  name="zipCode"
                  label="Zip-code"
                  required
                  :valid="!errors[0]"
                  :errorMessage="errors[0]"
                />
              </ValidationProvider>
              <ValidationProvider :rules="`required`" v-slot="{ errors }" class="form__element">
                <SfSelect
                  data-cy="shipping-details-select_country"
                  v-model="country"
                  name="country"
                  label="Country"
                  required
                  :valid="!errors[0]"
                  :errorMessage="errors[0]"
                >
                  <SfSelectOption
                    v-for="countryOption in countries"
                    :key="countryOption.code"
                    :value="countryOption.code"
                  >
                    {{ countryOption.label }}
                  </SfSelectOption>
                </SfSelect>
              </ValidationProvider>
            </div>
            <ValidationProvider rules="required|min:8" v-slot="{ errors }" class="form__element">
              <SfInput
                data-cy="shipping-details-input_phoneNumber"
                v-model="phoneNumber"
                name="phone"
                label="Phone number"
                required
                :valid="!errors[0]"
                :errorMessage="errors[0]"
              />
            </ValidationProvider>
            <SfButton data-cy="shipping-details-btn_update" class="form__button">Update the address</SfButton>
          </form>
        </ValidationObserver>
      </SfTab>
    </SfTabs>
    <SfTabs v-else key="address-list" :open-tab="1" class="tab-orphan">
      <SfTab data-cy="shipping-details-tab_details" title="Addresses">
        <p class="message">
          Manage all the addresses you want. This way you won't have to enter the shipping or billing address manually
          with each order.
        </p>
        <transition-group tag="div" name="fade" class="shipping-list" v-if="addresses">
          <div
            v-for="shipping in addresses.map(userGetters.getAddress)"
            :key="shipping.id"
            class="shipping"
          >
            <div class="shipping__content">
              <p class="shipping__address">
                <span class="shipping__client-name"
                  >{{ shipping.firstName }} {{ shipping.lastName }}</span
                ><br />
                {{ shipping.streetName }} {{ shipping.apartment }}<br />{{
                  shipping.zipCode
                }}
                {{ shipping.city }},<br />{{ shipping.country }}
              </p>
              <p class="shipping__address">
                {{ shipping.phoneNumber }}
              </p>
            </div>
            <div class="shipping__actions">
              <SfIcon
                data-cy="shipping-details-icon_delete"
                icon="cross"
                color="gray"
                size="14px"
                role="button"
                class="mobile-only"
                @click="deleteAddress(shipping)"
              />
              <SfButton data-cy="shipping-details-btn_change" @click="changeAddress(shipping)">Change</SfButton>
              <SfButton data-cy="shipping-details-btn_delete"
                class="shipping__button-delete desktop-only"
                @click="deleteAddress(shipping)"
                >Delete</SfButton
              >
            </div>
          </div>
        </transition-group>
        <SfButton data-cy="shipping-details-btn_add" class="action-button" @click="changeAddress(null)"
          >Add new address</SfButton
        >
      </SfTab>
    </SfTabs>
  </transition>
</template>
<script>
import {
  SfTabs,
  SfInput,
  SfButton,
  SfSelect,
  SfIcon
} from '@storefront-ui/vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, min, oneOf } from 'vee-validate/dist/rules';
import { computed, watch, ref } from '@vue/composition-api';
import { useLocale, userGetters } from '@vue-storefront/commerceapi';

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('oneOf', {
  ...oneOf,
  message: 'Invalid country'
});

export default {
  name: 'ShippingDetails',
  components: {
    SfTabs,
    SfInput,
    SfButton,
    SfSelect,
    SfIcon,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    addresses: {
      type: Array,
      default: () => {[]}
    }
  },
  setup(props, context) {
    const locale = useLocale();
    const countries = computed(() => locale.country );

    const editAddress = ref(false);
    const editedAddress = ref(null);
    const firstName = ref('');
    const lastName = ref('');
    const streetName = ref('');
    const apartment = ref('');
    const city = ref('');
    const state = ref('');
    const zipCode = ref('');
    const country = ref('');
    const phoneNumber = ref('');

    const changeAddress = (shipping) => {
      if (!shipping) {
        shipping = {country: locale.country.code};
      }
      editedAddress.value = shipping;
      
      firstName.value = shipping.firstName;
      lastName.value = shipping.lastName;
      streetName.value = shipping.streetName;
      apartment.value = shipping.apartment;
      city.value = shipping.city;
      state.value = shipping.state;
      zipCode.value = shipping.zipCode;
      country.value = shipping.country;
      phoneNumber.value = shipping.phoneNumber;
      editAddress.value = true;
    };
    const updateAddress = () => {
      const shipping = {
        id: editedAddress.value.id,
        firstName: firstName.value,
        lastName: lastName.value,
        apartment: apartment.value,
        streetName: streetName.value,
        city: city.value,
        state: state.value,
        zipCode: zipCode.value,
        country: country.value,
        phoneNumber: phoneNumber.value
      };
      if (!shipping.id)
        context.emit('add:address', shipping);
      else 
        context.emit('update:address', shipping);
      editAddress.value = false;
    };
    const deleteAddress = (value) => {
      context.emit('delete:address', value);
      editAddress.value = false;
    };

    return {
      deleteAddress,
      updateAddress,
      changeAddress,
      countries,
      editAddress,
      userGetters,
      editedAddress,
      firstName,
      lastName,
      streetName,
      apartment,
      city,
      state,
      zipCode,
      country,
      phoneNumber
    };
  }
};
</script>
<style lang='scss' scoped>
@import '~@storefront-ui/vue/styles';
@mixin for-mobile {
  @media screen and (max-width: $desktop-min) {
    @content;
  }
}
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.form {
  &__element {
    display: block;
    margin-bottom: var(--spacer-2xl);
  }

  &__button {
    display: block;
  }

  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-2xl);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.message {
  margin: 0 0 var(--spacer-2xl) 0;
  font-family: var(--font-family-primary);
  line-height: 1.6;
  font-size: var(--font-base-mobile);
  @include for-desktop {
    font-size: var(--font-base-desktop);
  }
}
.shipping-list {
  margin-bottom: var(--spacer-2xl);
}
.shipping {
  display: flex;
  padding: var(--spacer-xl) 0;
  border-top: 1px solid var(--c-light);
  &:last-child {
    border-bottom: 1px solid var(--c-light);
  }
  &__content {
    flex: 1;
    color: var(--c-text);
    font-size: var(--font-sm-mobile);
    font-weight: 300;
    line-height: 1.6;
    @include for-desktop {
      font-size: var(--font-sm-desktop);
    }
  }
  &__actions {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    @include for-desktop {
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
  }
  &__button-delete {
    background-color: var(--c-light);
    color: var(--c-text-muted);
    @include for-desktop {
      margin-left: var(--spacer-xl);
    }
  }
  &__address {
    margin: 0 0 var(--spacer-xl) 0;
    &:last-child {
      margin: 0;
    }
  }
  &__client-name {
    font-size: var(--font-base-desktop);
    font-weight: 500;
  }
}
.action-button {
  width: 100%;
  @include for-desktop {
    width: auto;
  }
}
.tab-orphan {
  @include for-mobile {
    ::v-deep .sf-tabs {
      &__title {
        display: none;
      }
      &__content {
        border: 0;
        padding: 0;
      }
    }
  }
}
</style>
