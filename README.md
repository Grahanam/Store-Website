# Store App
A full-stack store Rating application with Role based authentication.
## Features
- User registration and login
- Admin,ShopOwner,User
- Users rate shop.
- Secure user authentication using JWT

## Tech Stack
### Frontend
- React
- Material-UI (MUI) for components
- Tailwind CSS for styling
- Vite as build tool
### Backend
- Node.js
- Express.js
- MySql
- JWT for authentication

## Prerequisites
Before running this application, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (either locally or a cloud instance)

## Installation
### Backend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd note-app/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Configuration:
   - Rename `example.env` to `.env`
   - Update the following variables in the `.env` file:
   ```bash
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=2d
   DB_HOST=localhost
   DB_NAME=database_name
   DB_USER=root
   DB_PASS=your_app_password
   ```
   **Note:** For Gmail, you need to generate an App Password. Enable 2-step verification for your Google account, then generate an App Password for this application.
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000` by default.
### Frontend Setup
1. Navigate to the frontend directory (root of the project):
   ```bash
   cd note-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Configuration:
   - Rename `example.env` to `.env`
   - Update the following variable in the `.env` file:
   ```bash
   VITE_BASE_URL=http://localhost:5000
   ```
   Replace the URL with your backend server's URL if it's different.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` by default.
## Usage
1. **Registration**: 
   - Open the application and sign up with your email.
2. **Login**:
   - After registration,log in with your email and password.
3. **Notes**:
   - Once logged in, you can rate shops.

## Scripts
### Backend Scripts
- `npm run dev`: Starts the backend server in development mode with nodemon.
### Frontend Scripts
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build.
## Environment Variables
### Backend (.env)
- `JWT_SECRET`: Secret key for signing JWT tokens.
- `JWT_EXPIRE`: Expiration time for JWT tokens (e.g., 2d, 7h).
- `DB_HOST`: Database hostname
- `DB_NAME`: Database name
- `DB_USER`: Database user name
- `DB_PASS`: Database password
### Frontend (.env)
- `VITE_BASE_URL`: Base URL of your backend API.

## Contact 

For any inquiries or questions,please react out: 
- [Gmail](mailto:lunasuthar5221@gmail.com)
- [Linkedin](https://www.linkedin.com/in/lunaramsuthar/)