<template>
  <v-app>
    <global-navigation v-if="isLoggedIn" />
    <global-error-handler />
    <global-loading />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import GlobalNavigation from '@/components/GlobalNavigation.vue'
import GlobalErrorHandler from '@/components/GlobalErrorHandler.vue'
import GlobalLoading from '@/components/GlobalLoading.vue'

export default {
  name: 'App',
  components: {
    GlobalNavigation,
    GlobalErrorHandler,
    GlobalLoading
  },
  setup() {
    const store = useStore()
    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn'])

    return {
      isLoggedIn
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');

body {
  font-family: 'Noto Sans JP', sans-serif;
}
</style> 