var express = require('express');
var router = express.Router();
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "azerty"));
var session = driver.session();


/* GET home page. */
router.get('/', function (req, res, next) {
    var response;
    var actor;
    if (req.param("actor")) {
        actor = req.param("actor");

    }
//    session.run("MATCH (a:Person)-[b:ACTED_IN]->(c:Movie) RETURN distinct a.name AS name, b AS roles, c AS movies")
//    session.run("MATCH (a:Person)-[b:ACTED_IN]->(c:Movie) with a, b, c order by a.name RETURN distinct a.name AS name, collect(b) AS roles, collect(c) AS movies")
    session.run("MATCH (a:Person)-[b:ACTED_IN]->(c:Movie) with a, b.roles as roles, c as movies order by a.name RETURN distinct a.name AS name, collect(roles + movies) as movies")

        .then(function (result) {
            response = {
                title: 'Blog Neo4j Node.js',
                list: result.records,
                message: 'Votre text dynamique pour plus tard ici!!!',
                index: actor
            };
            res.render('index', response);
            console.log(response.list[0]._fields[0]);
            console.log(response.list[0]._fields[1]);
            console.log(response.index)
        });

});

module.exports = router;

