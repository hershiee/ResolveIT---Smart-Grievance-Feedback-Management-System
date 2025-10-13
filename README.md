# ResolveIT - Smart Grievance & Feedback Management System

## 📋 Project Overview

ResolveIT is a comprehensive online complaint and grievance portal designed to bring transparency and efficiency to institutional complaint handling. The platform enables users to submit complaints (anonymously or publicly), track their status in real-time, and escalate unresolved issues, while administrators manage the entire resolution process through an intuitive dashboard.

## ✨ Key Features

### User Features
- **Dual Submission Modes**: Submit complaints publicly (trackable) or anonymously (private)
- **Real-time Status Tracking**: Track complaint progress through all resolution stages
- **Evidence Upload**: Attach supporting documents and images (JPG, PNG, PDF, DOC, DOCX)
- **Complaint History**: View all your past complaints with detailed information
- **Priority Levels**: Set urgency levels (Low, Medium, High, Critical)
- **Timeline View**: See chronological updates and admin comments

### Admin Features
- **Comprehensive Dashboard**: Overview of all complaints with filtering options
- **Status Management**: Update complaint status through the resolution workflow
- **Assignment System**: Assign complaints to specific staff members
- **Internal Notes**: Add private notes visible only to admin staff
- **Public Replies**: Communicate with users about their complaint progress
- **Analytics**: Visual insights into complaint trends and performance metrics
- **Auto-escalation**: Automatic escalation of unresolved critical issues

### Reporting & Analytics
- **Visual Dashboards**: Charts showing status distribution, category breakdown, and trends
- **Export Functionality**: Download complaint data in CSV or JSON format
- **Performance Metrics**: Track resolution time, resolution rate, and critical issues
- **Custom Filters**: Filter by status, category, priority, and date range

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **CSS3** - Styling with responsive design
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Multer** - File upload handling
- **JWT** - Authentication
- **bcrypt.js** - Password hashing
- **node-cron** - Scheduled tasks

## 📁 Project Structure

```
resolveit-portal/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── ComplaintForm.js
│   │   │   ├── ComplaintHistory.js
│   │   │   ├── ComplaintTracking.js
│   │   │   ├── Navbar.js
│   │   │   └── ReportsExport.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── Dashboard.js
│   │   ├── home.js
│   │   ├── login.js
│   │   ├── signup.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── Server.js
│   ├── createAdmin.js
│   ├── uploads/
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

### Database Setup

1. **Create the MySQL database:**
```sql
CREATE DATABASE complaint_system;
USE complaint_system;
```

2. **Create the required tables:**

```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaints table
CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  urgency ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
  submission_type ENUM('public', 'anonymous') DEFAULT 'public',
  contact_info VARCHAR(255) NULL,
  file_path TEXT NULL,
  status ENUM('New', 'Under Review', 'In Progress', 'Resolved', 'Closed', 'Escalated') DEFAULT 'New',
  assigned_to VARCHAR(255) NULL,
  resolution_notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  escalated_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Complaint updates table
CREATE TABLE complaint_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  old_status VARCHAR(50) NULL,
  new_status VARCHAR(50) NOT NULL,
  update_message TEXT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- Escalation rules table (optional)
CREATE TABLE escalation_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  urgency_level ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  hours_before_escalation INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default escalation rules
INSERT INTO escalation_rules (urgency_level, hours_before_escalation) VALUES
('critical', 2),
('high', 24),
('medium', 72),
('low', 168);
```

### Backend Setup

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create a `.env` file:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=complaint_system
JWT_SECRET=your_secret_key_here
```

4. **Update database credentials in Server.js** (if needed):
```javascript
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "complaint_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

5. **Start the backend server:**
```bash
node Server.js
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

The application will open at `http://localhost:3000`

### Creating Admin Account

1. **Run the admin creation script:**
```bash
node createAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@resolveit.com`
- Password: `admin123`

**Important:** Change these credentials after first login!

## 📱 Usage Guide

### For Users

1. **Sign Up/Login**: Create an account or log in to submit complaints
2. **Submit Complaint**: Choose submission type (Public/Anonymous), fill in details
3. **Track Status**: Use the tracking feature to monitor complaint progress
4. **View History**: Access all your past complaints in "My Complaints" section

### For Admins

1. **Login**: Use admin credentials to access the admin dashboard
2. **View Dashboard**: See overview of all complaints with statistics
3. **Manage Complaints**: Update status, assign to staff, add notes
4. **Generate Reports**: View analytics and export data for analysis

## 🔐 Security Features

- Password encryption using bcrypt
- JWT-based authentication
- Role-based access control (User/Admin)
- Input validation and sanitization
- File type and size restrictions
- SQL injection prevention with parameterized queries

## 📊 Workflow

```
User Submission → Admin Review → Assignment → Resolution → Closure
                    ↓
              (If delayed) → Escalation → Higher Authority
```

### Status Flow
1. **New** - Complaint just submitted
2. **Under Review** - Admin reviewing the complaint
3. **In Progress** - Working on resolution
4. **Resolved** - Issue resolved
5. **Closed** - Complaint closed
6. **Escalated** - Escalated to higher authority

## 🎯 Project Milestones

- ✅ **Week 1-2**: Login and Complaint Input Module
- ✅ **Week 3-4**: Complaint Status System
- ✅ **Week 5**: Admin Dashboard
- ✅ **Week 6-7**: Escalation Logic
- ✅ **Week 8**: Reports and Export

## 🤝 Contributing

This is an academic project. For any issues or suggestions:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is created for educational purposes.

## 👥 Authors

Harshita Gupta


## 🙏 Acknowledgments

- Built as part of Infosys SpringBoard Virtual Internship 6.0
- Special thanks to faculty advisors and mentors

---

**Note**: Remember to update the database credentials and JWT secret in production environments!
