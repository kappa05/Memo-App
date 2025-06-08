<template>
  <v-snackbar
    v-model="show"
    :color="errorType"
    :timeout="timeout"
    top
  >
    {{ errorMessage }}
    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="show = false"
      >
        閉じる
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'GlobalErrorHandler',
  setup() {
    const store = useStore()
    const show = ref(false)
    const timeout = 5000

    const error = computed(() => store.state.error)
    const errorMessage = computed(() => {
      if (!error.value) return ''
      
      if (error.value.response) {
        const status = error.value.response.status
        const message = error.value.response.data.message

        switch (status) {
          case 400:
            return '入力内容に誤りがあります'
          case 401:
            return '認証に失敗しました。再度ログインしてください'
          case 403:
            return 'この操作を実行する権限がありません'
          case 404:
            return 'リソースが見つかりません'
          case 500:
            return 'サーバーエラーが発生しました'
          default:
            return message || 'エラーが発生しました'
        }
      }

      return 'エラーが発生しました'
    })

    const errorType = computed(() => {
      if (!error.value) return 'error'
      
      if (error.value.response) {
        const status = error.value.response.status

        switch (status) {
          case 401:
          case 403:
            return 'warning'
          default:
            return 'error'
        }
      }

      return 'error'
    })

    // エラーが発生したらスナックバーを表示
    const showError = () => {
      if (error.value) {
        show.value = true
      }
    }

    // エラーの監視
    watch(error, showError)

    return {
      show,
      timeout,
      errorMessage,
      errorType
    }
  }
}
</script> 