# Audit — immersion du Zoom Parallax

## Observation initiale

La scène charge les sept images et répond au défilement : dès le premier mouvement, les panneaux changent de taille et de position. Toutefois, la progression initiale reste trop discrète pour produire le sentiment de traversée demandé. La cause est double : la scène était calibrée pour une longue distance de scroll et les transformations les plus fortes n’apparaissaient qu’après une progression trop importante.

## Correction retenue

La profondeur doit être perceptible dans le premier tiers de la scène. Le hero conserve une durée de trois hauteurs d’écran, cohérente avec la référence, mais ses valeurs de zoom atteignent l’essentiel de leur course avant les deux tiers du défilement. Les valeurs sont lissées pour éviter les à-coups et la sortie du texte est liée au défilement. La suite de l’audit vérifie à des positions de scroll intermédiaires que les sept calques traversent réellement le cadre avant la séquence cinématographique suivante.

## Contrôle interactif après correction

À `scrollY = 1485 px`, les sept calques sont effectivement transformés à des valeurs distinctes : `2,85`, `3,48`, `4,12`, `3,48`, `4,12`, `5,37` et `6,01`. La vue correspondante ne montre plus une grille statique : les images occupent le cadre et les éléments de premier plan ont traversé les bords de l’écran. La séquence offre donc une sensation de passage progressif avant l’entrée dans la scène cinématographique suivante.

## Test de la première migration GSAP

Le premier essai de migration GSAP n’a pas créé de mouvement : à `scrollY = 1485 px`, les sept transformations calculées sont restées à l’identité et le voile ainsi que l’éditorial à l’opacité `1`. Le problème est donc objectivé dans le navigateur ; la timeline n’est pas liée au conteneur effectif. Cette version ne sera pas synchronisée. Le diagnostic se poursuit sur l’enregistrement et le cycle de montage de `ScrollTrigger` avant toute publication.

Le DOM est correct (`7` calques, scène de `3300 px`, zone sticky de `1100 px`), ce qui écarte une erreur de structure. Les bibliothèques ES modules ne sont pas exposées sur `window`, il faut donc contrôler l’initialisation au sein du composant et la préférence de réduction des mouvements plutôt que s’appuyer sur une inspection globale de GSAP.

## Validation GSAP

Après stabilisation du cycle de montage, la timeline GSAP est active sans préférence de réduction de mouvement. À `scrollY = 1485 px`, les styles réellement appliqués aux sept calques sont `scale(3,025)`, `3,7`, `4,375`, `3,7`, `4,375`, `5,725` et `6,4`. La vue intermédiaire confirme que l’architecture envahit désormais tout le cadre et que l’éditorial s’efface : le hero ne se limite plus à une grille statique. Cette version est celle à vérifier et à publier.
