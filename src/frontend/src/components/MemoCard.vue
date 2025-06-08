<template>
  <v-card class="mb-2">
    <v-card-title>{{ memo.title }}</v-card-title>
    <v-card-text>{{ memo.content }}</v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="$emit('edit', memo)">編集</v-btn>
      <v-btn color="error" @click="$emit('delete', memo)">削除</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'MemoCard',
  props: {
    memo: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.mb-2 {
  margin-bottom: 16px;
}
</style> 