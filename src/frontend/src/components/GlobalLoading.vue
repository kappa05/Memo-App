<template>
  <v-overlay
    :value="loading"
    :opacity="0.8"
    color="primary"
  >
    <v-progress-circular
      indeterminate
      size="64"
      color="white"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'GlobalLoading',
  setup() {
    const store = useStore()

    const loading = computed(() => {
      return store.getters['memo/isLoading'] ||
             store.getters['category/isLoading'] ||
             store.getters['auth/isLoading']
    })

    return {
      loading
    }
  }
}
</script> 