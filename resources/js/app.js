import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from './resolvePageComponent';

createInertiaApp({
    resolve: resolvePageComponent,
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(App({ ...props }));
    },
});
