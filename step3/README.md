# Etape 3 : création de tâches et filtrage, fonctionnalités complètes

Nous créons maintenant le champ de saisie pour créer des tâches, puis les fonctionnalités de filtrage des tâches par état.

## src/App.js

Nous ajoutons le composant `todoInput` pour saisir une nouvelle tâche. Il doit permettre à l'utilisateur de saisir du texte, et de soumettre celui-ci sur appui de la touche "Entrée".
Pour cela, nous utilisons un widget de saisie ("input"), qui permet une modification de sa valeur via une action de l'utilisateur. Le widget `ksf-ui/widget/input/ShortText` émet l'événement "input" lorsque l'utilisateur valide sa saisie par la touche "Entrée". Il nous faut donc écouter cet événement pour créer la tâche avec la valeur saisie puis réinitialiser la valeur du champ.

Nous ajoutons ensuite les boutons de filtrage.
Pour cela, nous utilisons les fonctions de filtrage du store, qui produisent un nouveau store filtré, que nous trions et donnons en entrée de la liste des tâches.

Nous ajoutons aussi le compteur de tâches actives. Pour régler la question de la pluralisation du mot "item", nous créons un composant spécifique basé sur `ksf-ui/widget/base/Label`.
Sur le même principe, nous créons le bouton "Clear completed", basé sur `ksf-ui/widget/base/Button`.

Nous ajoutons enfin la case à cocher générale, permettant de cocher toutes les tâches en un clic. Elle doit aussi être cochée si toutes les tâches sont cochées. Pour cela, nous créons un accesseur spécifique qui contient cette logique, et nous utilisons un widget checkbox de type "editable".

## src/Todo.js

Nous rendons les tâches éditables par double-clic. En mode édition, la touche "Entrée" ainsi que le fait de cliquer en dehors (ou autre action) permettent de valider la modification, tandis que la touche "Echap" annule.
Pour faire cela, nous créons un composant spécifique `EditableLabel` qui se charge de gérer les modes "édition" et "affichage simple", et le passage de l'un à l'autre sur une action de l'utilisateur.
`EditableLabel` est un composite composé de 2 sous-composants, exclusifs l'un de l'autre. On écoute les événements de touche et double-clic sur le conteneur, mais pour gérer les actions en dehors, il nous faut écouter l'événement `onBlur` sur le champ de saisie (input), qui se déclenche à la perte du focus. C'est pour cela que l'on force le focus sur `editor` au passage en mode édition.