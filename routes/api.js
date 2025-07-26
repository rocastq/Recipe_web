const express = require('express');
const axios = require('axios');
const router = express.Router();

const SPOONACULAR_API_KEY = '346d0a6cdf4c4905b34f4b95c3954fa1';

// Ingredient autocomplete API 
router.get('/ingredientSearch', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/food/ingredients/autocomplete`,
      {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          query: q,
          number: 5
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;
