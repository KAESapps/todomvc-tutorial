# Etape 2 : création du modèle de données et affichage de tâches

Nous définissons maintenant la structure des données, et un premier affichage de quelques données de test.

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

## src/Todo.js

Nous définissons ici le composant représentant une tâche. Il ne permet pas, pour le moment, de modifier le libellé de cette tâche.
Nous ne nous intéressons pas encore à son apparence non plus. 

## src/App.js

Nous ajoutons un sous-composant pour représenter la liste de tâches, qui utilise le composant "Todo" pour représenter chaque élément.
Nous devons créer un conteneur comme composant racine pour regrouper le titre et la liste. Nous utilisons un conteneur vertical `VFlex`.

Nous créons quelques données de test pour tester l'affichage.