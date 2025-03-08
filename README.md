# Voice Agent Caller App

A React Native mobile application that allows users to make automated phone calls through AI voice agents for various purposes like scheduling doctor appointments or contacting customer service - all managed through a monthly subscription model.

## Tech Stack

- **Frontend**: React Native, Expo, Tamagui (UI library)
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Voice API**: VAPI.ai for AI voice agent calls
- **State Management**: Zustand, TanStack React Query
- **Payments**: Stripe subscription model
- **DevOps**: Turbo (Monorepo), TypeScript
- **Validation**: Zod
- **Internationalization**: i18next, expo-localization
- **Navigation**: Solito (shared navigation between web/mobile)

## Project Structure

This is a monorepo using Turborepo:

- `apps/`
  - `mobile/` - Expo React Native app
  - `web/` - (Optional) Next.js web app using Solito for code sharing
- `packages/`
  - `shared/` - Shared utilities, types, and logic
  - `ui/` - Shared UI components with Tamagui
  - `api/` - API client for Supabase and VAPI
- `supabase/functions/` - Supabase Edge Functions

## Getting Started

### Prerequisites

- Node.js (>= 18)
- Yarn (>= 1.22)
- Expo CLI
- Supabase CLI
- Supabase Account
- Stripe Account
- VAPI.ai Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rirachii/voice-agent-caller-app.git
cd voice-agent-caller-app
```

2. Install dependencies:
```bash
yarn install
```

3. Create environment files:

```bash
# Root .env file for local development
cp .env.example .env

# Apps/mobile .env file
cp apps/mobile/.env.example apps/mobile/.env
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL migrations in `supabase/migrations/`
   - Enable Supabase Auth with email provider
   - Update the environment variables with your Supabase credentials

5. Set up Stripe:
   - Create a Stripe account
   - Set up subscription products and prices
   - Update the environment variables with your Stripe credentials

6. Set up VAPI:
   - Create a VAPI account
   - Create assistants and register phone numbers
   - Update the environment variables with your VAPI credentials

7. Start the development server:
```bash
yarn dev
```

8. Run the mobile app:
```bash
yarn workspace @voice-agent-caller/mobile ios
# or
yarn workspace @voice-agent-caller/mobile android
```

### Deploy Supabase Edge Functions

1. Link your local project to your Supabase project:
```bash
supabase link --project-ref your-project-ref
```

2. Deploy the edge functions:
```bash
supabase functions deploy
```

3. Set environment secrets for the functions:
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set VAPI_API_KEY=vapi_...
```

## Features

- User authentication and profile management
- Subscription plans with different call limits
- AI voice agent calling for various purposes
- Call history and transcript viewing
- Scheduling calls for future times
- Multiple language support

## Setting Up the Database

1. Create the required tables in Supabase:
   - subscription_plans
   - call_service_providers
   - call_queue
   - provider_availability
   - call_assignments
   - call_retries
   - provider_assistants
   - provider_phone_numbers
   - template_variables
   - call_templates
   - call_history
   - subscriptions

2. Enable Row-Level Security (RLS) policies:
   - Example for call_history: `auth.uid() = user_id`

## Stripe Integration

1. Create subscription products and prices in Stripe
2. Update the `subscription_plans` table with the Stripe price IDs
3. Set up Stripe webhooks to update subscription status

## VAPI Integration

1. Create assistants in VAPI
2. Register phone numbers
3. Update the database with the VAPI assistant IDs and phone numbers

## Development Workflow

1. Run `yarn dev` to start the development server
2. Make changes to the code
3. Test the changes on the mobile app
4. Deploy to production when ready

## License

MIT
