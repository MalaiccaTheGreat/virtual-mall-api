import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/inertia-vue3'
import { InertiaProgress } from '@inertiajs/progress'
import ProductModal from '@/Components/ProductModal.vue'

// Lazy-load all Vue pages for code-splitting
const pages = import.meta.glob('./Pages/**/*.vue')

createInertiaApp({
  // Optionally set a dynamic document title
  title: (title) => (title ? `${title} • MyApp` : 'MyApp'),

  // Resolve each page via the glob map
  resolve: (name) => {
    const importer = pages[`./Pages/${name}.vue`]

    if (!importer) {
      throw new Error(`Unknown page component: ./Pages/${name}.vue`)
    }

    return importer().then((module) => module.default)
  },

  setup({ el, App, props, plugin }) {
    const app = createApp({ render: () => h(App, props) })

    // Register global components
    app.component('ProductModal', ProductModal)

    // Install Inertia plugin
    app.use(plugin)

    // Optional: Progress bar on navigation
    InertiaProgress.init({
      color: '#29d',
      showSpinner: false,
    })

    // Mount the Vue application
    app.mount(el)
  },
})