
export const resolvePageComponent = (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    const page = pages[`./Pages/${name}.jsx`];
    
    if (!page) {
        throw new Error(`Page ${name} not found`);
    }
    
    return page.default;
};
