const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/auth/login');
  next();
}

router.get('/', requireLogin, recipeController.listRecipes);

router.get('/new', requireLogin, recipeController.newRecipeForm);

router.post('/', requireLogin, upload.single('image'), recipeController.createRecipe);

router.get('/:id', requireLogin, recipeController.showRecipe);

router.get('/:id/edit', requireLogin, recipeController.editRecipeForm);

router.post('/:id', requireLogin, upload.single('image'), recipeController.updateRecipe);

router.post('/:id/delete', requireLogin, recipeController.deleteRecipe);

module.exports = router;
