<template>  
  <div>
    <PageHead title="情感分析"/>
    <TableSeach :formItem="formItem" @search="handleSearch"/>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="用户ID" width="80"/>
      <el-table-column label="会话ID" width="80">
        <template #default="scope">
          <!-- //头像 -->
          <el-avatar> {{ scope.row.nickname}}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="diaryDate" label="记录日期" width="120"/>
      <el-table-column label="情绪评分">
        <template #default="scope">
          <el-rate :model-value="scope.row.moodScore" :max="10" disabled />
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="120">
        <template #default="scope">
          <div>
            <p>睡眠：{{ scope.row.sleepQuality }}/5</p>
            <p>压力：{{ scope.row.stressLevel }}/5</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="120"/>
      <el-table-column prop="diaryContent" label="日记内容" width="220"/>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button @click="viewSessiondetail(scope.row)" text type="primary">详情</el-button>
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
    <el-dialog
    v-model="detailDialogVisible"
    title="情绪日志详细"
    width="800px"
    :close-on-click-modal="false"
    >
      <div class="detail-content" v-if="detailDialogVisible">
        <div class="detail-section">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ currentDetail.usename }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{ currentDetail.nickname }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{ currentDetail.id }}</el-descriptions-item>
            <el-descriptions-item label="记录日志">{{ currentDetail.diaryDate }}</el-descriptions-item>
          </el-descriptions>
        </div>
          <div class="detail-section">
          <h4>情绪状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <el-rate :model-value="currentDetail.moodScore" :max="10" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getEmotionTagType(currentDetail.dominantEmotion)">{{ currentDetail.dominantEmotion||'-' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="睡眠质量">{{ currentDetail.sleepQuality ||'-'}}/5</el-descriptions-item>
            <el-descriptions-item label="压力水平">{{ currentDetail.stressLevel ||'-'}}/5</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>日记内容</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="情绪触发因素">{{ currentDetail.diaryContentPreview ||'无' }}</el-descriptions-item>
            <el-descriptions-item label="日记内容">{{ currentDetail.diaryContent ||'无' }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>AI情绪分析结果</h4>
          <div class="ai-analysis-result">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="主要情绪">
                <el-tag :type="getAiEmotionTagType(aiDeta.primaryEmotion)">{{ aiDeta.primaryEmotion}}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪强度">
                <el-progress 
                :percentage="aiDeta.emotionScore" 
                :color="getEmotionScoreColor(aiDeta.emotionScore)"
                :stroke-width="8">
                </el-progress>
              </el-descriptions-item>
              <el-descriptions-item label="风险等级">
                <el-tag :type="getRiskLevelTagType(aiDeta.riskLevel)">{{ getRiskLevelText(aiDeta.riskLevel) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪性质">
                <el-tag :type="aiDeta.idNegative?'danger':'success'">{{ aiDeta.idNegative?'负向情绪':'正向情绪' }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <div class="ai-suggestion-section">
              <h5>专业建议</h5>
              <div class="suggestion-content">{{ aiDeta.suggestion||'无' }}</div>
            </div>
            <div class="ai-risk-section">
              <h5>风险描述</h5>
              <div class="risk-content">{{ aiDeta.riskDescription||'无' }}</div>
            </div>
            <div class="ai-improvements-section">
              <h5>改进措施</h5>
              <ul class="improvements-list">
                <li v-for="item in aiDeta.improvementSuggestions" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>       
        </div>
        <div class="detail-section">
          <h4>时间信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">{{ currentDetail.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="分析时间">{{ currentDetail.updatedAt }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import PageHead from '@/components/PageHead.vue'
  import TableSeach from '@/components/TableSeach.vue'
  import { reactive ,ref ,onMounted} from 'vue'
  import { getEmotionalPage } from '@/api/admin'
  import {ElMessageBox} from 'element-plus'
  import { deleteEmotional } from '@/api/admin'


  const handleChange=(page)=>{
    pagination.currentPage=page
    handleSearch()
  }

  const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}

  const formItem=[
    {comp:'input' ,prop:'userId' ,label:'用户名' ,placeholder:'请输入用户名'},
    {comp:'select' ,prop:'moodScreRange' ,label:'情绪评分' ,placeholder:'请选择评分范围',options:[
      {
        label:'低分(1-3)',
        value:'1-3'
      },
      {
        label:'中分(4-6)',
        value:'4-6'
      },
      {
        label:'高分(7-10)',
        value:'7-10'
      }
    ]}
  ]
 
  const tableData = ref([])
  
  const pagination = reactive({
    curentPage:1,
    size:10,
    total:0
  })

  const handleSearch=async(formData)=>{
    const {records,total} = await getEmotionalPage({
      ...formData,
      ...pagination
    })
    pagination.total = total
    tableData.value = records
  }

  onMounted(()=>{
    handleSearch()
  })

  //删除
  const handleDelete=(row)=>{
    ElMessageBox.confirm('确定删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }).then(() => {
      deleteEmotional(row.id).then(()=>{
        handleSearch()
      })
    })
  }


  //详情弹窗
  const detailDialogVisible=ref(false)
  const currentDetail=ref(null)
  const aiDeta=ref(null)
  const viewSessiondetail=(row)=>{
    if(row.aiEmotionAnalysis){
      aiDeta.value= JSON.parse(row.aiEmotionAnalysis)
    }else{
      aiDeta.value={}
    }
    currentDetail.value=row
    detailDialogVisible.value=true
  }
</script>
<style lang="scss" scoped>
.detail-content {
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>
