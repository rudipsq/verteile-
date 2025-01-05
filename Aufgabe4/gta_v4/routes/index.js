// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require("express");
const router = express.Router();
router.use(express.json());

/**
 * The module "geotag" exports a class GeoTagStore.
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require("../models/geotag");

/**
 * The module "geotag-store" exports a class GeoTagStore.
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require("../models/geotag-store");
const geoTagStore = new GeoTagStore();

const GeoTagExamples = require("../models/geotag-examples");
const geoTagExamples = new GeoTagExamples(geoTagStore);

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get("/", (req, res) => {
  res.render("index", {
    taglist: [],
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    markers: null,
  });
});

router.post("/tagging", (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body; // Extracting coordinates
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);
  geoTagStore.addGeoTag(newGeoTag);

  // console.log(geoTagStore.tagList);

  // Optionally return updated data or redirect
  res.redirect("/"); // Redirecting back to home page or render updated view
});

router.post("/discovery", (req, res) => {
  const { latitude, longitude, searchterm } = req.body;
  let results;

  const search = searchterm;

  const radius = 0.05; // todo: kann angepasst werden

  console.log(search);

  if (search) {
    results = geoTagStore.searchNearbyGeoTags(
      { latitude: latitude, longitude: longitude },
      radius,
      search
    );
  } else {
    results = geoTagStore.getNearbyGeoTags({ latitude, longitude }, radius);
  }

  res.render("index", {
    latitude: latitude,
    longitude: longitude,
    taglist: results,
    markers: JSON.stringify(results),
  });
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 * var qs = require('qs')
 * app.set('query parser', function (str) {
 * return qs.parse(str, {  custom options  })
 * })
 *
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...

router.get("/api/geotags", (req, res) => {
  const { latitude, longitude, searchterm } = req.query;
  let results;

  const search = searchterm;
  const radius = 0.05; // todo: kann angepasst werden

  console.log(search);

  if (search) {
    results = geoTagStore.searchNearbyGeoTags(
      { latitude: latitude, longitude: longitude },
      radius,
      search
    );
  } else {
    results = geoTagStore.getNearbyGeoTags({ latitude, longitude }, radius);
  }

  res.status(200).json(results);
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post("/api/geotags", (req, res) => {
  //! geht nicht wegen nested request
  // console.log(req.body);
  // const geotag = req.body.geotag;

  // console.log("geotagData:");
  // console.log(geotag);

  // const newGeoTag = new GeoTag(
  //   geotag.name,
  //   geotag.latitude,
  //   geotag.longitude,
  //   geotag.hashtag
  // );
  const { name, latitude, longitude, hashtag } = req.body;
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);

  geoTagStore.addGeoTag(newGeoTag);

  res.location(`/api/geotags/${newGeoTag.id}`);
  res.status(201).json(newGeoTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.get("/api/geotags/:id", (req, res) => {
  const id = Number(req.params.id);
  let result = geoTagStore.getGeotagById(id);

  // test
  console.log(id, result);

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Geotag with id ${id} not found` });
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.put("/api/geotags/:id", (req, res) => {
  const id = Number(Number(req.params.id));
  const { name, latitude, longitude, hashtag } = req.body;

  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);

  if (geoTagStore.getGeotagById(id)) {
    geoTagStore.removeGeoTagWithId(id);
  }
  geoTagStore.addGeoTagWithId(newGeoTag, id);

  res.location(`/api/geotags/${newGeoTag.id}`);
  res.status(201).json(newGeoTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.delete("/api/geotags/:id", (req, res) => {
  const id = Number(req.params.id);

  geoTagStore.removeGeoTagWithId(id);

  res.status(200);
});

module.exports = router;
