# Note App
A full-stack note-taking application with user authentication and email OTP verification.
## Features
- User registration and login with OTP verification via email
- Create, read and delete notes
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
- MongoDB with Mongoose ODM
- JWT for authentication
- Nodemailer for sending emails
## Prerequisites
Before running this application, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (either locally or a cloud instance like MongoDB Atlas)
- An email account (Gmail recommended) for sending OTPs
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
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=2d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
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
   - You will receive an OTP via email. Enter the OTP to verify your account.
2. **Login**:
   - After verification, log in with your email and password.
3. **Notes**:
   - Once logged in, you can create, view and delete your notes.

## Scripts
### Backend Scripts
- `npm run dev`: Starts the backend server in development mode with nodemon.
### Frontend Scripts
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build.
## Environment Variables
### Backend (.env)
- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for signing JWT tokens.
- `JWT_EXPIRE`: Expiration time for JWT tokens (e.g., 2d, 7h).
- `EMAIL_HOST`: SMTP server host (e.g., smtp.gmail.com).
- `EMAIL_PORT`: SMTP server port (e.g., 587).
- `EMAIL_USER`: Your email address.
- `EMAIL_PASS`: App password for your email account.
### Frontend (.env)
- `VITE_BASE_URL`: Base URL of your backend API.
## Troubleshooting
- **Email not sending**: Ensure that you have enabled less secure apps or generated an App Password for your Gmail account.
- **Connection to MongoDB fails**: Check your MongoDB connection string and ensure your database is running.
- **Environment variables not loading**: Make sure you have renamed `example.env` to `.env` in both frontend and backend.

## Contact


## Contact 

For any inquiries or questions,please react out: 
- [Gmail](mailto:lunasuthar5221@gmail.com)
- [Linkedin](https://www.linkedin.com/in/lunaramsuthar/)