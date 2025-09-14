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

### Database 
```bash
// To create Tables in MySql:
CREATE TABLE users(
   id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
   name VARCHAR(100) NOT NULL,
   email VARCHAR(150) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   address TEXT,
   role ENUM('admin','owner','user')DEFAULT 'user',
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings(
   id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
   store_id CHAR(36) NOT NULL,
   owner_id CHAR(36) NOT NULL,
   user_id CHAR(36) NOT NULL,
   rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
   FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
   UNIQUE KEY unique_rating (store_id, user_id)
);

CREATE TABLE stores (
    id CHAR(36) PRIMARY KEY DEFAULT(UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id CHAR(36) NOT NULL,
    average_rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

// To create admin account use following code:
  
  const hashedPassword = await bcrypt.hash(password, 12);

    const userId = uuidv4();

    const result: any = await db.query(
      `INSERT INTO users (id, name, email, address, password, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name, email, address, hashedPassword, role]
    );
```

## Contact 

For any inquiries or questions,please react out: 
- [Gmail](mailto:lunasuthar5221@gmail.com)
- [Linkedin](https://www.linkedin.com/in/lunaramsuthar/)