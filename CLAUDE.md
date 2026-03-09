# Veggie Planner – Notes pour Claude

## Projet

Application web de planification de repas végétariens avec génération de liste de courses.

## Stack

- **Frontend** : React 18 + Vite 5
- **Styles** : CSS-in-JS avec design tokens (`src/tokens.js`)
- **Runtime** : Nginx (image Docker multi-stage)
- **CI/CD** : GitHub Actions → GHCR (`ghcr.io/fait-maison/veggie-planner`)

## Commandes

```bash
npm run dev      # dev server sur http://localhost:5173
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

## Structure

```
src/
├── components/   # Header, Card, Button, Panel
├── pages/        # PlanningPage, CoursesPage, RecettesPage
├── data/         # demoData.js (seed localStorage au premier lancement)
├── hooks/        # useLocalStorage
├── utils/        # generateShoppingList (dédoublonnage, tri fr)
├── tokens.js     # design tokens (couleurs, spacing, radius, shadows)
└── App.jsx       # routing, état partagé (recipes, selectedRecipes, recurringItems)
```

## Déploiement

- **Docker** : port 80 (Nginx)
- **Helm chart** : `helm/veggie-planner/` (ClusterIP, ingress désactivé par défaut)

```bash
helm lint helm/veggie-planner/
helm template veggie-planner helm/veggie-planner/
helm install veggie-planner helm/veggie-planner/ --set ingress.enabled=true
```

## État du MVP (mars 2026)

Toutes les fonctionnalités "Must" du PRD sont implémentées :
- Planning + sélection de recettes (localStorage)
- Génération de liste de courses avec dédoublonnage
- Page Courses : 2 colonnes (ingrédients | récurrents), cases à cocher, ajout manuel, déduplication inter-colonnes et intra-liste, persistance des états cochés (`veggie-checked`)
- Page Recettes : bibliothèque, recherche, favoris, ajout manuel, édition des ingrédients (modal), suppression
- Persistance complète en localStorage

Page Enseignes : navigation présente, non implémentée (Phase 2).

## Notes

- Pas de backend — tout en localStorage
- `demoData.js` sert uniquement de seed au premier lancement (si localStorage vide)
- Palette : sage green, terracotta, cream
- La source de protéines n'est plus affichée dans l'UI — c'est un critère réservé aux futures suggestions depuis des sites externes (Phase 4)
- Clés localStorage : `veggie-recipes`, `veggie-selected`, `veggie-recurring`, `veggie-checked`
