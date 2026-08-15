# Site BTP

Base technique du site vitrine d’une entreprise de bâtiment et travaux publics.

Le projet est une application **React 19**, construite avec **Vite**, **TypeScript** et **Tailwind CSS 4**. La partie publique est volontairement statique à ce stade : elle pourra être étendue ultérieurement si un formulaire métier, un espace client ou une gestion de contenus le justifie.

## Démarrage local

| Commande | Rôle |
|---|---|
| `pnpm dev` | Lance le serveur de développement Vite. |
| `pnpm check` | Vérifie les types TypeScript. |
| `pnpm build` | Produit une version de production. |
| `pnpm format` | Applique la mise en forme du code. |

## Organisation

| Répertoire | Responsabilité |
|---|---|
| `client/src/pages/` | Pages et routes publiques. |
| `client/src/components/` | Composants réutilisables et composants d’interface. |
| `client/src/index.css` | Jetons de design, styles globaux et règles d’accessibilité. |
| `client/public/` | Petits fichiers de configuration uniquement. |
| `.github/workflows/` | Contrôles automatisés du dépôt. |

## Conventions initiales

Le projet suit la direction **Matière & Maîtrise**, détaillée dans [`ideas.md`](./ideas.md). Toute évolution visuelle doit conserver une hiérarchie lisible, des contrastes accessibles, une mise en page asymétrique et la couleur d’accent Terre de Brique réservée aux actions importantes.

Les images et médias de production ne doivent pas être enregistrés dans le dépôt. Ils seront stockés dans le stockage associé au projet et référencés par URL afin de conserver des builds légers et fiables.

## Contrôles avant contribution

Avant toute proposition de modification, exécuter :

```bash
pnpm check
pnpm build
```

La validation automatique exécute les mêmes contrôles à chaque ouverture ou mise à jour de demande de fusion.
