import { lazy } from 'react';

const pages = {
    Welcome: () => import('./Pages/Welcome'),
    Home: () => import('./Pages/Home'),
    Cart: () => import('./Pages/Cart'),
    ProductDetail: () => import('./Pages/ProductDetail'),
    Search: () => import('./Pages/Search'),
    Checkout: () => import('./Pages/Checkout'),
    VirtualAssistant: () => import('./Pages/VirtualAssistant'),
    Login: () => import('./Pages/Auth/Login'),
    Register: () => import('./Pages/Auth/Register'),
};

export function resolvePageComponent(name, props) {
    const page = pages[name];
    if (!page) {
        throw new Error(`Page component ${name} not found`);
    }
    return page(props);
}
