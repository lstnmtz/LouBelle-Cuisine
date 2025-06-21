# Cahier des charges : Application PWA de gestion de recettes et planification de repas

## Contexte et Objectif

Une Progressive Web App (PWA) mobile-first destinée à un usage personnel pour gérer des recettes de cuisine et organiser la planification des repas hebdomadaires. L’application fonctionnera entièrement hors ligne, sans base de données centralisée ni synchronisation externe. Elle permettra à l’utilisateur de consulter et d’ajouter ses propres recettes stockées en local sous forme de fichiers JSON, et de composer facilement des menus pour la semaine avec génération automatique des listes de courses. Le résultat sera également converti en application Android via Capacitor.

**Objectifs principaux :**

* Gérer une collection de recettes personnelles (hors ligne).
* Planifier facilement les repas de la semaine (petit-déjeuner, déjeuner, dîner, etc.) pour plusieurs personnes.
* Générer automatiquement la liste de courses avec ajustements (quantités et ingrédients disponibles).

## Fonctionnalités principales

* **Ajout de recettes** : création et édition de recettes via l’interface. Chaque nouvelle recette est sauvegardée dans un fichier JSON local.
* **Affichage de recettes** : l’application affiche pour chaque recette tous les champs suivants :

  * **Titre** de la recette (ex : *“Omelette aux fines herbes”*).
  * **Image** illustrative (URL ou fichier local).
  * **Nombre de personnes** servi par la recette.
  * **Liste d’ingrédients** (avec nom, quantité, unité et type, cf. ex. JSON).
  * **Instructions de préparation** (étapes détaillées).
  * **Catégorie** (exemple : *“Petit-déjeuner”*, *“Déjeuner”*, *“Dîner”*, etc.).
  * **Calories et macronutriments par personne** (optionnellement affichés ou masqués).
  * **Temps de préparation** et **temps de cuisson** (en minutes).
* **Recherche et filtrage** : l’utilisateur peut rechercher et filtrer les recettes selon plusieurs critères :

  * Par **mot-clé** (dans le titre ou les ingrédients).
  * Par **catégorie** (petit-déj., déjeuner, dîner, etc.), **tags** (fonctionnalité future), **type d’ingrédient** ou **temps de cuisson/préparation**.
  * **Recette aléatoire par catégorie** (fonction de type *“Surprise du chef”*).
* **Planification des repas** : gestion d’un planning hebdomadaire :

  * Saisie des recettes pour chaque jour de la semaine (plusieurs créneaux/jours, ex. petit-déj, midi, soir).
  * **Génération automatique de la liste de courses** basée sur toutes les recettes sélectionnées de la semaine.
  * **Marquage des ingrédients déjà disponibles** (pour ne pas les ajouter à la liste de courses).
  * **Ajustement des quantités** d’ingrédients en fonction du nombre de personnes (adaptation dynamique).
  * **Regroupement des ingrédients par type** (ex. : légumes, viandes, épices) dans la liste de courses.

## Structure des fichiers JSON

Les données sont stockées dans des fichiers JSON locaux. Ci-dessous des exemples de structure :

**Exemple de fichier de recette (`recette.json`) :**

```json
{
  "titre": "Omelette aux fines herbes",
  "image": "images/omelette.jpg",
  "nombrePersonnes": 2,
  "categorie": "Petit-déjeuner",
  "caloriesParPersonne": 250,
  "macronutrimentsParPersonne": {
    "proteines": 15,
    "lipides": 20,
    "glucides": 1
  },
  "tempsPreparation": 5,
  "tempsCuisson": 5,
  "ingredients": [
    {
      "nom": "Oeufs",
      "quantite": 4,
      "unite": "pièce",
      "type": "Produits animaux"
    },
    {
      "nom": "Herbes de Provence",
      "quantite": 1,
      "unite": "cuillère à café",
      "type": "Épices"
    }
  ],
  "instructions": [
    "Battre les œufs avec les herbes dans un bol.",
    "Verser le mélange dans une poêle chaude et cuire jusqu'à ce que l'omelette soit bien prise."
  ]
}
```

**Exemple de fichier de planning hebdomadaire (`planning.json`) :**

```json
{
  "semaine": "2025-06-23",
  "personnes": 4,
  "recettesParJour": {
    "Lundi": ["Omelette aux fines herbes", "Salade de riz au poulet"],
    "Mardi": ["Smoothie banane", "Soupe de légumes", "Steak grillé"],
    "Mercredi": ["Pancakes aux fruits"]
  }
}
```

## Contraintes techniques

* **Responsive mobile** : l’interface doit être optimisée pour les smartphones Android (design mobile-first).
* **Fonctionnement hors-ligne complet** : le PWA doit être utilisable sans connexion réseau. Implémenter un service worker pour le cache des ressources (app shell) et utiliser les fichiers JSON locaux comme base de données.
* **Compatibilité Capacitor** : prévoir que l’application web tourne dans un conteneur Capacitor pour générer l’APK Android.
* **Support tablette** : anticiper une interface adaptative/tablette à l’avenir (responsive design pour écrans plus grands).
* **Manifest et installation** : fournir un `manifest.json` adéquat (icônes, nom d’application) pour permettre l’installation de la PWA sur l’écran d’accueil.

## UX/UI

* **Design mobile-first** : interface épurée et intuitive, pensée pour une navigation à une main.
* **Navigation claire** : menus ou onglets simples (recettes, planning, courses, paramètres).
* **Mode Sombre** : prise en charge obligatoire du dark mode (adaptation de la palette de couleurs, avec bascule automatique ou manuelle).
* **Boutons d’action flottants** : utiliser des boutons flottants (Floating Action Buttons) pour les actions principales (ajout de recette, accès rapide au planning, ajout d’ingrédient, etc.).
* **Éléments visuels** : photos ou icônes pour illustrer les catégories de recettes, retour visuel clair lors de l’ajout d’éléments ou de la génération de la liste de courses.

## Plan de tests

* **Recettes** : tester l’ajout, la modification et l’affichage des recettes via les fichiers JSON (cohérence des champs, images, quantities).
* **Recherche et filtres** : vérifier que la recherche par mot-clé et les filtres (catégorie, ingrédients, temps de cuisson) fonctionnent et combinent correctement.
* **Planification** : tester la création d’un planning hebdomadaire avec plusieurs repas par jour, le passage d’un jour à l’autre et le calcul des quantités (ajustements selon le nombre de personnes).
* **Liste de courses** : valider la génération de la liste de courses à partir du planning, y compris le regroupement par type d’ingrédients et la gestion des ingrédients déjà disponibles.
* **Performance hors-ligne** : s’assurer que l’application reste fonctionnelle sans réseau (chargement depuis cache, persistance des données JSON).

## Livraison et Déploiement

* **Livraison initiale** : version PWA locale finalisée, prête à être déployée sur un serveur web ou utilisée en local sur le smartphone.
* **Conversion Android** : génération de l’APK Android à l’aide de Capacitor, incluant toutes les ressources (icônes, manifest, service worker).
* **Documentation** : fournir un guide d’installation/synchronisation (si nécessaire) et un manuel d’utilisation succinct pour l’utilisateur.

## Évolutivité future

* **Support tablette Android** : adapter l’interface pour les écrans plus grands (layouts multi-colonnes).
* **Favoris** : fonctionnalité de marquage de recettes favorites pour un accès rapide.
* **Impression/Export** : possibilité d’imprimer ou d’exporter les recettes et la liste de courses (format PDF, export JSON, etc.).
* **Filtres avancés** : ajouter des filtres supplémentaires (par tags personnalisés, profil nutritionnel, saisonnalité des aliments).
