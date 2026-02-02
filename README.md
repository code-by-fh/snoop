# 🔊 Origin & Attribution

This project is based on [Fredy](https://github.com/orangecoding/fredy), created and maintained by [@orangecoding](https://github.com/orangecoding).

The original idea, concept, and core crawling engine originate from Fredy. Significant parts of the initial codebase in this repository are derived from that project and remain the work of the original author.

This repository started as a fork of Fredy and was later continued as a separate project with additional features and a different focus (e.g. frontend, dashboard, UX, and structural changes).
The upstream project Fredy is fully acknowledged as the original source.

Fredy is licensed under the Apache 2.0 , which allows reuse and modification. This notice exists to clearly attribute authorship and origin.

# 🏠 Snoop – [S]earch & [N]avigate [O]ffers [O]n [P]latform

**Snoop** is a modern, full-featured platform for property search, management, and analytics.

Snoop scrapes multiple property services (Immonet, Immowelt, etc.) and sends new listings as soon as they appear.  
The list of providers is easily extendable, and a clean web UI allows you to configure and manage your search jobs effortlessly.

When matching listings are found, Snoop sends them via Slack, Email, or Telegram (more adapters can be added).  
All listings are tracked to prevent duplicates — even across platforms — while enabling analytics and insights.

---

## ✨ What Sets Snoop Apart

- **Revamped User Interface**: Built with React, TypeScript, and TailwindCSS for a clean, responsive, and modern experience.  
- **Improved Database Layer**: Enhanced data management using MongoDB and Mongoose for scalability and reliability.  
- **Modular Provider System**: Add or customize real estate providers with structured integration and automated testing.  
- **Full-Stack Architecture**: RESTful API powered by Node.js and Express for smooth frontend-backend communication.  
- **Analytics Dashboard**: Real-time visualizations and insights built with Recharts.  

Whether you're searching for properties or managing listings as an admin — **Snoop delivers a secure, performant, and user-friendly platform** for modern real estate workflows.

---

## 🚀 Features

### Core Features
- **Property Search**: Advanced filters and map integration  
- **Dashboard**: Real-time analytics and insights  
- **User Management**: Secure authentication & role-based access  
- **API Integration**: RESTful backend for all operations  
- **Responsive Design**: Works seamlessly across devices  
- **Unlimited Jobs**: Create as many search jobs as you want, each with its own configuration and provider selection  
- **Multi-Provider Support**: Use any supported real estate platforms within your jobs (e.g., Immonet, Immowelt, etc.)  
- **Flexible Notifications**: Send new listings through a variety of notifiers such as Slack, Telegram, Pushover, Email, and more  
- **Job Controls**: Jobs can be easily activated or deactivated at any time  
- **Job Statistics**: Every job includes detailed insights and activity statistics  
- **Listing Management**: Mark listings as *favorites* or *seen* to keep track of your search  
- **Multiple Views**: Switch between list view, grid view, and map view for optimal browsing  
- **Registration Options**: Either admin-managed user accounts or user self-registration with email confirmation

### Technical Highlights
- **Frontend**: React, TypeScript, TailwindCSS  
- **Backend**: Node.js, Express  
- **Database**: MongoDB + Mongoose ODM  
- **Authentication**: JWT-based security  
- **Testing**: Mocha + Chai  

---

## 🖼️ App Preview Gallery

<p align="center">
  <img src="screenshots/dashboard_dark.png" width="45%" />
  <img src="screenshots/dashboard_light.png" width="45%" />
</p>

<p align="center">
  <img src="screenshots/jobs_grid_light.png" width="45%" />
  <img src="screenshots/jobs_grid_dark.png" width="45%" />
</p>

<p align="center">
  <img src="screenshots/listing_light_grid.png" width="45%" />
  <img src="screenshots/listing_dark_grid.png" width="45%" />
</p>

<p align="center">
  <img src="screenshots/listing_map_light.png" width="45%" />
  <img src="screenshots/listing_map_dark.png" width="45%" />
</p>

---

## 🧰 Tech Stack

### Frontend
- React 18  
- TypeScript  
- TailwindCSS  
- Vite  
- React Router  
- Axios  
- Recharts  

### Backend
- Node.js  
- Express  
- Mongoose  
- JWT  
- Winston  
- Puppeteer  

### Development Tools
- ESLint  
- Prettier  
- Nodemon  
- Mocha  
- Chai  

---

## ⚡ Quick Start with Docker Compose

If you want to get Snoop running instantly, the easiest way is via **Docker Compose**.

### 🧩 Prerequisites
- [Docker](https://www.docker.com/) ≥ 24  
- [Docker Compose](https://docs.docker.com/compose/install/) ≥ 2.20  

### ▶️ Run Snoop

1. Clone the repository:
   ```bash
   git clone https://github.com/code-by-fh/snoop.git
   cd snoop
   ```

2. Copy the environment configuration:
   ```bash
   cp .env.example .env
   ```
   Adjust your credentials and environment variables as needed (e.g., API keys, ports, notification adapters).

3. Start the full stack with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - 🌐 **Frontend:** [http://localhost:3000](http://localhost:3000)  
   - ⚙️ **Backend:** [http://localhost:5000](http://localhost:5000)  
   - 🗄️ **MongoDB:** [mongodb://localhost:27017](mongodb://localhost:27017)

5. (Optional) View logs:
   ```bash
   docker-compose logs -f
   ```

That’s it — your local Snoop instance is live 🎉

---

## 🧑‍💻 Manual Setup

If you prefer a manual setup for development or debugging:

### Prerequisites
- Node.js ≥ 18  
- npm ≥ 9  
- MongoDB ≥ 6  

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/code-by-fh/snoop.git
   cd snoop
   ```

2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   cd server
   npm install
   cd ..
   ```

3. Copy and configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run the application:
   ```bash
   npm run dev
   ```

Access:
- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend: [http://localhost:5000](http://localhost:5000)

---

## 🔐 Initial Admin Account

When Snoop starts for the first time, it automatically creates a default administrator account for initial access:

- Username: admin
- Password:	Password123!

⚠️ Important:
- You must log in with these credentials after the first start.
- Immediately change the password in the user settings for security reasons.
- Once changed, this default password cannot be restored automatically — please make sure to note the new one safely.
- The default credentials are created only if no admin user exists in the database.

## 👥 User Registration

Snoop supports **two different user registration workflows**, allowing you to choose the method that best fits your environment or security requirements.

### 🔐 1) Admin-Created Accounts  
An administrator can manually create new user accounts within the system.  
After creation, the admin must **activate** the account.  
This approach is ideal for closed environments or teams that require controlled access.

### 📧 2) User Self-Registration  
Snoop also provides an optional self-registration flow where users can create an account themselves and activate it via **email confirmation**.

To enable self-registration, the following environment variables must be configured:

```env
# Email / SMTP configuration
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=

# Enable self-registration
SELF_REGISTRATION_ENABLED=true
```

⚠️ Important Notes:

You are responsible for providing and configuring your own SMTP service (e.g., Mailhog, Mailtrap, Postfix, or any external provider).

Self-registration will not work without a functioning mail server.

If SELF_REGISTRATION_ENABLED=false or not defined, only admin-created accounts are allowed.

## 🧪 Testing

Run the full test suite:
```bash
cd server
npm test
```

---

## 📄 License

Distributed under the **Apache 2.0**.  
See [`LICENSE`](LICENSE) for details.

---

## 📬 Contact

**Project Maintainer:** [Doublelayer](https://github.com/code-by-fh)  
**Project Repository:** [https://github.com/code-by-fh/snoop](https://github.com/code-by-fh/snoop)
