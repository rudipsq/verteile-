// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 *
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 *
 * Provide a method 'addGeoTag' to add a geotag to the store.
 *
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 *
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 *
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields.
 */

// const GeoTagExamples = require("./geotag-examples");

class InMemoryGeoTagStore {
  #geoTags = [];

  get tagList() {
    return this.#geoTags;
  }

  addGeoTag(geoTag) {
    const unixTimestamp = Math.floor(Date.now());
    geoTag.id = unixTimestamp;

    this.#geoTags.push(geoTag);

    // test
    console.log(this.#geoTags);
  }

  removeGeoTag(name) {
    this.#geoTags = this.#geoTags.filter((tag) => tag.name !== name);
  }

  getNearbyGeoTags(location, radius) {
    console.log("get geo tag", location, radius);
    return this.#geoTags.filter((tag) =>
      this.#isInRadius(tag, location, radius)
    );
  }

  searchNearbyGeoTags(location, radius, keyword) {
    console.log("search geo tag", location, radius);
    return this.#geoTags.filter(
      (tag) =>
        this.#isInRadius(tag, location, radius) &&
        this.#matchesKeyword(tag, keyword)
    );
  }

  #isInRadius(tag, location, radius) {
    const dx = tag.latitude - location.latitude;
    const dy = tag.longitude - location.longitude;
    return Math.sqrt(dx * dx + dy * dy) <= radius;
  }

  #matchesKeyword(tag, keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
    return (
      tag.name.toLowerCase().includes(lowercaseKeyword) ||
      tag.hashtag.toLowerCase().includes(lowercaseKeyword)
    );
  }
}

module.exports = InMemoryGeoTagStore;
