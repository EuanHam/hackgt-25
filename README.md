# HackGT 25

A full-stack web application built with React, TypeScript, and Vite.

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

# Setup will be added here
```

## 🛠️ Available Scripts

### Client Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## 🧪 Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting

### Backend
- To be determined

## 📦 Dependencies

See `client/package.json` for the complete list of frontend dependencies.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## running the fastapi server

requirements:
annotated-types==0.7.0
anyio==4.11.0
cachetools==5.5.2
certifi==2025.8.3
charset-normalizer==3.4.3
click==8.3.0
fastapi==0.117.1
google-api-core==2.25.1
google-api-python-client==2.183.0
google-auth==2.40.3
google-auth-httplib2==0.2.0
google-auth-oauthlib==1.2.2
googleapis-common-protos==1.70.0
h11==0.16.0
httplib2==0.31.0
idna==3.10
oauthlib==3.3.1
proto-plus==1.26.1
protobuf==6.32.1
pyasn1==0.6.1
pyasn1_modules==0.4.2
pydantic==2.11.9
pydantic_core==2.33.2
pyparsing==3.2.5
requests==2.32.5
requests-oauthlib==2.0.0
rsa==4.9.1
sniffio==1.3.1
starlette==0.48.0
typing-inspection==0.4.1
typing_extensions==4.15.0
uritemplate==4.2.0
urllib3==2.5.0
uvicorn==0.37.0

running: uvicorn main:app --reload
