# About
Un API pour un réseau social d'entreprise

# Installation
Clonnez les fichiers du répertoire "Backend" du Github.
Mettez-les dans un répertoire "Projet/Backend" de votre ordinateur  

Pour ce même répertoire "Backend", verifiez bien la présence du fichier 
Backend/config/default.json qui contient les configurations de sécurité.

Si ce fichier est manquant, créez-le avec le contenu suivant :

 {
    "mongoURI":"mongodb+srv://mihaja2:cacapigeon@cluster0.dsr7c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    "jwtSecret": "cacapigeon",
    "adminFirstname": "admin",
    "adminLastname": "admin",
    "adminEmail": "admin@gmail.com",
    "adminPassword": "Admin-1234"
 }

Dans ce répertoire "Backend", lancez
# `npm install`

# Lancement

Pour démarrez le serveur, lancez ensuite
# `npm run start`

