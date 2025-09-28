# ✨ HackGT-XII: OneBoard - One place for everything ✨

A full-stack web application built with React, TypeScript, Vite (Frontend) & FastAPI, Python (backend) with OpenAI feature.

### Project Contributers: Eileen Chen, Tiberius Colina, Euan Ham, Annabelle Lee

## 📁 Project Structure

```
hackgt-25/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Backend server
├── README.md        # Project documentation
└── .gitignore       # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- pip

### Frontend Setup (Client)
The frontend is a React application built with Vite and TypeScript.

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will be available at `http://localhost:5173`

### Backend Setup (Server)

```bash
# Navigate to server directory
cd server

# install all requirements
pip install -r requirements.txt
```

## Add Authentication Tokens
create a .env inside the **server** folder
   ```bash
   # Navigate to server directory
   cd server

   # add auth tokens
   GROUPME_ACCESS_TOKEN="YOUR ACCESS TOKEN"
   OPENAPI_API_KEY="YOUR ACCESS TOKEN"
   curr = "YOUR ACCESS TOKEN"
   ```

## 🧪 Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting

### Backend
- **FastAPI** ⏩
- **Python** 🐍

## 📦 Dependencies

See `client/package.json` for the complete list of frontend dependencies.

## running the fastapi server
```bash
uvicorn main:app
````

