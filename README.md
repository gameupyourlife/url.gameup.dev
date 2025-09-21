# URL Shortener

A modern, full-featured URL shortener built with Next.js, Supabase, and shadcn/ui components.

## Features

- 🔗 **URL Shortening**: Create short, memorable links from long URLs
- 👤 **User Authentication**: Secure sign-up/sign-in with email and Google OAuth
- 📊 **Analytics Dashboard**: Track clicks and manage your URLs
- 🎨 **Modern UI**: Beautiful, responsive design with shadcn/ui components
- ⚡ **Real-time Updates**: Live analytics and URL management
- 🔒 **Secure**: Row-level security with Supabase
- 📱 **Mobile Friendly**: Fully responsive design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd url.gameup.dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL from `database.sql` in your Supabase SQL editor

4. **Configure environment variables**
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

The `database.sql` file contains all the necessary SQL to set up your database:

- **Tables**: `profiles` and `urls`
- **Row Level Security (RLS)**: Secure access policies
- **Triggers**: Automatic profile creation and timestamp updates
- **Indexes**: Optimized queries

Run this SQL in your Supabase SQL editor before using the application.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your project in Vercel
3. Add your environment variables in the Vercel dashboard
4. Update `NEXT_PUBLIC_BASE_URL` to your production domain
5. Deploy!

### Other Platforms

This Next.js app can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Digital Ocean
- AWS
- Google Cloud

## Usage

### For Anonymous Users
- Create shortened URLs without registration
- Basic URL shortening functionality
- No analytics or management features

### For Registered Users
- Full dashboard with analytics
- URL management (edit, delete, activate/deactivate)
- Custom short codes
- Title and description for URLs
- Click tracking and statistics

## API Endpoints

- `POST /api/shorten` - Create a shortened URL
- `GET /[shortCode]` - Redirect to original URL (increments click count)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you have any questions or need help, please create an issue in the repository.

## Acknowledgments

- [Next.js](https://nextjs.org) for the amazing React framework
- [Supabase](https://supabase.com) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the styling system
