# 🚀 BrandFluence

**BrandFluence** is a full-stack influencer marketing platform designed to connect **brands and influencers** for discovering campaigns, managing collaboration requests, tracking applications, and handling campaign-related interactions.

The application provides role-specific experiences for **Brands, Influencers, and Administrators**, backed by a Spring Boot REST API and a React frontend.

---

## ✨ Overview

BrandFluence provides a centralized platform where:

* 🏢 **Brands** can create and manage marketing campaigns.
* 👤 **Influencers** can discover campaigns and apply for collaborations.
* 🤝 **Brands and Influencers** can manage collaboration requests.
* 🔔 Users receive notifications for relevant platform activities.
* ⭐ Users can submit and manage reviews.
* 🔐 Authentication and authorization are handled using JWT.
* 📊 Different user roles receive dedicated dashboards and functionality.

---

# 🎯 Core Features

## 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected API endpoints
* Role-based access control
* Separate experiences for:

  * Brand
  * Influencer
  * Admin

Authentication is implemented using:

```text
JwtService
JwtAuthenticationFilter
SecurityConfig
UserRole
```

---

## 🏢 Brand Features

Brands can:

* Create campaigns
* Manage their campaigns
* Discover influencers
* View influencer profiles
* Receive collaboration requests
* Manage collaborations
* View notifications
* Maintain their brand profile
* Review collaboration outcomes

Relevant frontend pages:

```text
MyCampaigns
DiscoverCreators
BrandDashboard
BrandProfile
ReceivedRequests
```

---

## 👤 Influencer Features

Influencers can:

* Discover available campaigns
* View campaign information
* Apply to campaigns
* Track submitted applications
* Manage their influencer profile
* Receive notifications
* Participate in collaborations
* Submit/view reviews

Relevant frontend pages:

```text
DiscoverCampaigns
MyApplications
InfluencerDashboard
InfluencerProfile
Notifications
```

---

## 🤝 Collaboration Management

The collaboration system manages interactions between brands and influencers.

The backend contains:

```text
Collaboration
CollaborationStatus
CollaborationController
CollaborationService
CollaborationRepository
```

The frontend provides dedicated interfaces for:

```text
MyApplications
ReceivedRequests
```

This allows collaboration requests to move through defined application states.

---

## 📢 Campaign Management

Brands can create and manage marketing campaigns.

Campaign functionality is implemented through:

```text
CampaignController
CampaignService
CampaignRepository
Campaign
```

Campaign requests and responses are separated using DTOs:

```text
CampaignRequest
CampaignResponse
```

---

## 🔔 Notifications

The platform includes notification functionality for user activities.

Backend:

```text
NotificationController
NotificationService
NotificationRepository
Notification
```

Frontend:

```text
Notifications.jsx
notificationService.js
```

---

## ⭐ Reviews

Users can interact with the review system following collaborations.

Backend components include:

```text
ReviewController
ReviewService
ReviewRepository
Review
ReviewRequest
ReviewResponse
```

---

# 🏗️ System Architecture

```text
                         BrandFluence
                              │
              ┌───────────────┴────────────────┐
              │                                │
              ▼                                ▼
       React Frontend                    Spring Boot API
              │                                │
       ┌──────┴──────┐                 ┌───────┴────────┐
       │             │                 │                │
       ▼             ▼                 ▼                ▼
    Brand        Influencer       Authentication     Business
    UI              UI              / JWT             Services
                                             │
                                             ▼
                                      Spring Data JPA
                                             │
                                             ▼
                                          Database
```

---

# 🔄 Application Flow

### Brand

```text
Login
  ↓
Brand Dashboard
  ↓
Create Campaign
  ↓
Discover Influencers
  ↓
Receive Applications / Requests
  ↓
Manage Collaboration
  ↓
Review
```

### Influencer

```text
Register / Login
  ↓
Influencer Dashboard
  ↓
Discover Campaigns
  ↓
Apply
  ↓
Track Application
  ↓
Collaboration
  ↓
Review
```

---

# 🛠️ Technology Stack

## Frontend

* React
* JavaScript / JSX
* CSS
* React Context API
* REST API integration

## Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Maven
* JWT Authentication

## Database

* Relational database
* JPA/Hibernate persistence

## Development

* Git
* GitHub
* Maven Wrapper
* npm

---

# 📁 Project Structure

