<template>  
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button @click="handleEdit({})" type="primary">新增</el-button>
      </template>
    </PageHead>
    <TableSeach :formItem="forItem" @search="handleSearch"></TableSeach>
    <el-table :data="tableData" style="width:100% ; margin-top:25px">
      <el-table-column label="文章标题" width="200" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon><timer/></el-icon>            
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="150">
        <template #default="scope">
          <div style="display: flex; align-items: center;">          
            <span>{{ scope.row.categoryName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="150"/>
      <el-table-column prop="readCount" label="阅读量" width="150"/>
      <el-table-column prop="createdAt" label="发布时间" width="150"/>
      <el-table-column label="状态" width="250" fixed="right">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status ===0||scope.row.status ===2" type="success">发布</el-button>
          <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status ===1" type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
    @change="handleChange"
    :page-size.sync="pagination.size"
    layout="prev, pager, next" 
    :total="pagination.total" 
    style="margin-top:25px"/>
    <ArticileDialog v-model:modelValue="dialogVisible" :currentArticle="currentArticle" :categoryist="categoryist" @success="handleSuccess"></ArticileDialog>
  </div>
</template>
<script setup>
  import PageHead from '@/components/PageHead.vue'
  import TableSeach from '@/components/TableSeach.vue'
  import {categoryTree,articlePage,knowledgeArticle,changeArticleStatus,deleteArticle} from '@/api/admin'
  import {onMounted,ref,reactive} from 'vue'
  import ArticileDialog from '@/components/ArticileDialog.vue'
  import {ElMessage, ElMessageBox}from 'element-plus'
  const forItem=[
    {comp:'input',prop:'title',label:'文章标题',placeholder:'请输入文章标题'},
    {comp:'select',prop:'categoryId',label:'分类',placeholder:'请选择分类'},
    {comp:'select',prop:'status',label:'状态',placeholder:'请选择状态',options:[
      {label:'草稿',value:'0'},
      {label:'已发布',value:'1'},
      {label:'已下线',value:'2'}
    ]},
  ]
  const dialogVisible=ref(false)
  const categoryMap=reactive({})
  const tableData=ref([])
  const categoryist=ref([])
  const pagination =reactive({
      currentPage:1,
      size:10,
      total:0,
    })
    //隐藏弹窗，刷新数据
  const handleSuccess=()=>{
    dialogVisible.value=false
    handleSearch()
  }
  const handleChange=(page)=>{
    pagination.currentPage=page
    handleSearch()
  }
  const handleSearch = async(formData)=>{
  const params={
      ...pagination,
      ...formData
    }
    const {records,total} =await articlePage(params)
    tableData.value=records
    pagination.total=total
  }
  onMounted(async()=>{
    const data= await categoryTree()
    categoryist.value=data.map(item=>{
      categoryMap[item.id]=item.categoryName
      return {
        label:item.categoryName,
        value:item.id,
      }
    })
    console.log(categoryist.value);
    handleSearch()
    forItem[1].options=categoryist.value
  })
  const currentArticle=ref(null)
  const handleEdit=(row)=>{
    if(!row.id){
      currentArticle.value=null
      dialogVisible.value=true
    }else{
      knowledgeArticle(row.id).then(res=>{
      currentArticle.value=res
      dialogVisible.value=true
    })
  }
  }
  const handlePublish=(row)=>{
    ElMessageBox.confirm(
      `确定发布${row.title}吗`,
      '确认',
      {
        confirmButtonText:'确认发布',
        cancelButtonText:'取消',
        type:'info'
      }
    ).then(()=>{
        changeArticleStatus(row.id,{status:1}).then(()=>{
          ElMessage.success('发布成功')
          handleSuccess()
        })
    })
  }
  const handleUnpublish = (row)=>{
    ElMessageBox.confirm(
      `确定下线${row.title}吗`,
      '确认',
      {
        confirmButtonText:'确认下线',
        cancelButtonText:'取消',
        type:'warning'
      }
    ).then(()=>{
        changeArticleStatus(row.id,{status:2}).then(()=>{
          ElMessage.success('下线成功')
          handleSuccess()
        })
    })
  }
  const handleDelete=(row)=>{
    ElMessageBox.confirm(
      `确定删除${row.title}吗`,
      '确认',
      {
        confirmButtonText:'确认删除',
        cancelButtonText:'取消',
        type:'danger'
      }
    ).then(()=>{
        deleteArticle(row.id).then(()=>{
          ElMessage.success('删除成功')
          handleSuccess()
        })
    })
  }
</script>