# Contrôle de production Vercel

- **URL contrôlée :** https://b-t-p.vercel.app/
- **Constat du 15 août 2026 :** la racine ne sert pas l’interface B.T.P. ; elle affiche le contenu compilé de `server/index.ts`.
- **Sortie statique attendue :** `dist/public`, d’après `vite.config.ts` (racine Vite : `client`, ligne 219 ; répertoire de sortie : `dist/public`, lignes 219–222).
- **Conséquence :** Vercel doit être configuré pour servir `dist/public` après `pnpm build`, plutôt que de publier l’artefact serveur comme contenu statique.
