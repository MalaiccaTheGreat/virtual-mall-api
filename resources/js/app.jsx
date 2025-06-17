
import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from './resolvePageComponent';

const appName = import.meta.env.VITE_APP_NAME || 'Virtual Mall';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: resolvePageComponent,
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
