/**
 * Génère une liste de courses dédoublonnée depuis un tableau de recettes.
 * La comparaison est insensible à la casse.
 *
 * @param {Array} recipes - Tableau de recettes ({ ingredients: string[] })
 * @param {string[]} exclude - Ingrédients à exclure (déjà disponibles à la maison)
 * @returns {string[]} Liste d'ingrédients uniques, triée alphabétiquement
 */
export const generateShoppingList = (recipes, exclude = []) => {
  const seen = new Set();
  const excludeSet = new Set(exclude.map(e => e.trim().toLowerCase()));
  const ingredients = [];

  recipes.forEach(recipe => {
    if (!recipe.ingredients) return;
    recipe.ingredients.forEach(ingredient => {
      const normalized = ingredient.trim().toLowerCase();
      if (!seen.has(normalized) && !excludeSet.has(normalized)) {
        seen.add(normalized);
        ingredients.push(ingredient.trim());
      }
    });
  });

  return ingredients.sort((a, b) => a.localeCompare(b, 'fr'));
};
