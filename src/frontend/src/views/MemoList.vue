<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            メモ一覧
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="検索"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="filteredMemos"
            :loading="loading"
            :items-per-page="10"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>メモ管理</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="createMemo"
                >
                  新規メモ作成
                </v-btn>
              </v-toolbar>
            </template>

            <template v-slot:[`item.title`]="{ item }">
              <router-link :to="`/memos/${item.id}`">{{ item.title }}</router-link>
            </template>

            <template v-slot:[`item.category`]="{ item }">
              <v-chip
                :color="getCategoryColor(item.category)"
                text-color="white"
              >
                {{ item.category }}
              </v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editMemo(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteMemo(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- MemoCardによるカード表示 -->
    <div v-if="filteredMemos.length">
      <MemoCard
        v-for="memo in filteredMemos"
        :key="memo.id"
        :memo="memo"
        @edit="editMemo"
        @delete="deleteMemo"
      />
    </div>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
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
import MemoCard from '@/components/MemoCard.vue'

export default {
  name: 'MemoListView',
  components: {
    MemoCard
  },
  setup() {
    const store = useStore()
    const search = ref('')
    const dialog = ref(false)
    const editedIndex = ref(-1)
    const editedItem = ref({
      title: '',
      content: '',
      category: ''
    })
    const defaultItem = {
      title: '',
      content: '',
      category: ''
    }

    const headers = [
      { text: 'タイトル', value: 'title' },
      { text: 'カテゴリー', value: 'category' },
      { text: '作成日', value: 'createdAt' },
      { text: '更新日', value: 'updatedAt' },
      { text: '操作', value: 'actions', sortable: false }
    ]

    const loading = ref(true)
    const error = ref(null)
    const memos = ref([])
    const categories = ref([])

    const filteredMemos = computed(() => {
      return memos.value.filter(memo => {
        return memo.title.toLowerCase().includes(search.value.toLowerCase()) ||
               memo.content.toLowerCase().includes(search.value.toLowerCase())
      })
    })

    const formTitle = computed(() => {
      return editedIndex.value === -1 ? '新規メモ' : 'メモ編集'
    })

    const getCategoryColor = (category) => {
      const categoryObj = categories.value.find(c => c.name === category)
      return categoryObj ? categoryObj.color : 'grey'
    }

    const createMemo = () => {
      editedIndex.value = -1
      editedItem.value = Object.assign({}, defaultItem)
      dialog.value = true
    }

    const editMemo = (item) => {
      editedIndex.value = memos.value.indexOf(item)
      editedItem.value = Object.assign({}, item)
      dialog.value = true
    }

    const deleteMemo = async (item) => {
      if (confirm('このメモを削除してもよろしいですか？')) {
        try {
          await store.dispatch('memo/deleteMemo', item.id)
        } catch (error) {
          // エラー処理はグローバルエラーハンドラーで行う
        }
      }
    }

    const close = () => {
      dialog.value = false
      editedItem.value = Object.assign({}, defaultItem)
      editedIndex.value = -1
    }

    const save = async () => {
      try {
        if (editedIndex.value > -1) {
          await store.dispatch('memo/updateMemo', {
            id: editedItem.value.id,
            ...editedItem.value
          })
        } else {
          await store.dispatch('memo/createMemo', editedItem.value)
        }
        close()
      } catch (error) {
        // エラー処理はグローバルエラーハンドラーで行う
      }
    }

    const fetchMemos = async () => {
      try {
        loading.value = true
        const response = await store.dispatch('memo/fetchMemos')
        memos.value = response
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchMemos)

    return {
      search,
      dialog,
      editedIndex,
      editedItem,
      headers,
      loading,
      error,
      filteredMemos,
      categories,
      formTitle,
      getCategoryColor,
      createMemo,
      editMemo,
      deleteMemo,
      close,
      save
    }
  }
}
</script> 