<template>
  <el-dialog
    :title="isEdit?'编辑文章':'添加文章'"
    v-model="dialogVisible"
    width="80%"
    @close="handleClose"
  >
  <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input>
    </el-form-item>
    <el-form-item label="所属分类" prop="categoryId">
      <el-select v-model="formData.categoryId" placeholder="请选择分类">
        <el-option v-for="item in categoryist" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文章摘要" prop="summary">
      <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="标签" prop="tags">
      <el-select type="textarea" v-model="formData.tagArray" placeholder="请输入文章标签(可选)" multiple filterable allow-create  >
        <el-option v-for="item in commonTags" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="封面图片" >
      <div class="caver-upload">
        <el-upload
          class="avatar-uploader"
          action="#"
          :before-upload="beforeUpload"
          :http-request="handleUploadRequest"
          :show-file-list="false"
          accept="image/*"
        >
          <div v-if="!imgUrl" class="cover-placeholder">
            <p>点击上传封面图片</p>
          </div>
          <img v-else :src="imgUrl" alt="" class="cover-image">
        </el-upload>
        <div v-if="imgUrl" class="cover-remove">
          <el-button type="danger" size="small" @click="handleRemove">移除封面</el-button>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <RichTextEditor 
        v-model="formData.content" 
        placeholder="请输入文章内容" 
        :maxCharCount="5000"
        @change="handleContentChange"
        @created="handleEditorCreate"
        min-height="400px"
        />
    </el-form-item>
  </el-form>
  <div v-if="btnPreview">
    <h3>内容预览</h3>
    <div v-html="formData.content"></div>
  </div>
  <template #footer>
    <el-button type="primary" @click="btnPreview=!btnPreview">{{btnPreview?'关闭预览':'预览'}}</el-button>
    <el-button type="primary" @click="handleClose">取消</el-button>
    <el-button type="primary" @click="handleSubmit" :loading="loading">{{isEdit?'更新文章':'创建文章'}}</el-button>
  </template>
  </el-dialog>
</template>
<script setup>
import {computed,reactive,ref,nextTick,watch} from 'vue'
import {ElMessage} from 'element-plus'
import {uploadFile,createArticle,updateArticle} from '@/api/admin'
import {fileBaseUrl} from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'
const imgUrl=ref('')
const editorInstance=ref(null)
const btnPreview=ref(false)
const businessId=ref(null)
const props=defineProps({
  modelValue:{
    type:Boolean,
    default:false,
  },
  categoryist:{
    type:Array,
    default:()=>[]
  },
  currentArticle:{
    type:Object,
    default:null
  }
})
const emit=defineEmits(['update:modelValue','success'])
const formRef=ref()
const loading=ref(false)
const isEdit=computed(()=>!!props.currentArticle?.id)
const handleSubmit=()=>{
  console.log('提交前 formData:', JSON.parse(JSON.stringify(formData)));
  formRef.value.validate((valid,fields)=>{
    if(valid){
      loading.value=true
      const submitData={
        ...formData,
        tags:formData.tagArray.join(',')
      }
      delete submitData.tagArray
      if(!isEdit.value){
        submitData.id=businessId.value
        createArticle(submitData).then(res=>{
          loading.value=false
          emit('success')
        })
      }else{
        updateArticle(props.currentArticle.id,submitData).then(res=>{
          loading.value=false
          console.log('提交前 formData:', JSON.parse(JSON.stringify(formData)));
          emit('success')
        })
      }
    }
  })
}
const dialogVisible=computed({
  get(){
    return props.modelValue
  },
  set(val){
    emit('update:modelValue',val)
  }
})
const handleClose=()=>{
  formRef.value.resetFields()
  businessId.value=null
  handleRemove()
  formData.tagArray=[]
  //关闭弹窗
  emit('update:modelValue',false)
}
//表单数据
const formData=reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "id": ""
})
const rules=reactive({
  title:[
    {required:true,message:'请输入文章标题',trigger:'blur'},
    {max:200,message:'文章标题不能超过200个字符',trigger:'blur'}
  ],
  categoryId:[
    {required:true,message:'请选择分类',trigger:'change'},
  ],
  content:[
    {required:true,message:'请输入文章内容',trigger:'blur'},
    {max:5000,message:'文章内容不能超过5000个字符',trigger:'blur'}
  ],
})

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

const beforeUpload=(file)=>{
  const isimg=file.type.startsWith('image/')
  const isSize5M=file.size/1024/1024<5
  if(!isimg){
    ElMessage.error('请上传图片')
    return false
  }
  if(!isSize5M){
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}
// 创建uuid
const handleUploadRequest=async({file})=>{
  businessId.value=crypto.randomUUID()
  const fileRes=await uploadFile(file,{
    businessId:businessId.value
  })
  imgUrl.value=fileBaseUrl+fileRes.filePath
  formData.coverImage=fileRes.filePath
}
const handleRemove=()=>{
  imgUrl.value=''
  formData.coverImage=''
}
const handleContentChange=(data)=>{
  formData.content=data.html
}
const handleEditorCreate=(editor)=>{
  editorInstance.value=editor
  if(formData.content&&editor){
    nextTick(()=>{
      editorInstance.value.setHtml(formData.content)
    })
  }
}
watch(()=>props.currentArticle,(newVal)=>{
  if(newVal){
    nextTick(()=>{
      Object.assign(formData,newVal)
      businessId.value=newVal.id
//封面url
      imgUrl.value=fileBaseUrl+newVal.coverImage
    })
  }
  })
</script>
<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background: #f6f8fa;
}
.cover-image{
  width: 200px;
  height: 120px;
  display: block;
}
</style>