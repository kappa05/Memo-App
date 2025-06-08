<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            {{ memo.title }}
            <v-spacer></v-spacer>
            <v-chip
              :color="getCategoryColor(memo.category)"
              text-color="white"
              class="mr-2"
            >
              {{ memo.category }}
            </v-chip>
            <v-btn
              icon
              @click="editMemo"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="deleteMemo"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <div class="text-subtitle-2 mb-2">
              作成日: {{ formatDate(memo.createdAt) }}
            </div>
            <div class="text-subtitle-2 mb-4">
              更新日: {{ formatDate(memo.updatedAt) }}
            </div>
            <div class="text-body-1 white-space-pre-wrap">
              {{ memo.content }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="$router.push('/memos')"
            >
              一覧に戻る
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">メモ編集</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.title"
                  label="タイトル"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.content"
                  label="内容"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.category"
                  :items="categories"
                  label="カテゴリー"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">キャンセル</v-btn>
          <v-btn color="blue darken-1" text @click="save">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'MemoDetail',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const dialog = ref(false)
    const editedItem = ref({
      title: '',
      content: '',
      category: ''
    })

    const memo = computed(() => store.getters['memo/currentMemo'])
    const categories = computed(() => store.getters['category/allCategories'])

    const getCategoryColor = (category) => {
      const categoryObj = categories.value.find(c => c.name === category)
      return categoryObj ? categoryObj.color : 'grey'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString('ja-JP')
    }

    const editMemo = () => {
      editedItem.value = Object.assign({}, memo.value)
      dialog.value = true
    }

    const deleteMemo = async () => {
      if (confirm('このメモを削除してもよろしいですか？')) {
        try {
          await store.dispatch('memo/deleteMemo', memo.value.id)
          router.push('/memos')
        } catch (error) {
          // エラー処理はグローバルエラーハンドラーで行う
        }
      }
    }

    const close = () => {
      dialog.value = false
      editedItem.value = Object.assign({}, memo.value)
    }

    const save = async () => {
      try {
        await store.dispatch('memo/updateMemo', {
          id: memo.value.id,
          ...editedItem.value
        })
        close()
      } catch (error) {
        // エラー処理はグローバルエラーハンドラーで行う
      }
    }

    onMounted(async () => {
      try {
        await Promise.all([
          store.dispatch('memo/fetchMemo', route.params.id),
          store.dispatch('category/fetchCategories')
        ])
      } catch (error) {
        // エラー処理はグローバルエラーハンドラーで行う
      }
    })

    return {
      memo,
      categories,
      dialog,
      editedItem,
      getCategoryColor,
      formatDate,
      editMemo,
      deleteMemo,
      close,
      save
    }
  }
}
</script>

<style scoped>
.white-space-pre-wrap {
  white-space: pre-wrap;
}
</style> 