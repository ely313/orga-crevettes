# Orga des crevettes : mise en ligne

Compte environ 20 minutes. Fais les étapes dans l'ordre.

## 1. Créer la base partagée (Firebase)
1. Va sur https://console.firebase.google.com avec un compte Google et clique sur **Créer un projet**. Nomme-le `orga-crevettes`. Google Analytics n'est pas utile.
2. Dans le menu, ouvre **Firestore Database**, puis **Créer une base de données**. Choisis un emplacement en Europe (il ne pourra plus être changé) et le mode **production**.
3. Ouvre l'engrenage **Paramètres du projet**. Dans **Vos applications**, clique sur l'icône web `</>`, donne le nom `crevettes` et valide (pas besoin de Firebase Hosting).
4. Firebase affiche un bloc `firebaseConfig`. Copie ses valeurs dans le fichier `firebase-config.js`, à la place des lignes en commentaire.

5. Dans le menu, ouvre **Authentication**, **Commencer**, onglet **Sign-in method**, puis active **E-mail/Mot de passe** (seulement la première ligne).

## 2. Coller les règles de sécurité
Dans **Firestore Database**, onglet **Règles** : remplace tout le texte par le contenu du fichier `firestore.rules`, puis clique sur **Publier**.

## 3. Mettre l'appli en ligne (GitHub Pages, comme pour le marrainage)
1. Sur GitHub, crée un dépôt public nommé `orga-crevettes`.
2. Dépose **tous** les fichiers et dossiers à la racine du dépôt (`index.html` doit être directement à la racine).
3. Dans **Settings > Pages**, choisis **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
4. Après une ou deux minutes, l'appli est sur `https://TON-COMPTE.github.io/orga-crevettes/`.

## 4. Vérifier avec deux téléphones
Ouvre le lien sur deux téléphones, choisis deux prénoms différents, crée un code sur chacun, puis ajoute un rendez-vous sur le premier. Il doit apparaître tout seul sur le second, sans recharger. Si un bandeau rouge parle des règles de sécurité, reprends l'étape 2.

## 5. Installer sur les téléphones
- **iPhone** : ouvrir le lien dans Safari, icône Partager, **Sur l'écran d'accueil**, **Ajouter**.
- **Android** : ouvrir le lien dans Chrome, menu ⋮, **Ajouter à l'écran d'accueil**.

## Bon à savoir
- **Premier arrivé** : le premier qui choisit un prénom crée son code. Envoyez le lien uniquement au groupe, et que chacune crée le sien rapidement. Si quelqu'un a pris un prénom par erreur, utilisez la procédure ci-dessous.
- **Code oublié** : il n'y a pas de récupération par e-mail. Celle qui gère le projet Firebase doit faire deux suppressions :
  1. **Authentication**, onglet **Users** : supprimer le compte `prenom@crevettes.example.com`.
  2. **Firestore Database**, collection `comptes` : supprimer le document du prénom.
  La personne recrée alors un code, et ses rendez-vous sont conservés.
- **Protection** : sans compte connecté, la base refuse la lecture et l'écriture. Seuls les 10 prénoms prévus sont acceptés.
- **Identifiant du code** : les adresses en `@crevettes.example.com` sont techniques et ne reçoivent aucun message.
- **Coût** : l'offre gratuite Spark ne demande aucune carte. Si le quota quotidien était dépassé, la base s'arrêterait jusqu'au lendemain, sans facture.
- **Modifier l'appli** : remplacer un fichier sur GitHub suffit, les téléphones reçoivent la nouvelle version à l'ouverture suivante.
