# CookbookWorld

CookbookWorld is a web-based recipe discovery application designed to help users explore recipes, access nutritional information, and manage their favourite meals.

The application integrates the Spoonacular API to retrieve external recipe and nutritional information, providing users with recipe search and filtering options.

## Technologies Used

- **Frontend:** React.js, HTML, CSS and JavaScript
- **Backend:** Node.js and Express.js
- **Database:** MySQL
- **External API:** Spoonacular API
- **Hosting:** Amazon Web Services (AWS) – planned deployment using Amazon Linux
- **Content Delivery Network:** Cloudflare – planned integration

## Main Features

- User registration and login
- User profile management
- Recipe search and discovery
- Recipe filtering
- Recipe details and nutritional information
- Save and manage favourite recipes
- Responsive and mobile-friendly interface

## Project Structure

```text
CookbookWorld/
├── public/
├── src/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── favourites.js
│   └── server.js
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MySQL
- Spoonacular API key

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CookbookWorld
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a guide.

Enter your own database credentials, session secret and Spoonacular API key.

### 4. Start the frontend

```bash
npm run dev
```

### 5. Start the backend

Open a separate terminal, navigate to the server directory and install its dependencies if it has its own `package.json`.

```bash
cd server
npm install
node server.js
```

## API Integration

CookbookWorld uses the Spoonacular API to retrieve recipe information and nutritional data.

## Deployment

The application is intended to be hosted on Amazon Web Services (AWS), using Amazon Linux for the application and database servers. Cloudflare is planned as a Content Delivery Network (CDN) for static content distribution.

## Academic Project

CookbookWorld is developed as an academic web application project.