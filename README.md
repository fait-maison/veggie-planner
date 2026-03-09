# Veggie Planner

Application web de planification de repas végétariens et de génération de liste de courses

## Fonctionnalités (MVP v1.0)

- **Planning** : parcourir les recettes, sélectionner les plats de la semaine, constituer « Ma liste »
- **Génération de liste de courses** : ingrédients consolidés et dédoublonnés depuis les plats sélectionnés
- **Produits récurrents** : articles pré-cochés par défaut chaque semaine (configurables)
- **Cases à cocher** : suivi des achats en magasin, ajout manuel d'articles
- **Bibliothèque de recettes** : recherche par nom/ingrédient, favoris, suppression
- **Ajout manuel de recettes** : nom, ingrédients, source de protéines
- **Persistance** : toutes les données sauvegardées en localStorage (recettes, planning, récurrents)

Interface sobre, palette naturelle/terreuse, desktop-first.

## Stack

- **React 18** + **Vite 5**
- CSS-in-JS avec design tokens (`src/tokens.js`)
- Stockage : localStorage (hook `useLocalStorage`)
- Runtime : Nginx (image Docker multi-stage)
- CI/CD : GitHub Actions → GHCR

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run preview` — prévisualisation du build

## Structure du projet

```
src/
  components/       # Header, Card, Panel, Button
  pages/            # PlanningPage, CoursesPage, RecettesPage
  data/             # demoData.js (recettes initiales)
  hooks/            # useLocalStorage
  utils/            # generateShoppingList
  tokens.js         # Design tokens (couleurs, spacing, radius, shadows)
  App.jsx
  main.jsx
```

## Déploiement

```bash
# Docker
docker build -t veggie-planner .

# Helm
helm install veggie-planner helm/veggie-planner/ --set ingress.enabled=true
```
