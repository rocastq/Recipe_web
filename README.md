# RecipeHub

RecipeHub is a full-stack web application that allows users to create, manage, and share cooking recipes. Users can:
- Sign up and log in securely
- Create new recipes with ingredients (searchable via Spoonacular API)
- Edit or delete their own recipes
- Set recipes as public or private
- Browse public recipes from other users
- Automatically populate ingredient suggestions and add quantities
- View preloaded public recipe samples

##  Tech Stack

- Node.js
- Express
- MongoDB & Mongoose
- EJS Templating Engine
- Bootstrap 5
- Spoonacular API (ingredient search)

##  Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/recipehub.git
   cd recipehub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your `.env` file:
   Create a `.env` file in the root folder and add:
   ```
   MONGO_URI=your_mongo_connection_string
   SESSION_SECRET=your_session_secret
   SPOONACULAR_API_KEY=your_spoonacular_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Visit the app:
   ```
   http://localhost:5000
   ```

##  Folder Structure

```
Recipe_web/
├── app.js
├── routes/
├── models/
├── views/
├── public/
├── config/
├── middleware/
├── .env
├── package.json
└── README.md
```

##  Features
- Full user authentication
- CRUD for recipes
- Ingredient search via API
- Public/private toggle
- Flash messages and Bootstrap UI

##  License

This project is for educational purposes only.
