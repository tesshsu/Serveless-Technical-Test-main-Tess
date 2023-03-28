import { describe, it, expect } from "vitest";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

describe("Endpoint: getListingPrices", () => {
  it("should return a 200 response with listing prices", async () => {
    const listingId = 10;
    const response = await fetch(`${process.env.applicationURI}/listings/${listingId}/prices`);
    const data = await response.json();

    expect(response.status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0)
    // Check if the first object in the array has the "price_eur" properties
    expect(data[0]).toHaveProperty('price_eur');
  });
});

