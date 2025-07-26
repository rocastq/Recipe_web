const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: String,
  quantity: String,
});

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [IngredientSchema],
  instructions: String,
  image: String,
  public: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String
});

module.exports = mongoose.model('Recipe', RecipeSchema);
