# Alternatives externes pour B.T.P.

## Firebase — solution BaaS complète recommandée pour démarrer vite

Firebase Authentication gère les comptes par e-mail/mot de passe et des fournisseurs fédérés. Cloud Firestore apporte une base de données NoSQL, temps réel et synchronisée ; Cloud Storage est adapté aux photos et vidéos, avec des règles liées à l’authentification.

- Auth : https://firebase.google.com/docs/auth
- Base : https://firebase.google.com/docs/firestore
- Médias : https://firebase.google.com/docs/storage

## Appwrite — solution open source et exportable

Appwrite rassemble l’authentification, les bases, le stockage, les fonctions et le temps réel. La même surface produit peut être utilisée dans Appwrite Cloud ou auto-hébergée, mais l’auto-hébergement implique l’exploitation et les sauvegardes de l’infrastructure.

- Documentation : https://appwrite.io/docs

## Neon — PostgreSQL lié à Vercel, mais incomplet seul

Neon apporte PostgreSQL managé et peut s’intégrer à Vercel via la Marketplace, avec prévisualisations de branches. Il ne couvre cependant pas seul l’authentification ni la médiathèque : ces briques doivent être ajoutées séparément.

- Guide : https://neon.com/docs/guides/vercel-overview
- Marketplace : https://vercel.com/marketplace/neon

## Décision recommandée

Pour B.T.P., Firebase est l’option la plus simple pour avancer rapidement : un seul projet couvre les demandes de devis, l’administration, les médias de chantier et la connexion administrateur. Appwrite devient le meilleur choix lorsqu’une future auto-hébergement et une portabilité maximale justifient plus d’exploitation. Neon convient mieux à une architecture PostgreSQL sur mesure avec un back-end séparé.
