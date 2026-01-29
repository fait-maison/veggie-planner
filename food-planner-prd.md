# Document d'Exigences Produit : Veggie Planner

## Présentation du Produit
**Vision Produit :** Application web pour faciliter la planification hebdomadaire des repas et la gestion des listes de courses d'un couple lillois végétarien, privilégiant les produits locaux et de saison. Le produit vise à réduire la charge mentale liée à l'organisation des courses en proposant des idées de repas variées, en évitant l'oubli de recettes appréciées et en limitant le gaspillage alimentaire.

**Utilisateurs Cibles :** Couple végétarien d'environ 30 ans, basé à Lille, avec une forte sensibilité aux produits locaux, de saison et aux circuits courts.

**Objectifs Business :** 
- Réduire le temps de préparation de la liste de courses de 60%
- Introduire au moins 3 nouvelles recettes par semaine
- Assurer une utilisation hebdomadaire régulière par les utilisateur·ices

**Indicateurs de Succès :** 
- Introduction de 3+ nouvelles recettes par semaine
- Réduction du temps de préparation de la liste de 60%
- Réutilisation de 50% des recettes appréciées sur un mois
- Réduction du gaspillage alimentaire de 30%
- Aucun oubli d'ingrédient récurrent sur 4 semaines consécutives
- Respect de la contrainte protéines dans 100% des plats

## Personas Utilisateurs

### Persona 1 : Alex (Personne A du couple)
- **Données démographiques :** ~30 ans, actif·ve professionnellement, utilisateur·ice web/mobile standard
- **Objectifs :** 
  - Varier l'alimentation avec de nouvelles idées de repas
  - Réduire le temps passé à organiser les courses
  - Respecter les contraintes nutritionnelles (source de protéines dans chaque plat)
  - Privilégier les produits locaux et de saison
- **Points de douleur :** 
  - Manque d'inspiration pour les repas (problème CRITIQUE)
  - Organisation manuelle de la liste chronophage
  - Difficulté à se souvenir des recettes déjà testées et réussies
  - Oubli d'ingrédients récurrents nécessitant des courses supplémentaires
- **Parcours Utilisateur :** Utilise l'application côte à côte avec son·sa partenaire sur le même appareil pour planifier ensemble les repas de la semaine

### Persona 2 : Sam (Personne B du couple)
- **Données démographiques :** ~30 ans, actif·ve professionnellement, utilisateur·ice web/mobile standard
- **Objectifs :** 
  - Contribuer à la planification des repas de manière collaborative
  - Éviter le gaspillage des ingrédients déjà disponibles
  - Faciliter les achats dans les 6 enseignes habituelles
- **Points de douleur :** 
  - Répétition des mêmes plats par manque de temps pour chercher des idées
  - Ingrédients achetés qui ne sont finalement pas utilisés
  - Éparpillement des courses dans plusieurs enseignes sans organisation claire
- **Parcours Utilisateur :** Participe activement à la sélection des plats et à la validation de la liste finale avant de partir faire les courses

## Exigences Fonctionnelles

