# Veggie Planner – Notes pour Claude

## Projet

Application web de planification de repas végétariens avec génération de liste de courses.

## Stack

- **Frontend** : React 18 + Vite 5
- **Styles** : CSS-in-JS avec design tokens (`src/tokens.js`)
- **Runtime** : Nginx (image Docker multi-stage)
- **CI/CD** : GitHub Actions → GHCR (`ghcr.io/clementineyadro/veggie-planner`)

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
├── pages/        # PlanningPage (seule page implémentée)
├── data/         # demoData.js (données statiques)
├── hooks/
├── utils/
├── tokens.js     # design tokens (couleurs, spacing, radius, shadows)
└── App.jsx
```

## Déploiement

- **Docker** : port 80 (Nginx)
- **Helm chart** : `helm/veggie-planner/` (ClusterIP, ingress désactivé par défaut)

```bash
helm lint helm/veggie-planner/
helm template veggie-planner helm/veggie-planner/
helm install veggie-planner helm/veggie-planner/ --set ingress.enabled=true
```

## Notes

- Pas de backend ni de base de données — données hardcodées dans `demoData.js`
- Pages Recettes, Courses, Enseignes : navigation présente mais non implémentée
- Palette : sage green, terracotta, cream
