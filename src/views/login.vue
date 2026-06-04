<template>
  <div class="comtainer">
    <div class="title">
      <div class="back-home">
        <el-icon><Back/></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账号</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
        :model="formData"
        ref="ruleFormRef"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password></el-input>
        </el-form-item>
        <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)">登录</el-button>
        <div class="footer">
          <p>还没有账号？<router-link to="/auth/register">去注册</router-link></p>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import {ref,reactive} from 'vue'
import {login} from '@/api/admin'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'

const ruleFormRef=ref()
const router=useRouter()
const formData=reactive({
  username:'',
  password:''
})
const rules=ref({
  username:[
    {required:true,message:'请输入用户名',trigger:'blur'}
  ],
  password:[
    {required:true,message:'请输入密码',trigger:'blur'}
  ]
})
//登录
const submitForm=async (formEl)=>{
  if(!formEl)return  
  await formEl.validate((valid,fields)=>{
    if(valid){
      login(formData).then(data=>{
        if(!data.token){
          return console.log('登录失败')
        }
        //登录成功
        //将token存储到localStorage
        localStorage.setItem('token',data.token)
        //将用户信息存储到localStorage
        localStorage.setItem('userInfo',JSON.stringify(data.userInfo))
        if(data.userInfo.userType===2){
          router.push('/back')
        }else{
          router.push('/')
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  })
}
</script>
<style lang="scss" scoped>
.comtainer {
  width: 384px;
  .title{
    .back-home{
      margin-bottom:60px;
    }
    .title-text{
      text-align:center;
      h2{
        font-size:36px;
        margin-bottom: 10px;
      }
      p{
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container{
    margin-top: 30px;
    .btn{
      margin-top: 40px;
      width: 100%;
    }
    .footer{
      margin-top: 30px;
      text-align: center;
    }
  }
}
</style>
