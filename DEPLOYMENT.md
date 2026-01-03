# Deployment Guide for SportsHub

## Overview

This project uses a split deployment strategy:
- **Frontend** (HTML, CSS, JS) → GitHub Pages (free)
- **Backend** (FastAPI + DynamoDB) → Your own server (EC2, Render, etc.)

---

## 📦 Frontend Deployment (Automatic via GitHub Actions)

### How It Works

When you push to the `main` branch, GitHub Actions will automatically:
1. Build the frontend files
2. Deploy to GitHub Pages
3. Your site will be live at: `https://<username>.github.io/<repo-name>/`

### First-Time Setup

1. **Enable GitHub Pages** in your repository:
   - Go to **Settings** → **Pages**
   - Under "Build and deployment", select **GitHub Actions**

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Add GitHub Actions deployment"
   git push origin main
   ```

3. **Check the deployment**:
   - Go to **Actions** tab in your repository
   - Watch the "Deploy Frontend to GitHub Pages" workflow run
   - Once complete, find your URL in the workflow summary

### Configure Backend API URL (Important!)

By default, the frontend expects the backend at `http://127.0.0.1:8000`. For production:

1. Go to **Settings** → **Secrets and variables** → **Actions** → **Variables**
2. Click **New repository variable**
3. Add:
   - **Name**: `BACKEND_API_URL`
   - **Value**: Your backend URL (e.g., `https://your-api.onrender.com` or `http://your-ec2-ip:8000`)

---

## 🖥️ Backend Deployment Options

### Option 1: AWS EC2 (Recommended for AWS users)

1. Launch an EC2 instance (t2.micro is free tier eligible)
2. Install Python 3.9+ and dependencies
3. Run the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   python3 main.py
   ```
4. Configure security group to allow port 8000
5. Set the EC2 public IP as your `BACKEND_API_URL`

### Option 2: Render (Free Tier Available)

1. Create account at [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables for AWS credentials
6. Use the Render URL as your `BACKEND_API_URL`

### Option 3: Railway (Simple Deployment)

1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Railway will auto-detect the Python backend
4. Add AWS credentials as environment variables

---

## 🔐 Environment Variables (Backend)

Your backend needs these environment variables in production:

| Variable | Description |
|----------|-------------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |
| `AWS_REGION` | AWS region (e.g., `us-east-1`) |

**⚠️ Never commit credentials to git!** Use environment variables or secrets management.

---

## 🔄 CORS Configuration

If your frontend and backend are on different domains, ensure CORS is configured in `backend/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourusername.github.io"],  # Your GitHub Pages URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📋 Deployment Checklist

- [ ] Enable GitHub Pages (Settings → Pages → GitHub Actions)
- [ ] Push code to main branch
- [ ] Verify frontend deployment in Actions tab
- [ ] Deploy backend to your chosen platform
- [ ] Set `BACKEND_API_URL` repository variable
- [ ] Configure CORS in backend for your GitHub Pages domain
- [ ] Test the live site!

---

## 🐛 Troubleshooting

### "Page not found" on GitHub Pages
- Make sure Pages is enabled with "GitHub Actions" as source
- Check the Actions tab for failed deployments

### API calls failing
- Check browser console for CORS errors
- Verify `BACKEND_API_URL` is set correctly
- Ensure backend is running and accessible

### AWS credentials error in backend
- Set environment variables on your hosting platform
- Don't use `aws_config.py` with hardcoded credentials in production
