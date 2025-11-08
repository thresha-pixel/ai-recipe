(() => {
  const form = document.getElementById('recipe-form');
  const output = document.getElementById('output');
  const generateBtn = document.getElementById('generate-btn');
  const clearBtn = document.getElementById('clear-btn');

  function parseIngredients(raw) {
    if (!raw) return [];
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }

  function renderRecipe(content) {
    output.setAttribute('aria-busy', 'false');
    output.innerHTML = `
      <article class="recipe">
        <pre>${content}</pre>
      </article>
    `;
  }

  function renderLoading() {
    output.setAttribute('aria-busy', 'true');
    output.innerHTML = '<div class="placeholder"><p>Generating your recipe…</p></div>';
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    generateBtn.disabled = true;
    renderLoading();

    const diet = document.getElementById('diet').value;
    const cuisine = document.getElementById('cuisine').value;
    const ingredients = parseIngredients(document.getElementById('ingredients').value);
    const time = document.getElementById('time').value;
    const servings = document.getElementById('servings').value;

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diet, cuisine, ingredients, time, servings })
      });

      const data = await response.json();
      renderRecipe(data.recipe);
    } catch (err) {
      output.innerHTML = `<p style="color:red;">Error: Could not generate recipe</p>`;
    } finally {
      generateBtn.disabled = false;
    }
  });

  clearBtn?.addEventListener('click', () => {
    form.reset();
    output.innerHTML = '<div class="placeholder"><p>Your recipe will appear here.</p></div>';
  });
})();
