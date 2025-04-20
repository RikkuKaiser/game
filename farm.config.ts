import { defineConfig } from '@farmfe/core'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  vitePlugins: [
    vue(),
    copy({
      targets: [
        { src: 'public/*', dest: 'dist' }
      ],
      hook: 'buildEnd'
    }) as any // 👈 porque Farm aún no reconoce bien los tipos de este plugin
  ]
})
