# Audit de cause racine — Zoom Parallax

## Référence 21st

La page publique de la référence `sshahaider/zoom-parallax` est accessible, mais son contenu reste bloqué sur un écran de chargement dans la session de navigation et ne publie ni code ni dépendances dans le HTML extrait. Son registre ne peut donc pas être utilisé comme source d’installation fiable dans cet environnement. La comparaison ne doit pas s’arrêter là : le code local, le build et la production Vercel seront contrôlés séparément.

## Hypothèse prioritaire

Le site a déjà chargé les médias depuis la révision CDN. La question est désormais de savoir si le déploiement public sert bien le dernier bundle JavaScript avec la timeline GSAP et si les règles mobiles ne neutralisent pas volontairement la scène. Les tests locaux n’établissent pas, à eux seuls, la version réellement offerte par Vercel.

## Contrôle de la production Vercel

La production contient bien le composant GSAP : chaque calque reçoit les styles inline initialisés par GSAP. Toutefois, après un déplacement à `scrollY = 1485 px`, tous les calques restent à une transformation nulle et le contenu ne s’efface pas. La préférence utilisateur ne réduit pas les mouvements. Il ne s’agit donc ni d’une absence de dépendance, ni d’un problème d’images, ni de l’accessibilité : le défaut est précisément l’absence de progression de `ScrollTrigger` dans le bundle servi par Vercel. L’hypothèse de travail est un enregistrement trop tardif de l’extension ou un rafraîchissement initial insuffisant de ses limites de scroll en production.

Un test de retour en haut déclenché par un véritable événement navigateur remet correctement la page à `scrollY = 0` et confirme que la scène fait bien `3300 px` pour une zone sticky de `1100 px`. La géométrie est valide ; le test descendant reproduira maintenant un parcours utilisateur à partir d’un état propre.

Le test descendant par événement de scroll navigateur confirme que la production Vercel anime bien la scène : à `scrollY = 962 px`, les sept calques sont respectivement à `2,3118×`, `2,7491×`, `3,1864×`, `2,7491×`, `3,1864×`, `4,0609×` et `4,4982×`. Le voile est à `0,6352` d’opacité et l’éditorial à `0,6045` avec une translation verticale. L’animation fonctionne donc dans le bundle Vercel à condition de défiler réellement ; le déplacement programmatique ne notifie pas correctement `ScrollTrigger` dans ce navigateur. Le problème ressenti est plutôt une perception insuffisante à l’entrée de scène ou une attente sur un appareil mobile à faible amplitude de scroll, non une installation manquante.

## Référence technique vérifiée

La fiche publique du composant de sshahaider décrit un zoom de plusieurs images à vitesses différentes au scroll. Son registre reprend la commande demandée mais ne divulgue pas le code sans authentification. Le modèle public correspondant confirme cependant les prérequis techniques : `framer-motion`, un conteneur de `300vh`, une zone `sticky` de `100vh`, `useScroll({ target: container, offset: ['start start', 'end end'] })`, puis les échelles `4`, `5`, `6`, `8` et `9`. Il ajoute Lenis pour le confort de défilement, mais ce dernier n’est pas nécessaire au calcul du zoom. La base B.T.P. possède déjà Framer Motion ; le correctif final reviendra donc à cette implémentation canonique à la place de la timeline GSAP ajoutée précédemment.

## Réintégration canonique

Le projet emploie désormais `framer-motion` (déjà présent) et `lenis` `1.3.26` (ajouté en remplacement du paquet historique déprécié). Le composant a été remplacé par l’architecture de la référence : `useScroll` ciblant le conteneur de `300vh`, sept `motion.div` portant les échelles individuelles, et un calque collant de `100svh`. Sur un vrai événement de scroll en développement, la scène est passée d’une mosaïque à une image de façade qui traverse presque tout l’écran, tandis que le texte se retire : le mouvement attendu est donc visuellement déclenché par la nouvelle base canonique. La longueur mobile est revenue de `190svh` à `300vh` afin de ne plus comprimer le mouvement tactile.
