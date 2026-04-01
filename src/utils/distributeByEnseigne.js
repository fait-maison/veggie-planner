/**
 * Distribue une liste d'articles par enseigne selon les items embarqués dans chaque enseigne.
 *
 * @param {string[]} items - Liste des noms d'articles
 * @param {Array<{id: number, name: string, items: string[]}>} enseignes
 * @returns {{ [enseigneId: number]: string[], unassigned: string[] }}
 */
export function distributeByEnseigne(items, enseignes) {
  const result = { unassigned: [] };
  enseignes.forEach(e => { result[e.id] = []; });

  items.forEach(item => {
    const normalized = item.trim().toLowerCase();
    const enseigne = enseignes.find(e =>
      (e.items ?? []).some(i => i.trim().toLowerCase() === normalized)
    );
    if (enseigne) result[enseigne.id].push(item);
    else result.unassigned.push(item);
  });

  return result;
}
