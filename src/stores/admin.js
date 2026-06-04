import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAdminStore = defineStore('admin', () => {
  let isCollapse = ref(false)
  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }
  return {
    isCollapse,
    toggleCollapse
  }
})