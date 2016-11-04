var express = require('express');
var router = express.Router();
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "tedrzi"));
var session = driver.session();


/* GET home page. */
router.get('/', function (req, res, next) {
    var response;
    session.run("MATCH (a:Person) RETURN a.name AS name")

        .then(function (result) {
            response = {
                title: 'Blog Neo4j Node.js',
                list: result.records,
                message: 'Votre text dynamique pour plus tard ici!!!'
            };
            res.render('index', response);
            //    console.log(response);
        });
    if (req.param("actor")) {
        var actor = req.param("actor");
        console.log(actor.toString());
        getMovies(actor);
    }
});

module.exports = router;

function getMovies(actor) {
    this.actor = actor;
    var movies;
    session.run("MATCH (a:Person)-[b:PLAYED_IN]->(c:Movie) WHERE a.name={actor} RETURN a.name AS name, b, c AS movie", {
            actor: actor
        })
        .then(function (parameters) {
            var err = parameters.err;
            var result = parameters.result.records;
            if (err) {
                console.log(err)
            } else {
                movies = {
                    docs: result
                };
                return movies;
            }
        });
}