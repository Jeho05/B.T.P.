# Audit — immersion du Zoom Parallax

## Observation initiale

La scène charge les sept images et répond au défilement : dès le premier mouvement, les panneaux changent de taille et de position. Toutefois, la progression initiale reste trop discrète pour produire le sentiment de traversée demandé. La cause est double : la scène était calibrée pour une longue distance de scroll et les transformations les plus fortes n’apparaissaient qu’après une progression trop importante.

## Correction retenue

La profondeur doit être perceptible dans le premier tiers de la scène. Le hero conserve une durée de trois hauteurs d’écran, cohérente avec la référence, mais ses valeurs de zoom atteignent l’essentiel de leur course avant les deux tiers du défilement. Les valeurs sont lissées pour éviter les à-coups et la sortie du texte est liée au défilement. La suite de l’audit vérifie à des positions de scroll intermédiaires que les sept calques traversent réellement le cadre avant la séquence cinématographique suivante.

## Contrôle interactif après correction

À `scrollY = 1485 px`, les sept calques sont effectivement transformés à des valeurs distinctes : `2,85`, `3,48`, `4,12`, `3,48`, `4,12`, `5,37` et `6,01`. La vue correspondante ne montre plus une grille statique : les images occupent le cadre et les éléments de premier plan ont traversé les bords de l’écran. La séquence offre donc une sensation de passage progressif avant l’entrée dans la scène cinématographique suivante.
