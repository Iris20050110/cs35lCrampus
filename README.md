# Crampus 
Crampus is a website that showcases various UCLA study spots, from the Hill to on campus, and even the off campus study spots in Westwood. It can be used by students looking for a certain study spot filtered by building type, outlet availability, and whether there's food nearby. The app prioritizes user engagement, with the ability to upload new study spots that others may not know about, and even leave reviews and ratings on certain spots. Students can also log in and use the built-in todo-list and assignment tracker, making the app great for planning a study crawl during finals.

## Tech Stack 

- **Frontend**: 
React.js, Tailwind CSS
- **Backend**: 
Node.js, Express
- **Database**: 
MongoDB Atlas
- **Authentication**: 
Passport.js with Google OAuth 2.0

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/crampus.git
cd crampus
```
### 2. Install dependencies 
```
npm install 
```

### 3. Configure your 'env' file 
```
MONGO_URI=your-mongodb-uri
PORT=5000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=your-callback-url
```

### 4. Start the backend and frontend 
```
cd client 
npm run dev
--------
cd server
npm start
```

### Log in 
Currently only UCLA students can log in; Crampus requires an active 'ucla.edu' account. 

### Features Roadmap 
* Interactive map view (ArcGIS or Google Maps)
* Save favorite spots
* Admin moderation tools
* Dark mode toggle


## Made with love by Bruins, for Bruins! 



