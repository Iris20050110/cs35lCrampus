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

### Prerequisites
Before you begin, make sure you have these installed:

Node.js (v18 or v20)

MongoDB running locally

```npm``` for package management


## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/CS35lCrampus.git
cd crampus
```
### 2. Install dependencies 
Install backend dependencies:
```
cd server
npm install 
```
Install frontend dependencies:
```
cd ../client
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

### 4. Start MongoDB
```
mongod
```

### 5. Start the backend and frontend 
```
cd client 
npm run dev
--------
cd server
npm start
```

### Log in 
Currently only UCLA students can log in to Crampus, given that it requires an active 'ucla.edu' account. 

### Diagram / Structure of Code
High Level Diagram (only shows relevent, manually coded parts)
```
├── client
│ ├── tailwind configuration files
│ ├── public
│ │ ├── fonts # used for yorkmade font
│ │ ├── crampuslogo.png # logo
│ │ ├── default-profile.png # deafult profile picture
│ └── src
│ ├── components/ # Reusable UI components
│ │ ├── AverageRating.jsx # compute the average rating of each spot card
│ │ ├── LoginRequired.jsx # component that warns the user that you must be logged in for different reasons
│ │ ├── NavBar.jsx # navigation bar
│ │ ├── NewReview.jsx # create a new review
│ │ ├── Review.jsx # review display / logic
│ │ ├── SearchBar.jsx # search for cards with text and tags
│ │ ├── SpotCard.jsx # create each spot card
│ │ └── TasksByDay.jsx # create the tasks for each day in the scheduler
│ │
│ ├── hooks
│ │ └── useAuth.js # custom hook to check if the user is logged in
│ │
│ ├── layout
│ ├── pages
│ │ ├── addSpotPage.jsx # form to create a spot
│ │ ├── assignmentPage.jsx # page to create a new assignment / to-do
│ │ ├── loginPage.jsx # page to log in
│ │ ├── mainPage.jsx # home page that displays spots
│ │ ├── MoreInformationPage.jsx # page that displays details for each spot
│ │ ├── profilePage.jsx # user profile page
│ │ ├── schedulePage.jsx # scheduler / calendar page
│ │ └── signUpPage.jsx # sign up for an account page
│ │
│ ├── App.jsx # route definitions
│ ├── index.css # CSS and Tailwind imports
│ └── main.jsx # react entry point (renders <App />)
│
├── server
│ ├── models
│ │ ├── Spot.js # define the mongoose model for a spot
│ │ ├── Todo.js # define the mongoose model for to-do tasks
│ │ └── User.js # define the mongoose model for user tasks
│ │
│ ├── routes
│ │ ├── google.js #routes for Google OAuth
│ │ ├── spots.js # REST methods for spot
│ │ ├── todos.js # REST methods for todos
│ │ └── user.js # routs for users
│ │
│ ├── uploads # temporarily stores files before using grdifs
│ │
│ ├── gridfs.js # gridfs setup for file‐streaming uploads
│ ├── index.js # express app entry point
│ └── package.json # dependencies & scripts
│
├── .gitignore # files to ignore in Git
```

### Future Features Roadmap 
* Interactive map view (ArcGIS or Google Maps)
* Save favorite spots
* Certificates for studying
* "study crawl" functionality
* Admin moderation tools
* Profile Badges and Frequently Visited
* Dark mode toggle




