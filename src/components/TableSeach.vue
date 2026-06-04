<template>
  <el-form ref="formRef" :model="formData">
    <el-row :gutter="24"> 
      <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <component v-model="formData[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholder">
              <template v-if="item.comp==='select'">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="opt in item.options" :label="opt.label" :value="opt.value" :key="opt.value"/>
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-button type="primary" @click="handleSearch">查询</el-button>
    <el-button type="primary" @click="handleReset(formRef)">重置</el-button>
  </el-form>
</template>
<script setup>
import { ref,reactive,computed } from 'vue'
const formRef=ref()
const formItemAttrs=computed(()=>{
  const {formItem}=props
  formItem.forEach(item=>{
    item.col={xs:24,sm:12,md:8,lg:6,xl:6}
  })
  return formItem
})
const emit = defineEmits(['search'])
const formData = reactive({})
const props = defineProps({
  formItem:{
    //类型数组
    type:Array,
    //默认值空数组
    default:()=>[]
  }
})
const isComp=(comp)=>{
  return{
    input:'el-input',
    select:'el-select'
  }[comp]
}
const handleSearch=()=>{
  // console.log(formData)
  emit('search',formData)
}
const handleReset=(formRef)=>{
  if(!formRef) return
  formRef.resetFields()
  emit('search',formData)
}
</script>