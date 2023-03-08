import { createApp } from 'vue'
import { Quasar } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import './registerServiceWorker'

const app = createApp(App)

app.use(router).use(Quasar, {
    config: {},
    plugins: {}
})

app.mount('#app')
