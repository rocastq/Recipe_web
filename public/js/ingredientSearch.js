

document.addEventListener('DOMContentLoaded', function() {
  const searchInputs = document.querySelectorAll('.ingredient-search-input');
  searchInputs.forEach(input => {

    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'ingredient-suggestions list-group position-absolute';
    suggestionBox.style.zIndex = 1000;
    input.parentNode.appendChild(suggestionBox);

    input.addEventListener('input', async function() {
      const query = input.value.trim();
      if (!query) {
        suggestionBox.innerHTML = '';
        return;
      }
      try {
        const res = await fetch(`/api/ingredientSearch?q=${encodeURIComponent(query)}`);
        const suggestions = await res.json();
        suggestionBox.innerHTML = '';
        suggestions.forEach(item => {
          const option = document.createElement('button');
          option.type = 'button';
          option.className = 'list-group-item list-group-item-action';
          option.textContent = item.name;
          option.onclick = () => {
            addIngredient(item.name);
            input.value = '';
            suggestionBox.innerHTML = '';
          };
          suggestionBox.appendChild(option);
        });
      } catch (err) {
        suggestionBox.innerHTML = '';
      }
    });


    input.addEventListener('blur', function() {
      setTimeout(() => suggestionBox.innerHTML = '', 200);
    });
  });
});

if (typeof addIngredient !== "function") {
  window.addIngredient = function(name='', quantity='') {
    const div = document.createElement('div');
    div.classList.add('input-group', 'mb-1');
    div.innerHTML = `
      <input name="ingredients[name]" class="form-control" placeholder="Ingredient" value="${name}">
      <input name="ingredients[quantity]" class="form-control" placeholder="Quantity" value="${quantity}">
      <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()">X</button>
    `;
    document.getElementById('ingredients-list').appendChild(div);
  }
}
