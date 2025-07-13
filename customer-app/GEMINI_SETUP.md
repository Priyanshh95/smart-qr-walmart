# Gemini API Setup for Ways to Recycle Feature

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Setting Up the API Key

1. Open the `.env` file in the root of the customer-app directory
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## How the Feature Works

The "Ways to Recycle" page allows users to:
- Search for any item (e.g., "plastic bottles", "old clothes", "cardboard")
- Get AI-powered recycling suggestions from Google's Gemini model
- View detailed recycling methods, creative reuse ideas, and environmental benefits
- See step-by-step instructions and safety considerations

## Features

- **Smart Search**: Enter any item to get recycling suggestions
- **Detailed Responses**: AI provides comprehensive recycling and upcycling ideas
- **Formatted Results**: Responses are formatted with bullet points and sections
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Graceful error messages for API issues
- **Recycling Tips**: Built-in tips section for general recycling guidance

## Security

- API key is stored in `.env` file (already added to `.gitignore`)
- Environment variables are properly configured in `app.json`
- No API keys are committed to version control

## Testing

1. Start the app: `npm start`
2. Navigate to the home page
3. Tap "Ways to Recycle"
4. Enter an item (e.g., "plastic bottles")
5. Tap "Search" to get AI-powered recycling suggestions

## Troubleshooting

- If you see "API Key Missing" error, make sure your `.env` file has the correct API key
- If API calls fail, check your internet connection and API key validity
- The app will show helpful error messages for common issues 