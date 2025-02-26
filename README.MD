# Crowdsourced Local Repair & Sustainability Platform

## Introduction
This platform is a community-driven solution designed to promote repair, reuse, and sustainable living by connecting individuals with repair needs to local experts and resources. It facilitates skill-sharing, resource exchange, and eco-impact tracking to reduce waste and encourage sustainability.

## Features
- **User Registration & Profile Management**
  - Repair seekers and experts can create and update profiles.
- **Repair Request Management**
  - Users can post, accept, or decline repair requests.
- **Resource Sharing Hub**
  - Borrow, rent, or donate tools, spare parts, and equipment.
- **Skill-Sharing & Tutorials**
  - Access guides, workshops, and live sessions.
- **Digital Marketplace**
  - Buy, sell, or donate repaired/upcycled items.
- **Real-Time Notifications**
  - Get updates on repair requests and resource availability.
- **Eco-Impact Tracking**
  - Track waste reduction and sustainability metrics.

## System Requirements
- **Backend:** Node.js, Express, MongoDB
- **Frontend:** React.js, Tailwind CSS
- **Database:** MongoDB (with Mongoose ORM)
- **Other Dependencies:**
  - Nodemon (for development)
  - dotenv (for environment variable management)
  - bcrypt (for password hashing)

## Installation & Running the Project
### Prerequisites
Make sure you have the following installed:
- **Node.js** (v14+)
- **MongoDB** (local or cloud instance)
- **Git** (optional but recommended)

### Clone the Repository
```sh
git https://github.com/Nitinkumar432/Integrated_project
cd backend
```

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure it with:
   ```sh
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```sh
   node index.js
   ```
   **OR** (for development with auto-restart):
   ```sh
   nodemon index.js
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm start
   ```

### Running the Full Stack Application
- Make sure both **backend** and **frontend** servers are running.
- Open your browser and go to: `http://localhost:5000`
- API requests will be handled by the backend running on `http://localhost:5000`

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/` | Get all users |
| POST | `//register` | Register a new user |
| POST | `//login` | User login |
| POST | `/seeker/repair-requests` | Create a new repair request |
| GET | `/seeker/repair-requestsall` | Get all repair requests |
| GET | `/seeker/problempage` | Get all repair requests |

## Contributing
1. Fork the repository
2. Create a new branch (`feature-xyz`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Contact
For any queries, please reach out via [GitHub Issues](https://github.com/Nitinkumar432/Integrated_project).