<template>
  <v-app-bar
    app
    color="primary"
    dark
  >
    <v-app-bar-nav-icon
      @click="drawer = !drawer"
      class="d-flex d-sm-none"
    ></v-app-bar-nav-icon>

    <v-toolbar-title>メモアプリ</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn
      icon
      @click="logout"
    >
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    app
  >
    <v-list>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'GlobalNavigation',
  setup() {
    const router = useRouter()
    const store = useStore()
    const drawer = ref(false)

    const menuItems = [
      {
        title: 'メモ一覧',
        path: '/memos',
        icon: 'mdi-note-text'
      },
      {
        title: 'カテゴリー管理',
        path: '/categories',
        icon: 'mdi-tag-multiple'
      }
    ]

    const logout = async () => {
      await store.dispatch('auth/logout')
      router.push('/login')
    }

    return {
      drawer,
      menuItems,
      logout
    }
  }
}
</script> 