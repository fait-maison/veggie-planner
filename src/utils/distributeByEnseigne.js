/**
 * Distribue une liste d'articles par enseigne selon un mapping direct nom→id.
 *
 * @param {string[]} items - Liste des noms d'articles
 * @param {Array<{id: number, name: string}>} enseignes
 * @param {Object} itemEnseigneMap - { [normalizedItemName]: enseigneId }
 * @returns {{ [enseigneId: number]: string[], unassigned: string[] }}
 */
export function distributeByEnseigne(items, enseignes, itemEnseigneMap) {
  const result = { unassigned: [] };
  enseignes.forEach(e => { result[e.id] = []; });

  items.forEach(item => {
    const eid = itemEnseigneMap[item.trim().toLowerCase()];
    if (eid && result[eid] !== undefined) result[eid].push(item);
    else result.unassigned.push(item);
  });

  return result;
}
