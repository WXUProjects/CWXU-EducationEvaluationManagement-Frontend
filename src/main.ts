import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ToastPlugin from './plugins/toast'

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
    faRightFromBracket
} from '@fortawesome/free-solid-svg-icons'

library.add({
    faHome,
    faGear,
    faListCheck,
    faPeopleGroup,
    faChalkboardTeacher,
    faPerson,
    faRightFromBracket
})

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(ToastPlugin)

app.mount('#app')
