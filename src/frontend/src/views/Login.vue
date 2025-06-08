<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>ログイン</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field
                v-model="email"
                label="メールアドレス"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="パスワード"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[rules.required]"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="handleLogin">ログイン</v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            <router-link to="/register">新規登録はこちら</router-link>
            <br>
            <router-link to="/forgot-password">パスワードをお忘れの方はこちら</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const form = ref(null)

    const email = ref('')
    const password = ref('')

    const rules = {
      required: value => !!value || '必須項目です',
      email: value => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(value) || '有効なメールアドレスを入力してください'
      }
    }

    const handleLogin = async () => {
      const { valid } = await form.value.validate()
      
      if (valid) {
        try {
          await store.dispatch('auth/login', {
            email: email.value,
            password: password.value
          })
          router.push('/memos')
        } catch (error) {
          // エラー処理はグローバルエラーハンドラーで行う
        }
      }
    }

    return {
      email,
      password,
      rules,
      form,
      handleLogin
    }
  }
}
</script> 