import { functionHandler } from "@/libs/function";
import {Listing, ListingWrite, Price} from "@/types.generated";
import {EntityNotFound, NotFound} from "@/libs/errors";
import {getListingPriceRepository} from "@/repositories/listing_prices";


export const getListingPrices = functionHandler<Price[]>(
    async (event, context) => {

  // TODO Replace this with your implementation.
  // return {
  //   statusCode: 200,
  //   response: [
  //     { price_eur: 100000, created_date: "2023-01-12T09:23:36Z" },
  //     { price_eur: 150000, created_date: "2023-01-17T08:17:32Z" },
  //   ],
  // };
  try {
    const listing_prices = await getListingPriceRepository(context.postgres).getListingPrices(
        parseInt(event.pathParameters.id)
    );

    return { statusCode: 200, response: listing_prices };
  } catch (e) {
    if (e instanceof EntityNotFound) {
      throw new NotFound(e.message);
    }

    throw e;
  }
});
