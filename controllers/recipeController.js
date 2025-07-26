const Recipe = require('../models/Recipe');

// List recipes
exports.listRecipes = async (req, res) => {
  const publicRecipes = await Recipe.find({ public: true });
  const privateRecipes = await Recipe.find({ user: req.session.userId, public: false });
  res.render('recipes/index', { publicRecipes, privateRecipes, user: req.session.username });
};

// Show form to create a new recipe
exports.newRecipeForm = (req, res) => {
  res.render('recipes/new', { user: req.session.username });
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
  let ingredients = [];
  if (req.body['ingredients'] && Array.isArray(req.body['ingredients'])) {
    ingredients = req.body['ingredients'].map(ing => ({
      name: ing.name,
      quantity: ing.quantity
    }));
  } else if (req.body['ingredients']) {
    ingredients = [{
      name: req.body['ingredients'].name,
      quantity: req.body['ingredients'].quantity
    }];
  }

  const recipe = new Recipe({
    title: req.body.title,
    description: req.body.description,
    ingredients,
    instructions: req.body.instructions,
    public: req.body.public === 'on',
    user: req.session.userId,
    username: req.session.username,
    image: req.file ? '/uploads/' + req.file.filename : ''
  });

  await recipe.save();
  res.redirect('/recipes');
};

// Show a single recipe
exports.showRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.send('Recipe not found');
  if (!recipe.public && recipe.user.toString() !== req.session.userId) return res.send('Not allowed');
  res.render('recipes/show', { recipe, user: req.session.username });
};

// Show form to edit a recipe
exports.editRecipeForm = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe || recipe.user.toString() !== req.session.userId) return res.send('Not allowed');
  res.render('recipes/edit', { recipe, user: req.session.username });
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
  let ingredients = [];
  if (req.body['ingredients'] && Array.isArray(req.body['ingredients'])) {
    ingredients = req.body['ingredients'].map(ing => ({
      name: ing.name,
      quantity: ing.quantity
    }));
  } else if (req.body['ingredients']) {
    ingredients = [{
      name: req.body['ingredients'].name,
      quantity: req.body['ingredients'].quantity
    }];
  }
  const update = {
    title: req.body.title,
    description: req.body.description,
    ingredients,
    instructions: req.body.instructions,
    public: req.body.public === 'on'
  };
  if (req.file) update.image = '/uploads/' + req.file.filename;
  await Recipe.findByIdAndUpdate(req.params.id, update);
  res.redirect('/recipes');
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (recipe && recipe.user.toString() === req.session.userId) {
    await Recipe.findByIdAndDelete(req.params.id);
  }
  res.redirect('/recipes');
};
