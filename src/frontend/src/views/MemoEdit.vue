<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ isNew ? '新規メモ' : 'メモ編集' }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="memo.title"
                    label="タイトル"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="memo.content"
                    label="内容"
                    :rules="[rules.required]"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="memo.category"
                    :items="categories"
                    label="カテゴリー"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="$router.push('/memos')"
            >
              キャンセル
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="save"
            >
              保存
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'MemoEdit',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const memo = ref({
      title: '',
      content: '',
      category: ''
    })

    const rules = {
      required: value => !!value || '必須項目です'
    }

    const isNew = computed(() => !route.params.id)
    const categories = computed(() => store.getters['category/allCategories'])

    const save = async () => {
      try {
        if (isNew.value) {
          await store.dispatch('memo/createMemo', memo.value)
        } else {
          await store.dispatch('memo/updateMemo', {
            id: route.params.id,
            ...memo.value
          })
        }
        router.push('/memos')
      } catch (error) {
        // エラー処理はグローバルエラーハンドラーで行う
      }
    }

    onMounted(async () => {
      try {
        await Promise.all([
          store.dispatch('category/fetchCategories'),
          !isNew.value && store.dispatch('memo/fetchMemo', route.params.id)
        ])

        if (!isNew.value) {
          const currentMemo = store.getters['memo/currentMemo']
          if (currentMemo) {
            memo.value = { ...currentMemo }
          }
        }
      } catch (error) {
        // エラー処理はグローバルエラーハンドラーで行う
      }
    })

    return {
      memo,
      rules,
      isNew,
      categories,
      save
    }
  }
}
</script> 