# Sports Selection Application

A modern web application that allows users to select and follow their favorite sports teams and countries, with real-time schedule tracking and match notifications.

## Features

- **Landing Page**: Three visually stunning sport boxes (Football, Cricket, F1) with smooth animations
- **Selection Page**: Dynamic country/team selection interface based on chosen sport
- **User Authentication**: AWS Cognito integration for secure user registration and login
- **Dashboard**: View favorite teams, schedules, and saved matches
- **Schedule Tracking**: Real-time match status (Scheduled, Live, Completed) based on current date/time
- **Match Management**: Save matches, set notifications, and view calendar
- **Beautiful Design**: Modern gradient backgrounds, glassmorphism effects, and smooth transitions
- **Responsive**: Fully responsive design that works on all devices

## Project Structure

```
Project_1/
├── index.html              # Main landing page with sport boxes
├── selection.html          # Selection page for countries/teams
├── login.html              # User authentication page
├── dashboard.html          # User dashboard with schedules and matches
├── css/
│   ├── style.css          # Main stylesheet
│   ├── selection.css      # Selection page styles
│   ├── login.css          # Login page styles
│   └── dashboard.css      # Dashboard styles
├── js/
│   ├── main.js            # Landing page logic
│   ├── selection.js       # Selection page logic
│   ├── auth.js            # AWS Cognito authentication
│   ├── api.js             # FastAPI backend integration
│   ├── dashboard.js       # Dashboard logic
│   ├── scheduleLoader.js  # Schedule loading from JSON files
│   ├── matches.js         # Match generation and management
│   ├── matchForm.js       # Match form handling
│   ├── calendar.js        # Calendar view
│   ├── notifications.js   # Browser notifications
│   └── config.js          # AWS Cognito configuration
├── backend/
│   ├── main.py            # FastAPI backend server
│   ├── requirements.txt   # Python dependencies
│   ├── start.sh           # Server startup script
│   └── stop.sh            # Server stop script
├── Schedules/
│   └── Cricket/
│       └── International/
│           └── India/
│               └── India_Internation.json  # Schedule data
└── README.md              # Project documentation
```

## Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
./start.sh
# Or: python3 main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Configure AWS Cognito in `js/config.js`:
   - Update `region` with your AWS region
   - Update `userPoolId` with your Cognito User Pool ID
   - Update `clientId` with your Cognito App Client ID

2. Open `index.html` in a web browser (or access via `http://localhost:8000` if backend is running)

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: FastAPI (Python)
- **Authentication**: AWS Cognito
- **Storage**: FastAPI in-memory storage (can be upgraded to database)

## Features

- User registration and login with AWS Cognito
- Sport and team selection with temporary storage for non-logged-in users
- Automatic migration of selections after signup/login
- Real-time schedule loading from JSON files
- Match status calculation (Scheduled/Live/Completed)
- Match saving and management
- Browser notifications for match reminders
- Calendar and list views for matches

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Important: Running the Application

**The application MUST be run through the backend server** to work properly. Do not open the HTML files directly in your browser.

### Quick Start

1. Install dependencies:
```bash
cd backend
pip3 install -r requirements.txt
```

2. Start the server:
```bash
cd backend
./start.sh
# Or: python3 main.py
```

3. Access the application:
- Open your browser and go to `http://localhost:8000`
- Or go directly to the dashboard: `http://localhost:8000/dashboard.html`

4. Stop the server when done:
```bash
cd backend
./stop.sh
```

## Troubleshooting

### Schedule not loading for selected teams

**Issue**: When you select a team (e.g., India - International), the schedule shows "No schedules available" even though the JSON file exists.

**Solution**:
1. Make sure the backend server is running (`cd backend && ./start.sh`)
2. Access the application via `http://localhost:8000` (NOT by opening HTML files directly)
3. Check browser console for any errors
4. Verify the schedule JSON file exists in the correct directory structure:
   - Example: `Schedules/Cricket/International/India/India_Internation.json`

### Backend server not starting

**Issue**: Server fails to start with "No module named uvicorn" or similar errors.

**Solution**:
```bash
cd backend
pip3 install -r requirements.txt
python3 main.py
```

## Notes

- Images are loaded from Unsplash CDN
- Schedules are loaded from JSON files in the `Schedules/` directory
- Match status is calculated based on current date/time
- Browser notifications require user permission
- The backend server must be running for schedule loading to work

