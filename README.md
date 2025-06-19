# 🎬 CineScope

<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
</div>
<div align="center">
  <h3>A full-stack Movie Rating, Review, and Discovery Web App built with the MERN stack</h3>

</div>

---

## 🌟 Features

### ✅ Core Features

- 🔐 **Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- 🎞️ **Movie Management** - Admin panel for adding and managing movies
- 📄 **Movie Discovery** - Browse movies with detailed information pages
- ⭐ **Rating & Reviews** - Rate movies and write detailed reviews
- 📊 **Dynamic Ratings** - Real-time average rating calculations

### 🎯 User Experience

- 🔍 **Smart Search** - Find movies by title with instant results
- 🎭 **Genre Filtering** - Filter movies by genre categories
- 🔄 **Flexible Sorting** - Sort by title (A-Z/Z-A), rating, or date

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center"><strong>Frontend</strong></td>
    <td>React • React Router • Axios • TailwindCSS • Font Awesome</td>
  </tr>
  <tr>
    <td align="center"><strong>Backend</strong></td>
    <td>Node.js • Express.js</td>
  </tr>
  <tr>
    <td align="center"><strong>Database</strong></td>
    <td>MongoDB • Mongoose ODM</td>
  </tr>
  <tr>
    <td align="center"><strong>Authentication</strong></td>
    <td>JWT • bcrypt</td>
  </tr>
  <tr>
    <td align="center"><strong>Deployment</strong></td>
    <td>Vercel (Frontend) • Render (Backend)</td>
  </tr>
</table>

---

## 📁 Project Structure

```
cinescope/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── context/        # React Context providers
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Server entry point
│   └── package.json
│
└── README.md

```

---

## 🗄️ Database Schema

### 👤 User Model

```jsx
{
  username: String,        // Unique, lowercase, trimmed
  email: String,           // Unique, lowercase, trimmed
  password: String,        // Hashed with bcrypt
  watchHistory: [ObjectId], // References to Movie documents
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}

```

**Methods:**

- `isPasswordCorrect(password)` - Verify password using bcrypt
- `generateAccessToken()` - Create JWT access token
- `generateRefreshToken()` - Create JWT refresh token

### 🎞️ Movie Model

```jsx
{
  title: String,           // Unique, indexed for fast search
  description: String,     // Max 2000 characters
  genre: String,           // Enum validated genres
  duration: Number,        // Duration in minutes (min: 1)
  poster: String,          // Cloudinary image URL
  language: String,        // Default: 'English'
  availability: String     // Optional availability info
}

```

### 📝 Review Model

```jsx
{
  userId: ObjectId,        // Optional (for registered users)
  email: String,           // Optional (for guest reviews)
  movieId: ObjectId,       // Required, references Movie
  rating: Number,          // 1-5 star rating
  comment: String,         // Required, max 1000 characters
  createdAt: Date          // Auto-generated timestamp
}

```

**Constraints:**

- Either `userId` or `email` must be provided
- Unique constraint: one review per user/email per movie
- Indexed for efficient queries

---

## 🔗 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/users/register` | Register new user |
| `POST` | `/api/v1/users/login` | User login |
| `POST` | `/api/v1/users/logout` | User logout |
| `GET` | `/api/v1/users/current-user` | Get current user info |
| `PATCH` | `/api/v1/users/update-account` | Update user details |

### 🎬 Movies

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/movies/createMovie` | Add new movie (Admin) |
| `GET` | `/api/v1/movies/getMovieById/:id` | Get movie by ID |
| `GET` | `/api/v1/movies/getMovieByTitle/:title` | Search movies by title |
| `POST` | `/api/v1/movies/getByGenre` | Filter movies by genre |
| `GET` | `/api/v1/movies/all` | Get all movies |

### 📝 Reviews

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/reviews/create` | Create new review |
| `GET` | `/api/v1/reviews/movie/:movieId` | Get reviews for movie |
| `GET` | `/api/v1/reviews/user/:userId` | Get user reviews |
| `GET` | `/api/v1/reviews/email/:email` | Get reviews by email |
| `DELETE` | `/api/v1/reviews/:id` | Delete review |
| `GET` | `/api/v1/reviews/all` | Get all reviews |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
    
    ```bash
    git clone https://github.com/yourusername/cinescope.git
    cd cinescope
    
    ```
    
2. **Install backend dependencies**
    
    ```bash
    cd server
    npm install
    
    ```
    
3. **Install frontend dependencies**
    
    ```bash
    cd ../client
    npm install
    
    ```
    
4. **Environment Setup**
    
    Create `.env` file in the server directory:
    
    ```
    MONGO_URI=your_mongodb_connection_string
    PORT=
    ACCESS_TOKEN_SECRET=
    ACCESS_TOKEN_EXPIRY=
    REFRESH_TOKEN_SECRET=
    REFRESH_TOKEN_EXPIRY=
    
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    
    ```
    
5. **Run the application**
    
    **Backend (Terminal 1):**
    
    ```bash
    cd server
    npm start
    
    ```
    
    **Frontend (Terminal 2):**
    
    ```bash
    cd client
    npm run dev
    
    ```
    
6. **Access the application**
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:5000`

---

## 🎨 Design System

### Color Palette

```css
Primary Colors:
#EDE0D4  /* Light Cream */
#E6CCB2  /* Warm Beige */
#DDB892  /* Light Brown */

Secondary Colors:
#B08968  /* Medium Brown */
#9C6644  /* Dark Brown */
#7F5539  /* Deep Brown */

```

### Styling

- **TailwindCSS** for responsive utility-first styling
- **Font Awesome** for consistent iconography
- **Custom components** for reusable UI elements

---

## 🔒 Security Features

- 🔐 **Password Hashing**: bcrypt with salt rounds
- 🎟️ **JWT Authentication**: Secure token-based auth
- 🍪 **HTTP-only Cookies**: Secure token storage
- 🛡️ **Route Protection**: Middleware-based access control
- ✅ **Input Validation**: Mongoose schema validation

---

### Deployment Steps

1. Build frontend: `npm run build`
2. Configure environment variables
3. Deploy backend to Render
4. Deploy frontend to Vercel
5. Update CORS settings for production URLs

---

## 🔮 Future Enhancements

- 🌐 **Social Authentication** (Google, GitHub OAuth)
- 📧 **Email Verification** with Nodemailer
- 🎛️ **Advanced Admin Dashboard**
- 💬 **Threaded Comments** on reviews
- 📱 **Mobile App** (React Native)
- 🔍 **Advanced Search** with filters
- 📊 **Analytics Dashboard**
- 🎬 **Movie Recommendations** (ML-based)

---

## 👨‍💻 Author

**Harshal Mistry**

- GitHub: [https://github.com/Harshalmistry02/CineScope](https://github.com/yourusername)
- LinkedIn: [www.linkedin.com/in/harshalmistry02](https://linkedin.com/in/yourprofile)
- Email: [mistryharshal2611@gmail.com](mailto:mistryharshal2611@gmail.com)
