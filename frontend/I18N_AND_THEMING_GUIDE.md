# Internationalization (i18n) and Theming Guide

This guide provides an overview of the internationalization and theming features implemented in the Pulse & Threads e-commerce application.

## Table of Contents
- [Internationalization (i18n)](#internationalization-i18n)
  - [Supported Languages](#supported-languages)
  - [Adding New Languages](#adding-new-languages)
  - [Using Translations](#using-translations)
- [Theming](#theming)
  - [Color Modes](#color-modes)
  - [Customizing Colors](#customizing-colors)
  - [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Best Practices](#best-practices)

## Internationalization (i18n)

The application uses `i18next` and `react-i18next` for internationalization, supporting multiple languages and RTL (Right-to-Left) layouts.

### Supported Languages

- English (en) - Default
- Spanish (es)
- French (fr)
- Chinese (zh)
- Arabic (ar) - RTL support

### Adding New Languages

1. Create a new translation file in `src/i18n/locales/{languageCode}/translation.json`
2. Add the language to the `resources` object in `src/i18n/i18n.ts`
3. Update the language selector component if needed

Example for adding German (de):

```typescript
// In i18n.ts
import deTranslation from './locales/de/translation.json';

// In the i18n config
resources: {
  de: {
    translation: deTranslation,
  },
  // ... other languages
}
```

### Using Translations

Use the `useTranslation` hook in your components:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.subtitle', { name: 'User' })}</p>
    </div>
  );
}
```

## Theming

The application uses Tailwind CSS with a custom theme configuration that supports light and dark modes.

### Color Modes

- **Light Mode**: Default theme
- **Dark Mode**: Activated via the theme toggle in the header
- **System Preference**: Automatically follows the user's system preference

### Customizing Colors

Edit the `tailwind.config.js` file to modify the color palette:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: colors.blue[600],
        light: colors.blue[500],
        dark: colors.blue[700],
        foreground: colors.white,
      },
      // ... other colors
    },
  },
},
```

### Responsive Design

Use Tailwind's responsive prefixes to create responsive layouts:

```jsx
<div className="flex flex-col md:flex-row">
  <div className="w-full md:w-1/2">Left Column</div>
  <div className="w-full md:w-1/2">Right Column</div>
</div>
```

## Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Color Contrast**: Meets WCAG 2.1 AA contrast ratios
- **ARIA Labels**: Used for screen readers
- **Focus Management**: Proper focus handling for modals and dialogs

## Best Practices

1. **Translation Keys**: Use nested objects for better organization (e.g., `header.title`, `footer.copyright`)
2. **Component Structure**: Keep components small and focused
3. **Performance**: Use code splitting for routes
4. **Testing**: Test with different languages and RTL layouts
5. **Documentation**: Keep translations and components well-documented

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

This project is licensed under the MIT License.
