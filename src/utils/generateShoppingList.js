/**
 * Génère une liste de courses dédoublonnée depuis un tableau de recettes.
 * La comparaison est insensible à la casse.
 *
 * @param {Array} recipes - Tableau de recettes ({ ingredients: string[] })
 * @returns {string[]} Liste d'ingrédients uniques, triée alphabétiquement
 */
export const generateShoppingList = (recipes) => {
  const seen = new Set();
  const ingredients = [];

  recipes.forEach(recipe => {
    if (!recipe.ingredients) return;
    recipe.ingredients.forEach(ingredient => {
      const normalized = ingredient.trim().toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        ingredients.push(ingredient.trim());
      }
    });
  });

  return ingredients.sort((a, b) => a.localeCompare(b, 'fr'));
};
