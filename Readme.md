# Région Joseph — Site Web

**Version 1.0.0 — Release candidate**

## Présentation

Site web institutionnel statique de la Région Joseph, lié à l'Association des Éclaireurs et Éclaireuses Évangéliques de Côte d'Ivoire (AEEECI). Le projet présente les sections publiques actuellement prévues : la région, ses districts, ses groupes, ses activités, ses actualités, sa galerie, son engagement communautaire et ses moyens de contact.

Certaines informations institutionnelles restent marquées `TODO` ou « à confirmer » dans le site. Elles doivent être validées par les responsables avant toute publication officielle et ne doivent pas être remplacées par des suppositions.

## Technologies

- HTML5 sémantique
- CSS3 avec variables, grilles responsives et prise en charge de `prefers-reduced-motion`
- JavaScript vanilla, sans framework
- Font Awesome et Google Fonts chargés depuis leurs ressources externes déclarées dans `index.html`

## Structure du projet

```text
.
├── index.html
├── main.css
├── script.js
├── robots.txt
├── Readme.md
└── images/
    ├── html5.png
    ├── logo Aeeeci.jpg
    ├── logo region joseph.jpg
    ├── photo-region-joseph-01.jpg ... photo-region-joseph-24.jpg
    └── optimized/
        └── photo-region-joseph-01.jpg ... photo-region-joseph-24.jpg
```

Les fichiers `images/photo-region-joseph-*.jpg` sont les originaux conservés comme sauvegarde locale. La galerie publique utilise les 24 fichiers correspondants dans `images/optimized/`. Ne supprimez pas les originaux sans décision de conservation séparée.

`images/html5.png` est actuellement conservé dans le dossier mais n'est pas référencé par le site.

## Districts

La version actuelle présente exactement deux districts :

- District Eden
- District Bethel

Les statistiques, rattachements de groupes, coordonnées et autres contenus marqués `TODO` ou « à confirmer » restent soumis à validation officielle.

## Galerie

La galerie référence 24 images optimisées en JPEG. Les images sont chargées avec lazy loading lorsque nécessaire et disposent d'une ouverture en lightbox, d'une navigation précédent/suivant, d'une fermeture par bouton ou avec la touche `Échap`, ainsi que d'un support clavier.

## Lancer le site localement

Pour un aperçu simple, ouvrez `index.html` dans un navigateur. Pour reproduire un environnement HTTP local, lancez un serveur statique depuis ce dossier, par exemple :

```bash
python -m http.server 8000
```

Puis ouvrez `http://localhost:8000/`.

## Fichiers nécessaires à la production

Publiez `index.html`, `main.css`, `script.js`, `robots.txt`, les logos utilisés et le dossier `images/optimized/`. Les 24 originaux peuvent rester hors de l'hébergement public comme sauvegarde locale. Le fichier `.gitignore` exclut les réglages locaux, sauvegardes, fichiers temporaires et fichiers susceptibles de contenir des secrets ; il ne masque pas les images optimisées nécessaires au fonctionnement du site.

## Avant la mise en ligne

- Remplacer `TODO_URL_SITE` dans les métadonnées par le domaine officiel lorsqu'il sera connu.
- Ajouter l'URL définitive du sitemap dans `robots.txt` si un sitemap est publié.
- Valider les statistiques, contacts, responsables, événements et contenus institutionnels encore marqués `TODO` ou « à confirmer ».
- Configurer les en-têtes de sécurité chez l'hébergeur.
- Vérifier que le formulaire `mailto:` utilise une adresse publique confirmée, ou mettre en place un service serveur si un traitement fiable des messages est requis.

Aucun push GitHub n'est effectué par cette préparation.
