const express = require('express');
const Recipe = require('../models/Recipe');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Get all recipes (public)
router.get('/', async (req, res) => {
  const recipes = await Recipe.find().populate('createdBy', 'email');
  res.render('recipes/index', { recipes });
});

// New recipe form
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('recipes/new');
});

// Create new recipe
router.post('/', ensureAuthenticated, async (req, res) => {
  const { title, description, ingredients, steps } = req.body;

  const recipe = new Recipe({
    title,
    description,
    ingredients: ingredients.split(',').map(i => i.trim()),
    steps: steps.split('\n').map(s => s.trim()),
    createdBy: req.user.id,
  });

  await recipe.save();
  req.flash('success_msg', 'Recipe created!');
  res.redirect('/recipes');
});

// View one recipe
router.get('/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'email');
  if (!recipe) {
    req.flash('error_msg', 'Recipe not found');
    return res.redirect('/recipes');
  }
  res.render('recipes/show', { recipe });
});

// Edit recipe form
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    req.flash('error_msg', 'Recipe not found');
    return res.redirect('/recipes');
  }
  // Only creator can edit
  if (!recipe.createdBy.equals(req.user._id)) {
    req.flash('error_msg', 'Not authorized');
    return res.redirect('/recipes');
  }
  res.render('recipes/edit', { recipe });
});

// Update recipe
router.post('/:id', ensureAuthenticated, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    req.flash('error_msg', 'Recipe not found');
    return res.redirect('/recipes');
  }
  if (!recipe.createdBy.equals(req.user._id)) {
    req.flash('error_msg', 'Not authorized');
    return res.redirect('/recipes');
  }

  recipe.title = req.body.title;
  recipe.description = req.body.description;
  recipe.ingredients = req.body.ingredients.split(',').map(i => i.trim());
  recipe.steps = req.body.steps.split('\n').map(s => s.trim());

  await recipe.save();
  req.flash('success_msg', 'Recipe updated');
  res.redirect(`/recipes/${recipe.id}`);
});

// Delete recipe
router.post('/:id/delete', ensureAuthenticated, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    req.flash('error_msg', 'Recipe not found');
    return res.redirect('/recipes');
  }
  if (!recipe.createdBy.equals(req.user._id)) {
    req.flash('error_msg', 'Not authorized');
    return res.redirect('/recipes');
  }
  await recipe.deleteOne();
  req.flash('success_msg', 'Recipe deleted');
  res.redirect('/recipes');
});

module.exports = router;
