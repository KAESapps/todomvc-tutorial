KaeS very own todo app demo
===========================

The purpose of this repo is to expose the current state of our development methods & techniques with Web technologies, mostly JavaScript.

It's worth noting that we pass our time developing softwares/apps, not websites. Our choice of Web technologies is mainly motivated by the ability to reuse a lot of code on multiple environments. But projects after projects, we have found that HTML5 & Co were not very mature for app development. So we've started experimenting different frameworks/libraries and "best practices" before settling on one or another ... or none of them, inventing our own solutions instead.

Here you'll see how:
- we use only JavaScript
- we don't write any HTML/CSS
- we achieve a sort of "home-made" Web component
- we use absolute positioning of DOM elements for better flexibility and performance of UI design

## How to experiment with the code at home

First, install dependencies:

    npm install

Bundle tests, replacing XXX with filename to be found in src/tests/:

    browserify src/tests/XXX.js -d -o test/test.js

Then load test/index.html in your browser.

## See live result

Even though the most interesting part is diving into the code and see how it's made, you can still see the result here:
https://rawgit.com/KAESapps/todomvc-tutorial/master/test/index.html