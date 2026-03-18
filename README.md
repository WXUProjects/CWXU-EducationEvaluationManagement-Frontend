### 2026-3-18
- 创建项目
- 新增了 /src/utils（工具类）/src/components（组件） /src/views（页面）三个文件夹
- 引入了全局Toast插件，现在可以通过引用 /src/utils/toast.ts 类来使用，例如 Toast.info("这是一条信息")。支持info, success, warning, error四种类型。
- 使用 Fontawesome 图标库，使用详见 /src/components/NavigationBar.vue 和 main.ts
- 使用 Maple Mono CN 字体。