| Fonctionnalité | Description | User Stories | Priorité | Critères d'Acceptation | Dépendances |
|----------------|-------------|--------------|----------|------------------------|-------------|
| **Planning des repas** | Sélection de 7 à 10 plats par semaine sous forme de liste simple (pas de calendrier strict) | En tant qu'utilisateur·ice, je veux sélectionner facilement mes plats de la semaine pour gagner du temps | Must | - Affichage liste de 7-10 plats<br>- Ajout/suppression de plats<br>- Indication de la source de protéines pour chaque plat<br>- Sauvegarde automatique | Bibliothèque de recettes |
| **Suggestions IA de recettes** | Propositions de recettes végétariennes de saison adaptées à la région lilloise | En tant qu'utilisateur·ice, je veux recevoir des suggestions inspirantes pour varier mes repas | Must | - Minimum 10 suggestions affichées<br>- Recettes de saison (données Lille)<br>- Chaque recette contient une source de protéines<br>- Possibilité de marquer en favori | Aucune |
| **Bibliothèque de recettes** | Stockage et gestion des recettes favorites et personnelles | En tant qu'utilisateur·ice, je veux retrouver facilement mes recettes préférées | Must | - Sauvegarde persistante des recettes<br>- Recherche par nom ou ingrédient<br>- Marquage favoris<br>- Suppression possible | localStorage |
| **Ajout manuel de recettes** | Création de recettes personnalisées avec nom, ingrédients et source de protéines | En tant qu'utilisateur·ice, je veux ajouter mes propres recettes | Must | - Formulaire nom + ingrédients + source de protéines<br>- Validation de la saisie<br>- Ajout à la bibliothèque | Bibliothèque de recettes |
| **Génération automatique de la liste de courses** | Extraction et dédoublonnage des ingrédients depuis les plats sélectionnés | En tant qu'utilisateur·ice, je veux obtenir automatiquement ma liste de courses | Must | - Extraction des ingrédients de tous les plats sélectionnés<br>- Dédoublonnage automatique<br>- Affichage liste consolidée | Planning des repas |
| **Produits récurrents** | Liste de produits cochés par défaut chaque semaine | En tant qu'utilisateur·ice, je veux ne jamais oublier mes produits hebdomadaires | Must | - Liste modifiable de produits récurrents<br>- Cochés par défaut dans la liste<br>- Activation/désactivation ponctuelle | Génération liste de courses |
| **Ajout manuel d'articles** | Possibilité d'ajouter des ingrédients supplémentaires directement à la liste | En tant qu'utilisateur·ice, je veux ajouter des articles hors recettes | Must | - Champ d'ajout rapide<br>- Ajout à la liste existante | Génération liste de courses |
| **Cases à cocher** | Suivi des articles achetés en magasin | En tant qu'utilisateur·ice, je veux cocher mes articles au fur et à mesure des achats | Must | - Case à cocher par article<br>- Compteur articles cochés<br>- État sauvegardé | Génération liste de courses |
| **Import depuis URLs** | Extraction automatique du nom et des ingrédients depuis un lien web | En tant qu'utilisateur·ice, je veux importer facilement des recettes depuis mes sites préférés | Should | - Champ URL<br>- Extraction automatique nom + ingrédients<br>- Support Pick Up Limes et Rainbow Plant Life<br>- Ajout à la bibliothèque | Bibliothèque de recettes, Backend |
| **Répartition par enseigne** | Organisation automatique et/ou manuelle des articles par magasin | En tant qu'utilisateur·ice, je veux organiser mes courses par enseigne pour optimiser mes déplacements | Should | - Répartition automatique selon mapping produits→enseignes<br>- Ajustement manuel (glisser-déposer)<br>- 6 enseignes par défaut modifiables | Génération liste de courses, Gestion enseignes |
| **Gestion des enseignes** | Configuration personnalisable des magasins habituels | En tant qu'utilisateur·ice, je veux personnaliser mes enseignes selon mes habitudes | Should | - Ajout/modification/suppression d'enseignes<br>- Ordre de priorité<br>- Spécialités par enseigne | Aucune |
| **Inventaire "Ce que j'ai déjà"** | Saisie des ingrédients périssables disponibles au domicile | En tant qu'utilisateur·ice, je veux éviter d'acheter ce que j'ai déjà | Could | - Section dédiée inventaire<br>- Suggestions de recettes utilisant ces ingrédients<br>- Exclusion automatique de la liste de courses | Suggestions IA, Génération liste |
| **Historique des semaines** | Consultation et réutilisation des plannings précédents | En tant qu'utilisateur·ice, je veux revoir mes anciennes planifications | Could | - Liste des semaines passées<br>- Réutilisation rapide d'un planning<br>- Statistiques recettes les plus utilisées | Stockage persistant |
| **Export PDF** | Génération d'un document imprimable ou consultable en magasin | En tant qu'utilisateur·ice, je veux emporter ma liste en courses | Could | - Export PDF organisé par enseigne<br>- Format optimisé impression et mobile | Répartition par enseigne |

_Note : la colonne "Priorité" suit la méthode MoSCoW._
- **Must** : indispensable pour le MVP
- **Should** : important, mais contournable
- **Could** : optionnel / "nice-to-have"
- **Won't** : hors scope pour cette release

