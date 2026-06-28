# ToLet — Room on Rent

A full-stack property rental platform that lets users search, book, and communicate about rooms, flats, and hotels — without the hassle of door-to-door searching.

---

## Tech Stack

**Frontend**
- React 18 (Create React App)
- Chakra UI · Bootstrap · Swiper.js
- Socket.io Client · Axios
- Google Maps API · Google Sign-In (GSI) · React Simple OAuth2 Login

**Backend**
- Node.js · Express 4
- MongoDB · Mongoose 8
- Socket.io 4 (real-time chat)
- JWT (jsonwebtoken) · bcryptjs
- Cloudinary (image uploads) · Multer
- Nodemailer (OTP emails)

---

## Features

- **User-Friendly Interface** — Intuitive design that makes it easy to navigate and find ideal rental properties.
- **Search & Booking** — Search, book, and save properties with type and city filters, plus pagination.
- **Real-Time Communication** — Socket.io powered chat (1-on-1 and group) with typing indicators for seamless owner–user communication.
- **Geolocation Services** — Google Maps integration to view precise room locations and let owners pin their properties on the map.
- **Filtering Options** — Filter listings by property type (Room, Flat, Hotel) and city.
- **Variety of Listings** — Rooms, flats, and hotels catering to different budgets and preferences.
- **Direct Owner Interaction** — Users connect directly with property owners to discuss availability and terms.
- **Hosting** — List, edit, and delete your own properties with photo uploads via Cloudinary.
- **Wishlist** — Save properties and revisit them later.

---

## Project Structure

```
ToLet-RoomOnRent/
├── client/                 # React frontend (CRA)
│   └── src/
│       ├── components/
│       │   ├── auth/       # Login, Signup, ForgotPass
│       │   ├── chats/      # Chat UI, SingleChat, MyChats, ScrollableChat
│       │   ├── filter/     # Room, Flat, Hotel filter pages
│       │   ├── home/       # Home, Welcome, FeaturedCards, CommonCards, SlidingBrands
│       │   ├── map/        # Google Maps integration
│       │   ├── profile/    # Booking, Hosting, Saved, PhotoUploader
│       │   └── testimonial/
│       ├── context/        # UserContext (auth + chat state)
│       └── utils/          # Constants (API URL)
└── server/                 # Express backend
    ├── models/             # User, Place, Booking, ChatModel, MessageModel, Forgotpass
    ├── routes/             # auth, oauth, hosting, booking, chats, places, forgotpass, testimonial
    └── middleware/         # fetchUserFromToken (JWT auth)
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords) enabled

### 1. Clone the repository

```bash
git clone https://github.com/sanjeev662/ToLet-RoomOnRent.git
cd ToLet-RoomOnRent
```

### 2. Configure the server

Create `server/.env`:

```env
PORT=5001
mongoURI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDNAME=your_cloudinary_cloud_name
CLOUDAPIKEY=your_cloudinary_api_key
CLOUDINARYSECRET=your_cloudinary_api_secret

EMAIL=your_gmail_address
EMAIL_PASS2=your_gmail_app_password

NODE_ENV=development
```

### 3. Configure the client

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

### 4. Install dependencies & run

```bash
# Backend
cd server
npm install
npm start

# Frontend (new terminal)
cd client
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## Skills Demonstrated

- **UI/UX Design** — Intuitive and user-friendly interface design.
- **Backend Development** — Robust search, booking, and hosting system with REST APIs.
- **Real-Time Chat Integration** — Socket.io for live messaging and typing indicators.
- **Geolocation Services** — Google Maps API for precise property location data.
- **Data Filtering** — Advanced filtering by property type and city.
- **Database Management** — MongoDB with Mongoose for diverse rental listings.
- **Authentication** — JWT, bcrypt, email OTP, Google and Facebook OAuth.
- **Cloud Storage** — Cloudinary for property image uploads.
- **Problem Solving** — Addressed the door-to-door room search problem effectively.

---

## User Benefits

- **Time-Saving** — Find rental properties faster without visiting in person.
- **Convenience** — Property owners can list and manage their properties with ease.
- **Transparency** — Real-time chat promotes open communication between users and owners.
- **Precision** — Google Maps integration provides accurate property location data.
- **Choice** — Wide variety of rental options — rooms, flats, and hotels.

---

## YouTube Explanation Video

For a detailed walkthrough of the project, watch the [YouTube Explanation Video](https://youtu.be/0Esg-oJse-c).

---

## Author

**Sanjeev Singh** — [GitHub](https://github.com/sanjeev662)
