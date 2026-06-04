import { createRouter, createWebHistory } from "vue-router";
import BackendLayout from '@/components/BackendLayout.vue'
import dashboard from '@/views/dashboard.vue'
import Knowledge from '@/views/Knowledge.vue'
import Consultations from '@/views/Consultations.vue'
import Emotional from '@/views/Emotional.vue'
import AuthLayout from "@/components/AuthLayout.vue";
import Login from "@/views/login.vue";
import Register from "@/views/register.vue";
import FrontendLayout from "@/components/FrontendLayout.vue"


const frontendRoutes = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/home.vue')
      },
      {
        path: 'consultation',
        component: () => import('@/views/consultation.vue')
      },
      {
        path: 'emotion-diary',
        component: () => import('@/views/emotionDiary.vue')
      },
      {
        path: 'knowledge',
        component: () => import('@/views/frontendKnowledge.vue')
      },
      {
        path: 'knowledge/article/:id',
        component: () => import('@/views/articleDetail.vue'),
        props: true
      }
    ]
  }
]


const back = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: '/back/dashboard',
        component: dashboard,
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      }, {
        path: '/back/knowledge',
        component: Knowledge,
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      }, {
        path: '/back/consultations',
        component: Consultations,
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      }, {
        path: '/back/emotional',
        component: Emotional,
        meta: {
          title: '情感分析',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: '/auth/login',
        component: Login,
        meta: {
          title: '登录',
        }
      },
      {
        path: '/auth/register',
        component: Register,
        meta: {
          title: '注册',
        }
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes: [...back, ...frontendRoutes]
})

//路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  //判断是否登录了
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo.userType == 2) {
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dashboard')
      }
    } else if (userInfo.userType == 1) {
      //用户端
      if (to.path.startsWith('/auth') || to.path.startsWith('/back')) {
        next('/')
      } else {
        next()
      }
    }
  } else {
    if (to.path.startsWith('/back')) {
      next('/auth/login')
    } else {
      next()
    }
  }
})


export default router