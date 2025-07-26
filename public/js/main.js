document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('ingredientSearch');
  const searchResults = document.getElementById('searchResults');
  const selectedContainer = document.getElementById('selectedIngredients');
  const ingredientInputName = 'ingredients';

  let selectedIngredients = window.selectedIngredients || [];

  function renderSelectedIngredients() {
    if (!selectedContainer) return;

    selectedContainer.innerHTML = '';

    selectedIngredients.forEach((ingredient, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'mb-2 p-2 border rounded';

      const label = document.createElement('strong');
      label.textContent = ingredient.name;
      wrapper.appendChild(label);

      const quantityInput = document.createElement('input');
      quantityInput.type = 'text';
      quantityInput.className = 'form-control form-control-sm mt-1';
      quantityInput.placeholder = 'Quantity (e.g. 1 cup)';
      quantityInput.value = ingredient.quantity || '';
      quantityInput.addEventListener('input', (e) => {
        selectedIngredients[index].quantity = e.target.value;
        updateHiddenInputs();
      });
      wrapper.appendChild(quantityInput);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-sm btn-danger mt-1';
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = () => {
        selectedIngredients.splice(index, 1);
        renderSelectedIngredients();
      };
      wrapper.appendChild(removeBtn);

      selectedContainer.appendChild(wrapper);
    });

    updateHiddenInputs();
  }

  function updateHiddenInputs() {
    const oldInputs = document.querySelectorAll(`input[name="${ingredientInputName}"]`);
    oldInputs.forEach(input => input.remove());

    selectedIngredients.forEach(ingredient => {
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = ingredientInputName;
      hiddenInput.value = JSON.stringify(ingredient);
      selectedContainer.appendChild(hiddenInput);
    });
  }

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', async () => {
      const query = searchInput.value.trim();
      if (!query) {
        searchResults.innerHTML = '';
        return;
      }

      try {
        const response = await fetch(`/recipes/ingredients/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        searchResults.innerHTML = '';
        data.forEach(item => {
          const li = document.createElement('li');
          li.className = 'list-group-item list-group-item-action';
          li.textContent = item.name;
          li.addEventListener('click', () => {
            selectedIngredients.push({ name: item.name, quantity: '' });
            renderSelectedIngredients();
            searchInput.value = '';
            searchResults.innerHTML = '';
          });
          searchResults.appendChild(li);
        });
      } catch (err) {
        console.error('API search error:', err);
      }
    });
  }

  renderSelectedIngredients();
});