## Parcours Utilisateurs

### Parcours 1 : Planification hebdomadaire des repas
1. Utilisateur·ice ouvre l'application en début de semaine
2. Consulte les suggestions de recettes (onglet "Suggestions IA")
   - Peut basculer sur "Mes favoris" ou "Recettes passées"
3. Clique sur les recettes qui l'intéressent (7 à 10 plats)
   - Chaque recette sélectionnée s'ajoute à "Ma liste" (panneau de droite)
   - Indicateur visuel de sélection (coche verte)
4. Peut ajouter manuellement une recette via le bouton "Ajouter une recette manuellement"
   - Remplit nom, ingrédients, source de protéines
5. Vérifie la liste récapitulative dans le panneau "Ma liste"
   - Peut supprimer un plat (icône ×)
6. Clique sur "Générer la liste de courses"
   - Chemin alternatif : Peut revenir en arrière pour modifier la sélection
   - Cas d'erreur : Si moins de 7 plats, message suggérant d'en ajouter (sans bloquer)

### Parcours 2 : Gestion de la liste de courses
1. Après génération, utilisateur·ice arrive sur la page "Courses"
2. Consulte la liste d'ingrédients générée automatiquement
   - Ingrédients dédoublonnés
   - Produits récurrents déjà cochés par défaut
3. Peut ajouter manuellement des articles supplémentaires
4. Peut ajuster les produits récurrents (cocher/décocher)
5. En magasin, coche les articles au fur et à mesure des achats
   - Compteur d'articles cochés se met à jour
6. (Phase 2) Articles répartis par enseigne pour optimiser le parcours
   - Chemin alternatif : Peut ajuster manuellement la répartition (glisser-déposer)

### Parcours 3 : Ajout d'une recette favorite
1. Utilisateur·ice consulte la bibliothèque (page "Recettes")
2. Clique sur "Ajouter"
3. Saisit le nom de la recette
4. Ajoute les ingrédients (un par ligne ou séparés par des virgules)
5. Indique la source de protéines
6. Valide l'ajout
   - La recette apparaît dans la bibliothèque
   - Elle devient disponible dans les suggestions pour les prochaines semaines
7. Peut marquer la recette en favori (icône ❤️)
   - Cas d'erreur : Si source de protéines manquante, message d'alerte

## Exigences Non Fonctionnelles

### Performance
- **Temps de chargement :** < 2 secondes pour l'affichage initial
- **Utilisateurs simultanés :** 2 utilisateur·ices sur le même appareil (usage collaboratif local)
- **Temps de réponse :** < 500ms pour les interactions (ajout/suppression, cochage)

### Sécurité
- **Authentification :** Non requise pour le MVP (usage local, localStorage)
- **Autorisation :** Non applicable (pas de multi-utilisateurs)
- **Protection des données :** Données stockées localement dans le navigateur (localStorage), pas de transmission vers serveur pour le MVP

### Compatibilité
- **Appareils :** Desktop (priorité), tablettes (secondaire)
- **Navigateurs :** Chrome, Firefox, Safari, Edge (dernières versions stables)
- **Tailles d'écran :** Desktop-first, minimum 1280px de largeur recommandé pour confort d'utilisation collaborative

### Accessibilité
- **Niveau de conformité :** WCAG 2.1 AA visé
- **Exigences spécifiques :** 
  - Navigation au clavier
  - Contraste suffisant (tons naturels/terreux avec attention au contraste texte/fond)
  - Labels ARIA pour les éléments interactifs
  - Taille de police lisible (14px minimum pour le corps de texte)

## Spécifications Techniques

### Frontend
- **Stack technologique :** 
  - React 18+ (JSX)
  - Hooks (useState, useEffect, custom hooks)
  - CSS-in-JS (inline styles avec tokens de design)
- **Design System :** 
  - Palette : tons naturels/terreux (sage, cream, sand, terracotta, bark)
  - Typographie : DM Sans (corps), Fraunces (titres)
  - Tokens : colors, spacing, radius, shadow
  - Composants réutilisables : Button, Card, Panel
