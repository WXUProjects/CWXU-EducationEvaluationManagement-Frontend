import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/element-plus-theme.css'

// MapleMono-CN 中文字体
import "@chinese-fonts/maple-mono-cn/dist/MapleMono-CN-Regular/result.css";

// FontAwesome 图标库
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faHome,
    faGear,
    faListCheck,
    faPeopleGroup,
    faChalkboardTeacher,
    faPerson,
    faRightFromBracket,
    faMagnifyingGlass,
    faClipboardQuestion,
    faArrowUp,
    faArrowDown
} from '@fortawesome/free-solid-svg-icons'

library.add({
    faHome,
    faGear,
    faListCheck,
    faPeopleGroup,
    faChalkboardTeacher,
    faPerson,
    faRightFromBracket,
    faMagnifyingGlass,
    faClipboardQuestion,
    faArrowUp,
    faArrowDown
})

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
