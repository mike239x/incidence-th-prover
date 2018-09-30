# Incidence theorem prover

Part of my bachelor.

Given a configuration of lines and dots, as well as three selected dots it
tries to generate a proof that the chosen three points are collinear.

The concept is not working for all possible incidence theorems, but it works
for many basic examples.

[Link](http://mike239x.github.io/incidence-th-prover/examples/pappus.html) to
the Pappus' Theorem construction.
[Link](http://mike239x.github.io/incidence-th-prover/examples/desargues.html)
to the Desargues's Theorem construction.

# Repo structure
`build` folder has a stable build of CindyJS.

`css` has special css style which allows CindyJS to use buttons.

`examples` folder contains examples. Currently it has only geometric
constructions for Pappus' and Desargues's Theorems.

`prover` is the main folder of project. It contains two files: `prover.js` -
the main scrupt providing a function `prove_collinear` and `support.js`
providing some helpful functions and classes.
