# Firebase externe — B.T.P.

L’application conserve une présentation statique rapide sur Vercel et utilise Firebase uniquement pour les données métier : réalisations, services, demandes de devis, comptes d’administration et médias. Les identifiants `VITE_FIREBASE_*` décrivent l’application Web ; ils ne remplacent jamais les règles Firestore et Storage, qui constituent la frontière de sécurité.

| Ressource | Collection / chemin | Lecture publique | Écriture |
|---|---|---:|---:|
| Réalisations | `projects` | Seulement si `status: "published"` | Administrateur |
| Services | `services` | Seulement si `status: "published"` | Administrateur |
| Demandes de devis | `quoteRequests` | Non | Création publique validée ; gestion administrateur |
| Rôles | `admins/{uid}` | Seulement son propre UID | Provisionnement manuel contrôlé |
| Médias | `projects/*` dans Storage | Oui | Administrateur, image/vidéo, 25 Mo maximum |

## Mise en route opérationnelle

Créez l’application Web dans **Firebase Console → Project settings → General → Your apps**, puis copiez les valeurs Web dans les variables d’environnement Vercel correspondant au fichier `.env.example`. Les URL de déploiement doivent être ajoutées dans **Authentication → Settings → Authorized domains**. Activez ensuite Firestore, Storage, puis déployez les règles de ce dépôt avec Firebase CLI depuis un poste authentifié :

```bash
firebase use btp-plateforme-chantier
firebase deploy --only firestore:rules,storage
```

Après avoir créé le premier compte par e-mail et mot de passe, relevez son UID dans **Authentication → Users**, puis créez manuellement `admins/{uid}` dans Firestore, avec un champ d’audit tel que `createdAt`. Cette dernière étape est volontaire : être connecté ne suffit pas pour devenir administrateur.

> Les règles doivent être publiées avant d’accepter des demandes réelles. La configuration locale présente une erreur claire tant que les variables Firebase sont absentes, plutôt que d’exposer un formulaire sans persistance.
