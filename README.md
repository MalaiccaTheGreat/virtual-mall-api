# Virtual Mall

A hybrid e-commerce platform built with PHP (Laravel), Python, and React.

## Project Structure

```
├── app/                 # Laravel application code
├── laravel-backend/     # Laravel backend components
├── public/              # Static files and assets
├── src/                 # React frontend source code
├── server/              # Python backend components
├── tests/               # Test files
├── composer.json        # PHP dependencies
├── package.json         # Node.js dependencies
└── requirements.txt     # Python dependencies
```

## Technology Stack

### Backend
- PHP 8.2+ with Laravel 12
- Python Flask (for specific microservices)
- Laravel Scout for search
- Laravel Cashier for payments

### Frontend
- React 18
- Vite for build tooling
- TailwindCSS for styling
- Inertia.js for Laravel integration

## Development Setup

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Python 3.8+
- Composer
- npm or yarn

### Installation

1. Install PHP dependencies:
   ```bash
   composer install
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment:
   ```bash
   cp .env.example .env
   ```

### Running the Application

1. Start Laravel development server:
   ```bash
   php artisan serve
   ```

2. Start React development server:
   ```bash
   npm run dev
   ```

3. Start Python services (if needed):
   ```bash
   python server/app.py
   ```
php artisan migrate
php artisan db:seed
```

## Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## Building for Production

Build the frontend and copy to Laravel public directory:

```bash
npm run build
```

## Deployment

1. Build the frontend:

```bash
npm run build
```

2. Deploy the Laravel backend:

```bash
cd laravel-backend
php artisan deploy
```

## Features

- 3D Virtual Assistant with facial expressions and animations
- Real-time chat using OpenAI's GPT-4
- Text-to-speech using ElevenLabs
- Product catalog with 3D models
- Shopping cart functionality
- User authentication
- Admin dashboard

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
