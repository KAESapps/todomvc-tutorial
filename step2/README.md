# Etape 2 : création du modèle et affichage de tâches

## src/Model.js

Les spécifications de l'application ne définissant pas de logique particulière pour la gestion des données, nous pouvons nous contenter de créer un modèle souple, non contraignant, sous la forme d'un "store" de "dict".

Un "store" est un registre d'entités référencées par un identifiant.
Chaque entité, représentant les données relatives à une tâche, est ici un dictionnaire d'attributs, similaire à un objet Javascript classique, c'est à dire que ces attributs ne sont pas définis à l'avance.

`new Store(new Dict())` définit la structure des données, il s'agit ensuite de définir la source des données. Pour stocker ces données simplement en mémoire vive, on utilise une `StatefulFactory`.

### tests

Pour tester ce modèle, il faut installer intern :

    npm install intern

puis lancer les tests unitaires :
http://localhost:8080/browser_test.html?app/tests/Model

## src/App.js