- **Responsive Design :** Desktop-first avec adaptation progressive vers tablette

### Backend
- **Stack technologique :** Non applicable pour MVP (frontend only)
- **Exigences API :** 
  - Phase Should : API pour import URLs (parsing HTML)
  - Phase Could : API Claude pour suggestions IA réelles
- **Base de données :** localStorage pour le MVP, migration envisageable vers Supabase/Firebase pour sync multi-appareils

### Infrastructure
- **Hébergement :** Vercel, Netlify ou GitHub Pages (hosting statique)
- **Scalabilité :** Non critique pour MVP (usage limité à un couple)
- **CI/CD :** Déploiement automatique via Git push (Vercel/Netlify)

## Analytics & Monitoring

### Phase MVP (tracking minimal)
- **Indicateurs clés :** 
  - Nombre de recettes sélectionnées par semaine
  - Nombre de recettes favorites
  - Nombre de produits récurrents configurés
- **Événements :** 
  - Sélection/désélection de recette
  - Ajout manuel de recette
  - Génération de liste de courses
  - Marquage favori
- **Tableaux de bord :** Console browser (localStorage inspection) pour debug
- **Alertes :** Non applicable pour MVP

### Phase Future (analytics avancées)
- Plats les plus préparés
- Fréquence d'achat par produit
- Saisonnalité des recettes utilisées
- Temps moyen de planification

## Planification des Releases

### MVP (v1.0) — Déjà implémenté
- **Fonctionnalités :** 
  - Planning de 7 à 10 repas
  - Suggestions de recettes de saison (données simulées)
  - Bibliothèque de recettes avec favoris
  - Ajout manuel de recettes
  - Génération automatique de liste d'ingrédients
  - Produits récurrents
  - Cases à cocher pour suivi en magasin
  - Stockage localStorage
- **Planning :** ✅ Livré en janvier 2026
- **Critères de succès :** 
  - Application fonctionnelle et utilisable chaque semaine
  - Gain de temps ressenti par les utilisateur·ices
  - Diversification des repas constatée

### Phase 2 (v1.1) — Optimisation du temps
- **Fonctionnalités :** 
  - Répartition automatique par enseigne (6 enseignes par défaut)
  - Mapping produits → enseignes
  - Répartition manuelle (glisser-déposer)
  - Gestion des enseignes (ajout/modification/suppression)
  - Amélioration produits récurrents (suggestions historique, fréquence)
- **Planning :** À définir (priorité haute)
- **Objectif :** Réduction significative du temps passé à organiser les courses par enseigne

### Phase 3 (v1.2) — Prévention du gaspillage
- **Fonctionnalités :** 
  - Section "Ce que j'ai déjà" (inventaire)
  - Suggestions basées sur l'inventaire
  - Exclusion automatique des ingrédients disponibles
  - Historique des semaines précédentes
  - Statistiques d'utilisation des recettes
- **Planning :** À définir
- **Objectif :** Réduction mesurable du gaspillage alimentaire

### Phase 4 (v2.0) — Finalisation et enrichissement
- **Fonctionnalités :** 
  - Export PDF optimisé (par enseigne, mobile-friendly)
  - Suggestions IA réelles (API Claude)
  - Import depuis URLs (Pick Up Limes, Rainbow Plant Life, extensible)
  - Interface collaborative optimisée (indicateurs modifications en cours)
  - Analytics avancées
- **Planning :** À définir
- **Objectif :** Produit complet et autonome avec intelligence artificielle intégrée

## Questions Ouvertes & Hypothèses

### Questions Ouvertes
- **Question 1 :** Quel backend utiliser pour l'import URLs sans problème de CORS ? (Next.js API routes, Cloudflare Workers, ou service tiers ?)
- **Question 2 :** À partir de combien de recettes le localStorage atteint-il ses limites (~5Mo) ? Faut-il migrer vers une base de données cloud ?
- **Question 3 :** Le mapping produits → enseignes doit-il être pré-rempli ou construit progressivement par l'utilisateur·ice ?
- **Question 4 :** Comment gérer les suggestions IA de saison en temps réel sans surcoût API (cache, pré-génération mensuelle) ?

