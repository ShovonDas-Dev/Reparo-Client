
<div align="center">

# 🔧 Reparo — Repair Made Simple

### A smarter way to find trusted repair professionals and manage repair services.


**Live Demo:** https://reparo-client.vercel.app/

</div>

---

## 📌 Overview

**Reparo** is a modern repair-service platform designed to connect customers with professional technicians for device and home-appliance repairs.

The platform provides an easy way for customers to explore repair services, find technicians, and manage their repair requests.

Reparo comes with three dedicated dashboards:

- **Admin Dashboard** – Platform administration and management.
- **Technician Dashboard** – Technician workspace for managing repair activities.
- **Customer Dashboard** – Customer workspace for accessing repair services and requests.

Our goal is to make repair services easier, faster, and more convenient.

## 🖥️ Project Preview

<div align="center">

<img src="public/reparo-cover.png" alt="Reparo Project Preview" width="100%" />

</div>

## ✨ Key Features

- 🔐 Secure authentication with Better Auth and JWT.
- 👨‍💻 Three separate role-based dashboards.
- 🛠️ Professional repair service management.
- 👨‍🔧 Technician discovery and service information.
- 📱 Fully responsive user interface.
- 📊 Dedicated dashboard experiences.
- 🖼️ Image uploading with ImageBB.
- 🗄️ MongoDB database integration.
- 🎨 Modern UI built with Tailwind CSS and shadcn/ui.
- ⚡ Fast and optimized Next.js application.

## 👥 User Roles

### 1. Admin Dashboard

Administrators have a dedicated dashboard to oversee and manage the platform.

### 2. Technician Dashboard

Technicians have their own workspace to manage their repair-service activities.

### 3. Customer Dashboard

Customers can access repair services and manage their repair-service experience.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend Framework |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| Better Auth | Authentication |
| JWT | Token-based Authentication |
| MongoDB | Database |
| ImageBB | Image Hosting |
| Vercel | Deployment |

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB access
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/ShovonDas-Dev/Reparo-Client.git
```

**2. Navigate to the project directory**

```bash
cd Reparo-Client
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file in the root directory.

```env
# Add your MongoDB connection string
# Add your Better Auth configuration
# Add your ImageBB API key
```

Use the exact environment variable names required by your project.

**5. Start the development server**

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 📁 Project Structure

```text
Reparo-Client/
│
├── app/
│   ├── (routes)/
│   └── layout.js
│
├── components/
│   ├── ui/
│   └── shared/
│
├── hooks/
│
├── lib/
│
├── public/
│   └── reparo-cover.png
│
├── .env.local
├── package.json
└── README.md
```

*Note: This is an illustrative structure. Your actual project structure may differ.*

## 🌐 Live Deployment

Reparo is deployed using Vercel.

🔗 **Live Website:** https://reparo-client.vercel.app/

## 🔒 Security

- Authentication and authorization.
- Role-based dashboard access.
- Environment variables for sensitive configuration.
- Secure database connection configuration.

Never commit your actual API keys, database credentials, or authentication secrets to GitHub.

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Submit a pull request.

## 📄 License

No license has been specified for this project yet. Please contact the repository owner before reusing or distributing the code.

---

<div align="center">

### 🔧 Reparo — Good Repairs. Good People.

**Making Repair Services Easier, One Step at a Time.**

Made with ❤️ by the Reparo Development Team

[Live Website](https://reparo-client.vercel.app/) · [GitHub Repository](https://github.com/ShovonDas-Dev/Reparo-Client)

</div>
