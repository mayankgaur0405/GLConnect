# GLConnect

A **LinkedIn + Study Materials Hub** for GL Bajaj students — helping peers connect, share resources, and prepare for exams together.  
Built using the **MERN Stack** (MongoDB, Express.js, React, Node.js).

---

## 🚀 Features

### 🔍 Search & Profiles
- **Search by username** to instantly view any student's profile.
- **Profile Sections**:
  - DSA Resources (images + clickable buttons for links)
  - Semester-wise exam preparation
  - Web Development, Machine Learning, Core Subjects
  - Custom sections (users can add their own)

### 👥 Social Features
- **Follow/Unfollow system** to keep track of peers.
- **Search filters** by year, department, and specialization.
- **Random profile suggestions** if no filter is applied.

### 📂 Resource Management
- Resources stored as **cards** with PDF, YouTube, or GitHub link buttons.
- Standardized design for easy access.

### 📱 Responsive Design
- Works seamlessly on desktop and mobile.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **MongoDB** | Store user profiles, resources, and follow data |
| **Express.js** | Backend API development |
| **React.js** | Frontend UI components |
| **Node.js** | Server-side logic |
| **JWT** | User authentication |
| **Cloudinary / Firebase Storage** | File & image hosting |

---

## 📅 Roadmap

1. **MVP Development**
   - Basic user profiles
   - Search by username
   - Follow/Unfollow system
2. **Resource Integration**
   - Add DSA, semester-wise, and web dev sections
3. **Advanced Features**
   - Search filters
   - Random profile suggestions
4. **Future Scope**
   - Group chats
   - Study circles
   - Exam alerts

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/glbajaj-student-hub.git
cd glbajaj-student-hub
2️⃣ Install dependencies
Backend:

bash
Copy
Edit
cd backend
npm install
Frontend:

bash
Copy
Edit
cd frontend
npm install
3️⃣ Environment variables
Create a .env file in the backend folder:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
4️⃣ Run the app
Backend:

bash
Copy
Edit
cd backend
npm run dev
Frontend:

bash
Copy
Edit
cd frontend
npm start
📸 Screenshots (Coming Soon)
Home Page

Search & Filters

Profile Page

Resource Cards

📜 License
This project is licensed under the MIT License.

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue to discuss your ideas.

💡 Inspiration
A platform designed by students, for students to make resource sharing and peer connections easier at GL Bajaj.
