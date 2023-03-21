import PostgresClient from "serverless-postgres";
import {ListingWrite, Price} from "@/types.generated";
import { extractVariables } from "@/libs/postgres";
import {BadRequest} from "@/libs/errors";

type ListingPriceTableRow = {
  id?: number;
  listing_id?: number;
  created_date: Date;
  price: number;
};

function tableRowToListingPrice(row: ListingPriceTableRow): Price {
  return {
    price_eur: row.price,
    created_date: row.created_date.toISOString()
  };
}

function listingPriceToTableRow(
  price: number,
  createdDate: Date,
  listing_id?: number
): ListingPriceTableRow {
  return {
    listing_id: listing_id,
    price: price,
    created_date: createdDate,
  };
}

export function getListingPriceRepository(postgres: PostgresClient) {
  return {
    // First we get listing price from listing_id
    async getListingPrices(listingId: number) : Promise<Price[]> {
      const queryString = `SELECT * FROM listing_price WHERE listing_id = $1`;
      const queryValues = [listingId];
      const result = await postgres.query(queryString, queryValues);

      /// Throw an error if the listing has already been updated more than 10 times
      const rowCount = result.rowCount;
      if (rowCount && rowCount >= 10) {
        throw new BadRequest(`The listing with id ${listingId} has already been updated ${rowCount} times, limited updated allowed maxima 10 times`);
      }

      return result.rows.map(tableRowToListingPrice);
    },
    // Then we insert the price to listing table by indicating id
    async insertListingPrice(listing_id: number, listing: ListingWrite) {
      const tableRow = listingPriceToTableRow(listing.latest_price_eur, new Date(), listing_id);
      const {
        columns,
        variables,
        values: queryValues,
      } = extractVariables(tableRow);

      const queryString = `
        INSERT INTO listing_price (${columns.join(",")})
        VALUES(${variables})
        RETURNING *
      `;

      const result = await postgres.query(queryString, queryValues);

      return tableRowToListingPrice(result.rows[0]);
    }
  };
}