```text
BrandFluence/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── in/
│   │   │   │       └── mr_nayan/
│   │   │   │           └── brandfluence/
│   │   │   │
│   │   │   │               ├── config/
│   │   │   │               │   └── SecurityConfig.java
│   │   │   │               │
│   │   │   │               ├── controller/
│   │   │   │               │   ├── CampaignController.java
│   │   │   │               │   ├── CollaborationController.java
│   │   │   │               │   ├── InfluencerProfileController.java
│   │   │   │               │   ├── NotificationController.java
│   │   │   │               │   ├── ReviewController.java
│   │   │   │               │   └── UserController.java
│   │   │   │               │
│   │   │   │               ├── DTO/
│   │   │   │               │   ├── CampaignRequest.java
│   │   │   │               │   ├── CampaignResponse.java
│   │   │   │               │   ├── CollaborationRequest.java
│   │   │   │               │   ├── CollaborationResponse.java
│   │   │   │               │   ├── InfluencerProfileRequest.java
│   │   │   │               │   ├── InfluencerProfileResponse.java
│   │   │   │               │   ├── LoginRequest.java
│   │   │   │               │   ├── LoginResponse.java
│   │   │   │               │   ├── NotificationResponse.java
│   │   │   │               │   ├── ReviewRequest.java
│   │   │   │               │   ├── ReviewResponse.java
│   │   │   │               │   ├── UserRequest.java
│   │   │   │               │   └── UserResponse.java
│   │   │   │               │
│   │   │   │               ├── entity/
│   │   │   │               │   ├── Campaign.java
│   │   │   │               │   ├── Collaboration.java
│   │   │   │               │   ├── CollaborationStatus.java
│   │   │   │               │   ├── InfluencerProfile.java
│   │   │   │               │   ├── Notification.java
│   │   │   │               │   ├── Review.java
│   │   │   │               │   ├── User.java
│   │   │   │               │   └── enums/
│   │   │   │                   └── UserRole.java
│   │   │   │
│   │   │   │               ├── repository/
│   │   │   │               │   ├── CampaignRepository.java
│   │   │   │               │   ├── CollaborationRepository.java
│   │   │   │               │   ├── InfluencerProfileRepository.java
│   │   │   │               │   ├── NotificationRepository.java
│   │   │   │               │   ├── ReviewRepository.java
│   │   │   │               │   └── UserRepository.java
│   │   │   │               │
│   │   │   │               ├── security/
│   │   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │   │               │   └── JwtService.java
│   │   │   │               │
│   │   │   │               ├── service/
│   │   │   │               │   ├── CampaignService.java
│   │   │   │               │   ├── CollaborationService.java
│   │   │   │               │   ├── InfluencerProfileService.java
│   │   │   │               │   ├── NotificationService.java
│   │   │   │               │   ├── ReviewService.java
│   │   │   │               │   └── UserService.java
│   │   │   │               │
│   │   │   │               └── BrandfluenceApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │       └── java/
│   │           └── in/mr_nayan/brandfluence/
│   │               └── BrandfluenceApplicationTests.java
│   │
│   ├── .mvn/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── Toast.jsx
│   │   │   │
│   │   │   ├── navbar/
│   │   │   │   └── Navbar.jsx
│   │   │   │
│   │   │   └── sidebar/
│   │   │       └── Sidebar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── campaigns/
│   │   │   │   ├── DiscoverCampaigns.jsx
│   │   │   │   └── MyCampaigns.jsx
│   │   │   │
│   │   │   ├── collaborations/
│   │   │   │   ├── MyApplications.jsx
│   │   │   │   └── ReceivedRequests.jsx
│   │   │   │
│   │   │   ├── creators/
│   │   │   │   └── DiscoverCreators.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── BrandDashboard.jsx
│   │   │   │   └── InfluencerDashboard.jsx
│   │   │   │
│   │   │   ├── notifications/
│   │   │   │   └── Notifications.jsx
│   │   │   │
│   │   │   └── profile/
│   │   │       ├── BrandProfile.jsx
│   │   │       └── InfluencerProfile.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── campaignService.js
│   │   │   ├── collaborationService.js
│   │   │   ├── influencerService.js
│   │   │   ├── notificationService.js
│   │   │   ├── reviewService.js
│   │   │   └── userService.js
│   │   │
│   │   └── styles/
│   │       └── brandfluence.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.html
│   ├── package.json
│   └── styles.css
│
└── README.md
```

---

# 🔐 Authentication Architecture

BrandFluence uses JWT-based authentication.

```text
User
 │
 ▼
Login / Register
 │
 ▼
Auth Controller
 │
 ▼
Auth Service
 │
 ▼
JWT Service
 │
 ▼
JWT Token
 │
 ▼
Frontend
 │
 ▼
Protected API Request
 │
 ▼
JwtAuthenticationFilter
 │
 ▼
Spring Security
 │
 ▼
Controller
```

The security layer contains:

```text
SecurityConfig
JwtService
JwtAuthenticationFilter
```

---

# 👥 Role-Based Access

The application defines different user roles:

```text
                User
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      Brand    Influencer   Admin
```

Each role has access to different dashboard functionality.

### Brand

```text
BrandDashboard
BrandProfile
MyCampaigns
DiscoverCreators
ReceivedRequests
```

### Influencer

```text
InfluencerDashboard
InfluencerProfile
DiscoverCampaigns
MyApplications
```

### Admin

```text
AdminDashboard
```

---

# 🧩 Backend Layering

