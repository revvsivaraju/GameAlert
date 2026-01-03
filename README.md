# 🏆 GameAlert - Sports Selection Application

A modern web application that allows users to select and follow their favorite sports teams and countries, with real-time schedule tracking and match notifications.

![Status](https://img.shields.io/badge/status-live-brightgreen)
![Backend](https://img.shields.io/badge/backend-AWS%20EC2-orange)
![Frontend](https://img.shields.io/badge/frontend-GitHub%20Pages-blue)

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [GitHub Pages](https://revvsivaraju.github.io/GameAlert/) |
| **Backend API** | `http://98.80.214.119:8000` |
| **API Docs** | [Swagger UI](http://98.80.214.119:8000/docs) |
| **Health Check** | [/health](http://98.80.214.119:8000/health) |

## ✨ Features

- **Landing Page**: Three visually stunning sport boxes (Football, Cricket, F1) with smooth animations
- **Selection Page**: Dynamic country/team selection interface based on chosen sport
- **User Authentication**: AWS Cognito integration for secure user registration and login
- **Dashboard**: View favorite teams, schedules, and saved matches
- **Schedule Tracking**: Real-time match status (Scheduled, Live, Completed) based on current date/time
- **Match Management**: Save matches, set notifications, and view calendar
- **Beautiful Design**: Modern gradient backgrounds, glassmorphism effects, and smooth transitions
- **Responsive**: Fully responsive design that works on all devices

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GitHub Pages  │────▶│   AWS EC2       │────▶│   DynamoDB      │
│   (Frontend)    │     │   (FastAPI)     │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 📁 Project Structure

```
GameAlert/
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
│   ├── dynamodb_manager.py # DynamoDB operations
│   ├── aws_config.py      # AWS configuration
│   ├── requirements.txt   # Python dependencies
│   ├── start.sh           # Server startup script
│   └── stop.sh            # Server stop script
├── Schedules/             # Sports schedule JSON files
│   ├── Cricket/
│   ├── Football/
│   └── F1/
└── .github/
    └── workflows/
        └── deploy-frontend.yml  # GitHub Actions for frontend deployment
```

## 🚀 Deployment

### Frontend (GitHub Pages - Automatic)

The frontend is automatically deployed via GitHub Actions when you push to the `main` branch.

### Backend (AWS EC2)

The backend is deployed on AWS EC2 and runs as a systemd service.

**Server Details:**
- **Instance**: t2.micro (Free Tier)
- **OS**: Amazon Linux 2023
- **IP**: `98.80.214.119`
- **Port**: `8000`

**Useful Commands (SSH into EC2 first):**
```bash
# Check status
sudo systemctl status sportshub

# View logs
sudo journalctl -u sportshub -f

# Restart after code changes
cd ~/GameAlert && git pull
sudo systemctl restart sportshub

# Stop service
sudo systemctl stop sportshub
```

## 🛠️ Local Development

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

3. Set AWS credentials:
```bash
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_REGION="us-east-1"
```

4. Install dependencies and run:
```bash
pip install -r requirements.txt
python3 main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Configure AWS Cognito in `js/config.js`
2. Update `API_BASE_URL` in `js/api.js` to point to your backend
3. Open `index.html` in a browser or use a local server

## 🔧 Technologies

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | FastAPI (Python 3.11) |
| **Database** | AWS DynamoDB |
| **Authentication** | AWS Cognito |
| **Hosting (Frontend)** | GitHub Pages |
| **Hosting (Backend)** | AWS EC2 |
| **CI/CD** | GitHub Actions |

## 📱 Browser Support

Works on all modern browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🔐 Environment Variables

The backend requires these environment variables:

| Variable | Description |
|----------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |
| `AWS_REGION` | AWS region (e.g., `us-east-1`) |

## 📝 License

MIT License - feel free to use this project for learning and development!

---

Made with ❤️ by [revvsivaraju](https://github.com/revvsivaraju)
