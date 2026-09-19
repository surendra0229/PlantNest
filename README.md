# 🌿 PlantNest

PlantNest is a modern full-stack plant e-commerce platform where users can discover plants, manage their cart, place orders, and track purchases. It also includes a secure admin dashboard for managing plants, users, orders, and PlantNest knowledge content.

---

## ✨ Features

### 👤 User Features

- User registration and login
- Google OAuth authentication
- Secure cookie-based authentication
- Protected user routes
- Browse available plants
- Search and filter plants
- View detailed plant information
- Add plants to cart
- Checkout and place orders
- Track orders
- Manage user profile
- Responsive design
- Dark and Light mode

### 🔐 Authentication & Security

- Secure authentication using HTTP-only cookies
- Protected frontend routes
- Backend authentication and authorization
- Separate User and Admin access
- Admin-only protected routes
- Google OAuth integration
- Rate limiting
- Secure environment variables
- Sensitive data protected using `.gitignore`
- User-specific private data protection

### 👨‍💼 Admin Dashboard

- Secure Admin Login
- Admin Dashboard
- Add plants
- Edit plants
- Delete plants
- Upload plant images
- Take plant photos using device camera
- Cloudinary image storage
- Manage users
- Manage orders
- Manage PlantNest knowledge content

### 🤖 PlantNest Chatbot

- PlantNest-focused chatbot
- Retrieval-based responses
- Uses approved PlantNest data
- Prevents unsupported or unrelated responses
- Voice input support
- Text-to-speech responses
- Designed to avoid hallucinated information

### 📧 Email Notifications

- Successful Google login email
- Order-related email notifications
- Order status notifications
- Backend SMTP email service
- Secure email credentials using environment variables

### 🎨 UI / UX

- Clean botanical-themed interface
- Responsive design
- Desktop, tablet, and mobile support
- Dark/Light mode
- User dashboard
- Admin dashboard
- Mobile-friendly navigation
- Image preview and upload functionality

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- JavaScript
- React Router
- Context API

### Backend

- Node.js
- Express.js
- REST APIs
- Passport.js
- JWT
- Cookie-based Authentication

### Database

- MongoDB
- Mongoose

### Services & APIs

- Google OAuth
- Cloudinary
- Nodemailer / SMTP
- Groq API

---

## 📁 Project Structure

```text
PlantNest/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── seeders/
│   ├── uploads/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── copy_logo.js
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/surendra0229/PlantNest.git
cd PlantNest
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_app_password

GROQ_API_KEY=your_groq_api_key

FRONTEND_URL=http://localhost:5173
```

> ⚠️ Never upload your real `.env` file, passwords, API keys, OAuth credentials, SMTP credentials, or database credentials to GitHub.

---

## ▶️ Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

If the project uses the production start command:

```bash
npm start
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

The backend will normally run at:

```text
http://localhost:5000
```

---

## 🌱 Plant Image Management

Plant images are managed through the Admin Dashboard.

The admin can:

- Upload an image from the device
- Take a photo using the device camera
- Preview the image
- Change the image
- Remove the image
- Upload the image to Cloudinary

The Cloudinary image URL is stored in MongoDB.

Only plants with valid uploaded images are displayed with their actual photos.

---

## 🔒 Security

PlantNest follows several security practices:

- HTTP-only authentication cookies
- Protected frontend routes
- Protected backend APIs
- Admin role authorization
- User-specific data access
- Google OAuth authentication
- Rate limiting
- Environment variables for secrets
- `.gitignore` protection
- No sensitive credentials committed to GitHub

---

## 🔄 Application Flow

### User Flow

```text
User
 │
 ├── Register / Google Login
 │
 ├── Browse Plants
 │
 ├── Search / Filter
 │
 ├── View Plant Details
 │
 ├── Add to Cart
 │
 ├── Checkout
 │
 ├── Place Order
 │
 └── Track Order
```

### Admin Flow

```text
Admin
 │
 ├── Admin Login
 │
 ├── Dashboard
 │
 ├── Manage Plants
 │
 ├── Upload Plant Images
 │
 ├── Manage Users
 │
 ├── Manage Orders
 │
 └── Manage Knowledge Content
```

---

## 🤖 Chatbot Architecture

The PlantNest chatbot is designed to provide information based on approved PlantNest data.

```text
User Question
      │
      ▼
Retrieve PlantNest Data
      │
      ▼
Check Relevance
      │
      ├── Relevant Data
      │       │
      │       ▼
      │   Generate Response
      │
      └── No Relevant Data
              │
              ▼
        Return Fallback Response
```

The chatbot is designed to avoid providing unrelated or unsupported information.

---

## 📧 Email System

PlantNest uses a backend email service for important notifications.

Emails can be triggered for:

- Successful Google login
- Order placement
- Order updates
- Order cancellation
- Other supported application events

SMTP credentials are stored securely in environment variables.

---

## 🌙 Theme Support

PlantNest supports:

- Light Mode
- Dark Mode
- Persistent theme preference
- Responsive theme styling
- Consistent theme across user and admin interfaces

---

## 📱 Responsive Design

The application is designed to work across:

- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

The admin dashboard and user dashboard include responsive navigation and layouts.

---

## 🚀 Future Improvements

Potential future improvements include:

- Online payment integration
- Wishlist functionality
- Product reviews and ratings
- Inventory management
- Advanced plant recommendations
- Improved chatbot capabilities
- Advanced analytics
- Production deployment
- Performance monitoring

---

## 👨‍💻 Developer

**Surendra Chennamalli**

GitHub:  
https://github.com/surendra0229

---

## 📄 License

This project is developed for educational and project purposes.
