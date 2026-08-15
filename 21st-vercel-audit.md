# Audit — référence 21st et médias Vercel

## Référence demandée

La référence fournie par le propriétaire est `https://21st.dev/r/sshahaider/zoom-parallax`, qui redirige vers `https://21st.dev/@sshahaider/components/zoom-parallax`.

La page décrit un effet de scroll fluide dans lequel les images zooment à des vitesses différentes pour donner une profondeur cinématographique. Sa dépendance déclarée est `framer-motion`, déjà présente dans le projet B.T.P.

La tentative d’ajout exacte via `npx shadcn@latest add "https://21st.dev/r/sshahaider/zoom-parallax"` a échoué sur une coupure TLS. L’alternative recommandée par l’outil (`shadcn@4.17.0`) atteint bien le registre, mais l’accès au contenu renvoie une authentification requise. Le composant ne peut donc pas être récupéré automatiquement depuis ce registre dans cette session ; l’adaptation existante sera alignée sur sa géométrie connue à sept calques sans importer de code non accessible.

## Diagnostic Vercel

La production `https://b-t-p.vercel.app/` référence les images et vidéos avec des chemins relatifs `/manus-storage/...`. Ces chemins ne sont pas servis par Vercel : le DOM liste bien les éléments image, mais les médias ne sont pas visibles sur le domaine de production.

Les copies sources ont été transférées vers les URL CDN publiques absolues suivantes, utilisables depuis Vercel :

| Asset | URL CDN |
|---|---|
| Hero | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663894511915/WWSqPkWSnwuKQZFE.jpg` |
| Gestes | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663894511915/KMvLTzlPLrxKbVdf.jpg` |
| Territoire | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663894511915/zzGCOljjJcEGdTSw.jpg` |
| Façade | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663894511915/ZPDhGCqnAJdsDsEH.jpg` |
| Humain | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663894511915/YTpbhVNYHxIzLWjW.jpg` |
| Signe | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663894511915/MfclQdfaoQDGocTD.png` |
| Affiche ouvriers | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663894511915/BltUYZnjQrMUbFBu.jpg` |
| Affiche aérienne | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663894511915/uTtyCstvCQWyKkGT.jpg` |
| Vidéo ouvriers | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663894511915/XOOvLYNeZSiBGiIp.mp4` |
| Vidéo aérienne | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663894511915/iZiQCvTiaoHdOBAj.mp4` |