### Hypothèses
- **Hypothèse 1 :** Les utilisateur·ices accepteront de renseigner manuellement leurs recettes initiales avant de bénéficier des suggestions IA (validation nécessaire pour MVP)
- **Hypothèse 2 :** L'usage côte à côte sur un même appareil est suffisant pour le couple ; pas besoin de synchronisation multi-appareils dans un premier temps
- **Hypothèse 3 :** La contrainte nutritionnelle (source de protéines obligatoire) sera respectée si l'interface le rappelle visuellement à chaque ajout de recette
- **Hypothèse 4 :** Les 6 enseignes par défaut couvrent 90% des besoins et seront rarement modifiées par les utilisateur·ices

## Annexes

### Analyse Concurrentielle
- **Mealime, Yummly, Paprika :** Applications de planification de repas avec recettes intégrées
  - **Forces :** Grande base de données de recettes, suggestions personnalisées
  - **Faiblesses :** Pas adaptées au contexte local français (enseignes, saisonnalité Lille), pas de focus végétarien avec contrainte protéines, pas de gestion multi-enseignes
- **Notion, Trello (templates courses) :** Outils généralistes adaptés en listes de courses
  - **Forces :** Flexibilité, personnalisation totale
  - **Faiblesses :** Nécessite configuration manuelle, pas de génération automatique, pas de suggestions intelligentes

### Résultats de la Recherche Utilisateur
- **Résultat 1 :** Le manque d'inspiration est le problème n°1 identifié (priorité CRITIQUE) — besoin de suggestions variées et de saison
- **Résultat 2 :** Le temps passé à organiser manuellement la liste de courses est perçu comme une tâche chronophage et répétitive
- **Résultat 3 :** L'oubli de recettes déjà testées et appréciées est une source de frustration récurrente
- **Résultat 4 :** La contrainte nutritionnelle (protéines) est importante et doit être intégrée nativement dans l'application

### Enseignements issus des Conversations IA
- **Conversation 1 :** Janvier 2026, Claude Sonnet 4.5
  - Validation de l'approche desktop-first pour usage collaboratif
  - Importance de la contrainte protéines rappelée visuellement
  - Recommandation de design minimaliste avec tons naturels/terreux pour cohérence avec valeurs écologiques
- **Cas limites générés par l'IA :** 
  - Recette sans source de protéines ajoutée manuellement → validation obligatoire
  - Plus de 10 plats sélectionnés → pas de blocage mais message informatif
  - Suppression accidentelle d'une recette favorite → confirmation avant suppression définitive
  - Import URL échoué (site non supporté) → message d'erreur clair avec possibilité d'ajout manuel
- **Améliorations suggérées par l'IA :** 
  - Ajouter un onglet "Historique" pour réutiliser des semaines passées
  - Implémenter un système de tags (saison, temps de préparation) pour filtrage avancé
  - Proposer des suggestions basées sur les recettes favorites (machine learning simple)

### Glossaire
- **MVP** : Minimum Viable Product — version initiale fonctionnelle avec fonctionnalités essentielles
- **localStorage** : API de stockage navigateur permettant la persistance locale des données
- **MoSCoW** : Méthode de priorisation (Must, Should, Could, Won't)
- **Produits récurrents** : Articles achetés systématiquement chaque semaine (yaourts, œufs, pain...)
- **Source de protéines** : Ingrédient obligatoire dans chaque plat (légumineuses, tofu, seitan, tempeh, œufs, yaourt, fromage)
- **Enseigne** : Magasin ou commerce habituel pour les courses (6 par défaut : Maraîcher Wazemmes, Parents Primeurs, Asie Nord, Day by day, Naturalia/Biocoop, O'Tera)
- **De saison** : Produits disponibles naturellement à la période actuelle (hiver à Lille pour les suggestions actuelles)
- **Mapping produits → enseignes** : Association automatique entre types d'ingrédients et magasins appropriés (ex: gingembre → Asie Nord)

---

**Document créé le :** 29 janvier 2026  
**Version :** 1.0  
**Destinataires :** Équipe de développement (Cursor AI, développeur·euses)  
**Prochaine revue :** Après implémentation Phase 2
