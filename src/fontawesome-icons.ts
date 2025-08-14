// Font Awesome icon configuration - only import icons that are actually used
import { library } from '@fortawesome/fontawesome-svg-core';

// Import only the specific solid icons used in the app
import {
  faCode,
  faMobileAlt,
  faCloud,
  faChartSimple,
  faShieldAlt,
  faUsers,
  faCrosshairs,
  faEye,
  faHeart,
  faShieldHalved,
  faLightbulb,
  faRocket,
  faPuzzlePiece,
  faCheck,
  faArrowRight,
  faComment,
  faComments,
  faExternalLinkAlt,
  faSpinner,
  faPaperPlane,
  faCheckCircle,
  faPhone,
  faEnvelope,
  faChevronDown,
  faChartLine,
  faStar,
  faMapMarkerAlt,
  faWandMagicSparkles,
  faArrowsUpDownLeftRight,
  faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons';

// Import only the specific brand icons used in the app
import {
  faReact,
  faVuejs,
  faNodeJs,
  faPython,
  faBootstrap,
  faWindows,
  faLinkedinIn,
  faTwitter,
  faGithub,
  faFacebookF,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

// Import only the specific regular icons used in the app
import {
  faStar as farStar,
} from '@fortawesome/free-regular-svg-icons';

// Add only the icons we actually use to the library
library.add(
  // Solid icons
  faCode,
  faMobileAlt,
  faCloud,
  faChartSimple,
  faShieldAlt,
  faUsers,
  faCrosshairs,
  faEye,
  faHeart,
  faShieldHalved,
  faLightbulb,
  faRocket,
  faPuzzlePiece,
  faCheck,
  faArrowRight,
  faComment,
  faComments,
  faExternalLinkAlt,
  faSpinner,
  faPaperPlane,
  faCheckCircle,
  faPhone,
  faEnvelope,
  faChevronDown,
  faChartLine,
  faStar,
  faMapMarkerAlt,
  faWandMagicSparkles,
  faArrowsUpDownLeftRight,
  faChalkboardTeacher,

  // Brand icons
  faReact,
  faVuejs,
  faNodeJs,
  faPython,
  faBootstrap,
  faWindows,
  faLinkedinIn,
  faTwitter,
  faGithub,
  faFacebookF,
  faInstagram,

  // Regular icons
  farStar,
);
