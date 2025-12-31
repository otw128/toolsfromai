import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/html-formatter',
      name: 'html-formatter',
      component: () => import('../views/HtmlFormatterView.vue')
    },
    {
      path: '/mermaid-formatter',
      name: 'mermaid-formatter',
      component: () => import('../views/MermaidFormatterView.vue')
    },
    {
      path: '/mermaid-preview',
      name: 'mermaid-preview',
      component: () => import('../views/tools/md/preview/MermaidPreview.vue')
    },
    {
      path: '/tools/md/preview/cg',
      name: 'preview-cg',
      component: () => import('../views/tools/md/preview/PreviewCg.vue')
    },
    {
      path: '/tools/md/preview/gm',
      name: 'preview-gm',
      component: () => import('../views/tools/md/preview/PreviewGm.vue')
    },
    {
      path: '/tools/md/preview/qw',
      name: 'preview-qw',
      component: () => import('../views/tools/md/preview/PreviewQw.vue')
    },
    {
      path: '/tools/md/preview/yb',
      name: 'preview-yb',
      component: () => import('../views/tools/md/preview/PreviewYb.vue')
    }
  ]
})

export default router
