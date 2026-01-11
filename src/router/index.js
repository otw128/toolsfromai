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
    },
    {
      path: '/video-to-gif',
      name: 'video-to-gif',
      component: () => import('../views/tools/video/VideoToGifView.vue')
    },
    {
      path: '/tools/video/VideoToGif/VideoToGifCg.vue',
      name: 'video-to-gif-cg',
      component: () => import('../views/tools/video/VideoToGif/VideoToGifCg.vue')
    },
    {
      path: '/tools/video/VideoToGif/VideoToGifGm.vue',
      name: 'video-to-gif-gm',
      component: () => import('../views/tools/video/VideoToGif/VideoToGifGm.vue')
    },
    {
      path: '/tools/video/VideoToGif/VideoToGifQw.vue',
      name: 'video-to-gif-qw',
      component: () => import('../views/tools/video/VideoToGif/VideoToGifQw.vue')
    },
    {
      path: '/tools/video/VideoToGif/VideoToGifYb.vue',
      name: 'video-to-gif-yb',
      component: () => import('../views/tools/video/VideoToGif/VideoToGifYb.vue')
    },
    {
      path: '/function-to-chart',
      name: 'function-to-chart',
      component: () => import('../views/tools/math/functiontochart/FunctiontochartIndex.vue')
    },
    {
      path: '/qrcode-components',
      name: 'qrcode-components',
      component: () => import('../views/tools/utils/qrcode/ComponentList.vue')
    },
    {
      path: '/tools/utils/qrcode/QrcodeCg.vue',
      name: 'qrcode-cg',
      component: () => import('../views/tools/utils/qrcode/QrcodeCg.vue')
    },
    {
      path: '/tools/utils/qrcode/QrcodeGm.vue',
      name: 'qrcode-gm',
      component: () => import('../views/tools/utils/qrcode/QrcodeGm.vue')
    },
    {
      path: '/tools/utils/qrcode/QrcodeQw.vue',
      name: 'qrcode-qw',
      component: () => import('../views/tools/utils/qrcode/QrcodeQw.vue')
    },
    {
      path: '/tools/utils/qrcode/QrcodeYb.vue',
      name: 'qrcode-yb',
      component: () => import('../views/tools/utils/qrcode/QrcodeYb.vue')
    },
    {
      path: '/ymlformatter-components',
      name: 'ymlformatter-components',
      component: () => import('../views/tools/utils/ymlformatter/ComponentList.vue')
    },
    {
      path: '/tools/utils/ymlformatter/YmlformatterCg.vue',
      name: 'ymlformatter-cg',
      component: () => import('../views/tools/utils/ymlformatter/YmlformatterCg.vue')
    },
    {
      path: '/tools/utils/ymlformatter/YmlformatterGm.vue',
      name: 'ymlformatter-gm',
      component: () => import('../views/tools/utils/ymlformatter/YmlformatterGm.vue')
    },
    {
      path: '/tools/utils/ymlformatter/YmlformatterQw.vue',
      name: 'ymlformatter-qw',
      component: () => import('../views/tools/utils/ymlformatter/YmlformatterQw.vue')
    },
    {
      path: '/tools/utils/ymlformatter/YmlformatterYb.vue',
      name: 'ymlformatter-yb',
      component: () => import('../views/tools/utils/ymlformatter/YmlformatterYb.vue')
    },
    {
      path: '/lunarcalendar-components',
      name: 'lunarcalendar-components',
      component: () => import('../views/tools/utils/LunarCalendar/ComponentList.vue')
    },
    {
      path: '/tools/utils/LunarCalendar/LunarCalendarCg.vue',
      name: 'lunarcalendar-cg',
      component: () => import('../views/tools/utils/LunarCalendar/LunarCalendarCg.vue')
    },
    {
      path: '/tools/utils/LunarCalendar/LunarCalendarDb.vue',
      name: 'lunarcalendar-db',
      component: () => import('../views/tools/utils/LunarCalendar/LunarCalendarDb.vue')
    },
    {
      path: '/tools/utils/LunarCalendar/LunarCalendarGm.vue',
      name: 'lunarcalendar-gm',
      component: () => import('../views/tools/utils/LunarCalendar/LunarCalendarGm.vue')
    },
    {
      path: '/tools/utils/LunarCalendar/LunarCalendarQw.vue',
      name: 'lunarcalendar-qw',
      component: () => import('../views/tools/utils/LunarCalendar/LunarCalendarQw.vue')
    },
    {
      path: '/tools/utils/LunarCalendar/LunarCalendarYb.vue',
      name: 'lunarcalendar-yb',
      component: () => import('../views/tools/utils/LunarCalendar/LunarCalendarYb.vue')
    }
  ]
})

export default router
