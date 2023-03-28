import { describe, it, expect } from "vitest";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

// Global variables for the tests elements
const listingId = 22;
const requestBody = {
  "name": "TESS2 Schmiedt",
  "postal_address": {
    "street_address": "13 allee bellevue",
    "postal_code": "21810",
    "city": "Berchtesgaden",
    "country": "DE"
  },
  "description": "Lorem Ipsum Dolor ...",
  "building_type": "STUDIO",
  "latest_price_eur": 200000,
  "surface_area_m2": 27,
  "rooms_count": 1,
  "bedrooms_count": 1,
  "contact_phone_number": "+219779210354"
};
const headers = {
  "Content-Type": "application/json"
};

describe("Endpoint: updateListing", () => {
  it("should update a listing and return 201 status code", async () => {
    const response = await fetch(`${process.env.applicationURI}/listings/${listingId}`, {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: headers
    });

    const data = await response.json();
    expect(response.status).toEqual(201);
    expect(data).toHaveProperty("id", listingId);
    expect(data).toHaveProperty("latest_price_eur", requestBody.latest_price_eur);
  });
});
