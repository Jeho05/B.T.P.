# Références — correction du scroll immersif

## 21st — composants de scroll

- URL : https://21st.dev/community/components/s/scroll-animation
- Observation : la plateforme réunit des composants dédiés aux animations de scroll, ainsi que des catégories pertinentes pour le projet : héros, images, vidéos, timelines et progressions.
- Transposition retenue : une scène à panneau central, progression explicite et changement d’état lisible à chaque quart de scroll.

## GSAP ScrollTrigger

- URL : https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Observation : ScrollTrigger prend en charge les timelines synchronisées au scroll (`scrub`), l’épinglage (`pin`), le passage à des points précis (`snap`) et les callbacks de progression.
- Transposition retenue : une scène B.T.P. épinglée avec transformations de cadrage, masques et texte réactif, plutôt que de simples entrées de contenu.
