# Veggie Planner

Application web de planification de repas végétariens et de listes de courses.

## Description

Veggie Planner permet de :

- **Planning** : parcourir des suggestions de recettes végétariennes (région Lille, recettes d'hiver), sélectionner les plats pour la semaine et constituer « Ma liste ».
- **Génération de liste de courses** : à partir des plats sélectionnés (7 plats minimum), générer une liste de courses organisée.
- **Recettes** : gérer ses recettes et ses sources (sites, blogs).
- **Courses** : consulter et cocher la liste de courses par enseigne.
- **Enseignes** : gérer les magasins où l’on fait ses courses.

Interface sobre, palette naturelle/terreuse, pensée desktop-first.

## Stack

- **React 18** avec **Vite**
- Design tokens (couleurs, espacements, rayons, ombres) dans `src/tokens.js`
- Données de démo dans `src/data/demoData.js`

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
  components/   # Header, Card, Panel, Button
  pages/       # PlanningPage, etc.
  data/        # demoData.js (recettes de démo)
  tokens.js     # Design tokens
  App.jsx
  main.jsx
```

## Licence

Projet de formation.
