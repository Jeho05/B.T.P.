# Audit initial — Firebase, hero et médias

## Constats au 15 août 2026

La version publique sur `https://b-t-p.vercel.app/` répond et l’arbre de la page contient les sept images prévues par le zoom-parallaxe. Aucun message d’erreur n’apparaît dans la console du navigateur.

Le problème visuel principal du hero est structurel : les calques sont présents dans le DOM mais ne sont pas perceptibles dans la première vue. Dans la feuille de style, le conteneur des calques est placé avec `z-index: -2` et le voile avec `z-index: -1`, tandis que le parent sombre crée son propre contexte d’empilement. Les visuels sont donc rendus derrière le fond minéral au lieu d’être derrière le texte.

## Écart avec la référence à sept calques

Les six calques secondaires utilisent les coordonnées demandées. Le premier est cependant forcé à `100vw × 100svh` au lieu du format par défaut `25vw × 25vh` qui doit être agrandi par l’échelle 4. La correction devra rétablir cette géométrie et l’ordre d’empilement suivant : calques visibles, voile sombre, contenu éditorial.

## Point de départ Firebase

L’application actuelle est une page statique unique et ne contient ni formulaire de demande exploitable ni page de connexion ou d’administration. L’intégration devra donc ajouter un client Firebase isolé, des routes publiques et protégées, puis la configuration Firebase publique injectée au build. Les règles Firestore et Storage seront maintenues dans le dépôt pour une mise en place reproductible dans la console Firebase.

## Accès à la console

Le compte Google du propriétaire est désormais authentifié dans la console Firebase. Aucun connecteur Firebase dédié n’est configuré dans la session ; l’intégration sera donc réalisée avec le SDK Web officiel, les paramètres publics du projet étant fournis au build Vite.

La console impose un nom de projet composé de lettres, chiffres, espaces et de quelques caractères simples. Le nom interne retenu pour créer le projet sera donc `BTP Plateforme Chantier`, tandis que l’identité publique du site reste `B.T.P.`.

Firebase a proposé l’identifiant de projet `btp-plateforme-chantier`. Cet identifiant est conforme, descriptif et sera utilisé pour les paramètres publics du SDK après la création.

L’option facultative Gemini dans Firebase a été désactivée lors de l’assistant de création. Elle n’est pas nécessaire aux fonctions B.T.P. et cette décision évite que les prompts de développement soient utilisés selon les conditions propres au produit Gemini.

Google Analytics a également été désactivé. Les objectifs de la première version concernent la gestion des contenus, des demandes de devis et des médias ; aucun suivi analytique tiers n’est indispensable à ce stade.

La création du projet Firebase `BTP Plateforme Chantier` a été lancée dans la console. L’assistant affiche encore un état de préparation ; la prochaine vérification confirmera l’accès au tableau de bord et l’identifiant final attribué par Google Cloud.

Deux contrôles successifs ont confirmé que le provisionnement est toujours en cours dans Google Cloud. Aucune action de configuration supplémentaire ne sera déclenchée dans la console tant que le tableau de bord du projet n’est pas disponible.

Le provisionnement est terminé. Le projet externe apparaît dans Firebase sous le nom `BTP Plateforme Chantier` et l’identifiant définitif `btp-plateforme-chantier`. Il est indépendant de Manus et sera utilisé par le site Vercel via les paramètres publics du SDK Web.

Le tableau de bord du projet est accessible. Le projet est actuellement sur le forfait Spark sans frais. Les services à activer pour la première version sont Firestore, Authentication par e-mail/mot de passe et Cloud Storage ; certains usages de Storage pourront exiger une migration vers le forfait Blaze selon les règles de Firebase et le volume de médias.

Le module Firebase Authentication est accessible dans le projet B.T.P. Il ne possède encore aucun fournisseur activé. Le prochain réglage activera uniquement le fournisseur e-mail/mot de passe, adapté à un espace d’administration restreint.

L’écran « Méthode de connexion » est chargé et propose notamment le fournisseur « Adresse e-mail/Mot de passe ». Les fournisseurs sociaux, téléphone et anonymes resteront désactivés, afin de limiter la surface d’accès de l’administration B.T.P.

Le fournisseur Firebase « Adresse e-mail/Mot de passe » a été activé avec succès. Il constituera le seul moyen de connexion du back-office à ce stade. L’application utilisera un document de profil `users/{uid}` avec le rôle `admin` afin de vérifier l’autorisation d’administration, en plus de l’identité Firebase.

L’URL directe vers l’assistant Firestore a été ouverte, mais l’interface n’a pas encore rendu son contenu après deux vérifications. La configuration passera par une navigation alternative dans le tableau de bord, sans modifier les paramètres du projet tant que l’assistant n’est pas visible.

La route alternative Firestore affiche la navigation globale mais son contenu principal reste en chargement. Il s’agit d’un défaut de rendu ponctuel de la console, pas d’une erreur de l’application B.T.P. L’intégration locale peut néanmoins être préparée avec une configuration désactivée tant que Firestore n’est pas initialisé.

Le contournement par Google Cloud Console charge correctement l’interface, mais n’a pas retenu l’identifiant de projet passé dans l’URL. Il faut sélectionner explicitement `btp-plateforme-chantier` dans le sélecteur de projet avant de reprendre la création Firestore.

Le projet `btp-plateforme-chantier` est désormais confirmé comme projet actif dans Google Cloud Console. La page « Créer une base de données Firestore » est ouverte et attend le chargement de son assistant. La création définitive, incluant le choix de région et de mode, ne sera validée qu’après contrôle des options affichées.

La création de Firestore a été envoyée avec l’édition Standard, le mode natif, les règles restrictives et la clé gérée par Google. La vue de liste reste vide après la requête : le provisionnement n’est donc pas encore confirmé par l’interface. La configuration de l’application Web peut être poursuivie en parallèle ; l’intégration dans le code restera strictement inactive tant que les variables Firebase ne sont pas présentes.

L’accès direct aux paramètres généraux Firebase a renvoyé une erreur inconnue de la console, alors que l’authentification fonctionne déjà. Ce problème est externe à B.T.P. et n’affecte pas le code local. La configuration Web sera préparée côté application avec validation stricte des variables d’environnement, et l’enregistrement de l’application Firebase sera repris via la console dès que la page répond à nouveau.

Une seconde vérification du tableau de bord et des paramètres généraux reproduit l’erreur inconnue de la console Firebase. La démarche ne sera pas répétée automatiquement. L’application React, les règles, les index et la documentation d’intégration sont néanmoins prêts. Il reste à enregistrer l’application Web Firebase, publier les règles, ajouter ses paramètres `VITE_FIREBASE_*` dans Vercel et créer le premier profil `admins/{uid}` dès que la console répond à nouveau.
