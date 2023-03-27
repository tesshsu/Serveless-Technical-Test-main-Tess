import PostgresClient from "serverless-postgres";
import {ListingWrite, Price} from "@/types.generated";
import { extractVariables } from "@/libs/postgres";
import {BadRequest} from "@/libs/errors";

type ListingPriceTableRow = {
  id?: number;
  listing_id: number;
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
  listing_id: number
): ListingPriceTableRow {
  return {
    listing_id: listing_id,
    price: price,
    created_date: createdDate,
  };
}

export function getListingPriceRepository(postgres: PostgresClient) {
  return {
    // We insert the price to listing table by indicating id
    async insertListingPrice(listing_id: number, listing: ListingWrite) {
      try {
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

        if (result.rows.length === 0) {
          throw new BadRequest(`No rows were returned from the insert operation.`);
        }

        return { status: 200, data: tableRowToListingPrice(result.rows[0]) };
      } catch (error) {
        console.error(error);
        return { status: 500, error: error.message };
      }
    },

    // Then we get listing price from listing_id
    async getListingPrices(listingId: number) : Promise<Price[]> {
      const queryString = `SELECT * FROM listing_price WHERE listing_id = $1`;
      const queryValues = [listingId];
      const result = await postgres.query(queryString, queryValues);

      return result.rows.map(tableRowToListingPrice);
    },
  };
}
