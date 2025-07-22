import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCode,
  faMobile,
  faMobileScreenButton,
  faCloud,
  faChartColumn,
  faChartLine,
  faShieldHalved,
  faHandshake,
  faBullseye,
  faEye,
  faCheckCircle,
  faHeart,
  faLightbulb,
  faUsers,
  faExternalLinkAlt,
  faRocket,
  faPaperPlane,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faChevronDown,
  faStar,
  faCheck,
  faComment
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
  faGithub,
  faReact,
  faVuejs,
  faNodeJs,
  faPython,
  faAws,
  faDocker
} from '@fortawesome/free-brands-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import App from './App.vue'
import router from './router'

// Add icons to the library
library.add(
  faCode,
  faMobile,
  faMobileScreenButton,
  faCloud,
  faChartColumn,
  faChartLine,
  faShieldHalved,
  faHandshake,
  faBullseye,
  faEye,
  faCheckCircle,
  faHeart,
  faLightbulb,
  faUsers,
  faExternalLinkAlt,
  faRocket,
  faPaperPlane,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faChevronDown,
  faStar,
  faCheck,
  faComment,
  farStar,
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
  faGithub,
  faReact,
  faVuejs,
  faNodeJs,
  faPython,
  faAws,
  faDocker
)

const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)

app.mount('#app')
