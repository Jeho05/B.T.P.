# Audit du scroll — correction immersive

Le défilement réel confirme que les animations actuelles restent trop discrètes à l’échelle d’une vue complète. Le hero se décale légèrement, mais la section suivante arrive sans changement de scène franchement perceptible. Les sections épinglées reposent sur des positions intermédiaires peu visibles dans une capture pleine page : le système doit donc exprimer davantage les états de progression dans le viewport lui-même.

La correction doit introduire des transitions à contraste élevé : cadrage qui se resserre, images qui se déplacent dans des panneaux superposés, texte qui change de rôle, masques qui s’ouvrent, et indicateur de phase synchronisé avec le défilement. Chaque scène épinglée devra conserver un élément évolutif bien visible.

## Contrôle après correction

La nouvelle scène « Traversée » est visible juste après le hero. Son premier état utilise un cadrage serré sur le geste, un titre à très grande échelle, un numéro monumental et une ligne de progression ; le contraste avec la section précédente est maintenant explicite. Les états deux et trois doivent encore être vérifiés à mi-parcours et à la sortie du pinning pour confirmer l’ouverture des masques et le changement de média.

Les vérifications suivantes confirment que l’état 02 affiche une nouvelle composition (« Le geste répond ») pendant la scène épinglée, puis que l’état 03 bascule vers la vidéo aérienne avec le message « Le lieu demeure ». Les trois moments restent dans le même viewport pendant la progression, avec changement de média, titre, nombre et barre de progression : le mouvement est désormais perceptible dans l’usage réel.

Après intégration du composant zoom-parallaxe adapté depuis la référence fournie, le hero conserve son cadrage plein écran et affiche dès le début plusieurs couches de matières B.T.P. Une première progression du scroll modifie visiblement la position relative des cadres ; il faut contrôler un point médian et la sortie avec un défilement programmatique, car le déplacement interactif par viewport a été partiel.

Le contrôle à mi-parcours (environ 1,5 hauteur de viewport) confirme une recomposition nette : le contenu typographique s’estompe et les cadres de matériaux ont grandi jusqu’à reconfigurer le fond. À la sortie (environ 2,65 hauteurs de viewport), les calques remplissent le cadre, le contenu est volontairement absent et la scène « Traversée » suivante prend immédiatement le relais. Le hero forme donc une transition continue au scroll, sans saut visuel vers la section suivante.