BrandFluence follows a layered Spring Boot architecture:

```text
                    REST Request
                         │
                         ▼
                   Controller
                         │
                         ▼
                      DTO
                         │
                         ▼
                     Service
                         │
                         ▼
                    Repository
                         │
                         ▼
                      Entity
                         │
                         ▼
                      Database
```

This separation keeps HTTP handling, business logic, persistence, and data representation independent.

---

# 📡 API Modules

The backend exposes REST functionality around the following modules:

| Module                 | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| Authentication / Users | Registration, login, and user management      |
| Campaigns              | Campaign creation and management              |
| Collaborations         | Applications and collaboration requests       |
| Influencer Profiles    | Influencer information and discovery          |
| Notifications          | User activity notifications                   |
| Reviews                | Reviews associated with platform interactions |

---

# 🖥️ Frontend Architecture

The frontend is divided into reusable components, layouts, pages, context, and API services.

```text
Frontend
│
├── Components
│   ├── Navbar
│   ├── Sidebar
│   ├── Loading
│   ├── EmptyState
│   └── Toast
│
├── Layouts
│   └── DashboardLayout
│
├── Pages
│   ├── Authentication
│   ├── Campaigns
│   ├── Collaborations
│   ├── Creators
│   ├── Dashboards
│   ├── Notifications
│   └── Profiles
│
├── Context
│   └── AuthContext
│
└── Services
    ├── Authentication
    ├── Campaigns
    ├── Collaborations
    ├── Influencers
    ├── Notifications
    ├── Reviews
    └── Users
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* Java
* Maven
* Node.js
* npm
* A relational database supported by the application's configuration

Check your installations:

```bash
java -version
mvn -version
node -v
npm -v
```

---

# ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

The project includes Maven Wrapper, so Maven does not necessarily need to be installed globally.

### Windows

```powershell
.\mvnw.cmd clean install
```

Start the application:

```powershell
.\mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw clean install
./mvnw spring-boot:run
```

---

# 🗄️ Database Configuration

Backend configuration is located at:

```text
backend/src/main/resources/application.properties
```

Configure the database connection and application-specific properties before running the backend.

Do not commit production credentials or secrets to the repository.

---

# 💻 Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend development URL will be displayed by Vite/the configured development setup.

---

# 🔗 Frontend ↔ Backend Communication

The frontend communicates with the Spring Boot backend through service modules:

```text
frontend/src/services/
```

These include:

```text
api.js
authService.js
campaignService.js
collaborationService.js
influencerService.js
notificationService.js
reviewService.js
userService.js
```

This keeps API communication separate from UI components.

---

# 🧪 Testing

The backend contains a test source directory:

```text
backend/src/test/
```

Currently, the project includes:

```text
BrandfluenceApplicationTests.java
```

Additional tests can be added for controllers, services, repositories, authentication, and collaboration workflows.

---

# 🔮 Future Improvements

Potential improvements include:

* Campaign search and advanced filtering
* Influencer search by category, audience, and engagement metrics
* Campaign analytics
* Collaboration status tracking improvements
* Real-time notifications
* Messaging between brands and influencers
* Image/media upload support
* Automated email notifications
* Expanded admin controls
* More comprehensive unit and integration testing
* API documentation using OpenAPI/Swagger
* Docker-based deployment
* CI/CD pipeline
* Production deployment configuration

---

# 🧹 Repository Hygiene

The following directories/files are development or build artifacts and should not be represented as core application architecture:

```text
.git/
.idea/
target/
node_modules/
```

The `.github/modernize/java-upgrade/` files are repository tooling and can also be omitted from the application architecture section.

The Maven Wrapper files:

```text
mvnw
mvnw.cmd
.mvn/
```

**should remain in the repository** because they allow contributors to build the backend using the project's configured Maven version.

---

# 👨‍💻 Project Information

**BrandFluence**

Full-stack influencer marketing and brand collaboration platform.

**Development Period:** January 2025 – April 2026

**Team Size:** 5

**Primary Technologies:**

```text
React
Java
Spring Boot
Spring Security
JWT
Spring Data JPA
REST APIs
Maven
```

---

# 📌 Project Architecture at a Glance

```text
                         BrandFluence
                              │
              ┌───────────────┴────────────────┐
              │                                │
              ▼                                ▼
        React Frontend                   Spring Boot
              │                                │
       ┌──────┼──────┐                 ┌───────┼───────┐
       │      │      │                 │       │       │
     Brand  Creator  Admin          Security Campaign Users
       │      │      │                 │       │       │
       └──────┴──────┴─────────────────┴───────┴───────┘
                              │
                              ▼
                         Persistence
                              │
                              ▼
                           Database
```

BrandFluence demonstrates a full-stack application architecture combining **React UI development, Spring Boot REST APIs, JWT authentication, role-based access control, layered backend design, database persistence, campaign management, and brand–influencer collaboration workflows**.
