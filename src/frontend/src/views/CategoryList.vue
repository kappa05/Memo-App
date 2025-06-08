<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            カテゴリー管理
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="createCategory"
            >
              新規カテゴリー作成
            </v-btn>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="categories"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:[`item.color`]="{ item }">
              <v-chip
                :color="item.color"
                text-color="white"
              >
                {{ item.color }}
              </v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editCategory(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteCategory(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

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
                  v-model="editedItem.name"
                  label="カテゴリー名"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-color-picker
                  v-model="editedItem.color"
                  mode="hex"
                  hide-inputs
                  class="mx-auto"
                ></v-color-picker>
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

export default {
  name: 'CategoryList',
  setup() {
    const store = useStore()

    const dialog = ref(false)
    const editedIndex = ref(-1)
    const editedItem = ref({
      name: '',
      color: '#000000'
    })
    const defaultItem = {
      name: '',
      color: '#000000'
    }

    const headers = [
      { text: 'カテゴリー名', value: 'name' },
      { text: '色', value: 'color' },
      { text: '操作', value: 'actions', sortable: false }
    ]

    const loading = computed(() => store.getters['category/isLoading'])
    const categories = computed(() => store.getters['category/allCategories'])

    const formTitle = computed(() => {
      return editedIndex.value === -1 ? '新規カテゴリー' : 'カテゴリー編集'
    })

    const createCategory = () => {
      editedIndex.value = -1
      editedItem.value = Object.assign({}, defaultItem)
      dialog.value = true
    }

    const editCategory = (item) => {
      editedIndex.value = categories.value.indexOf(item)
      editedItem.value = Object.assign({}, item)
      dialog.value = true
    }

    const deleteCategory = async (item) => {
      if (confirm('このカテゴリーを削除してもよろしいですか？')) {
        try {
          await store.dispatch('category/deleteCategory', item.id)
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
          await store.dispatch('category/updateCategory', {
            id: editedItem.value.id,
            ...editedItem.value
          })
        } else {
          await store.dispatch('category/createCategory', editedItem.value)
        }
        close()
      } catch (error) {
        // エラー処理はグローバルエラーハンドラーで行う
      }
    }

    onMounted(async () => {
      try {
        await store.dispatch('category/fetchCategories')
      } catch (error) {
        // エラー処理はグローバルエラーハンドラーで行う
      }
    })

    return {
      dialog,
      editedIndex,
      editedItem,
      headers,
      loading,
      categories,
      formTitle,
      createCategory,
      editCategory,
      deleteCategory,
      close,
      save
    }
  }
}
</script> 