# Etape 1 : amorçage du projet

## src/App.js

App.js représente notre composant de plus haut niveau, autrement dit "l'application", qui est un composant composé de sous-composants, ce que nous appelons un "composite".

Nous commençons le développement par le sous-composant le plus simple : le titre "todos". Pour le moment, il est l'unique sous-composant de notre application, nous pouvons donc l'utiliser directement en tant que composant racine via `_rootFactory`.

Contrairement à un titre de document HTML, dans une application, un titre n'a pas de signification particulière. Il s'agit ni plus ni moins que d'un texte mis en page et mis en forme de manière à en faire un titre.
Nous n'avons donc pas besoin de nous soucier s'il s'agit d'un `<h1>`, `<h2>` ou autre. Nous utilisons simplement un composant permettant de représenter un texte statique : 'ksf-ui/widget/base/Label'. Et nous lui affectons un style.

## src/boot.js

Code de lancement de l'application.
Nous avons placé ici un style pour le fond de page, sur document.body