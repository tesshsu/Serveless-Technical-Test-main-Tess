import { functionHandler } from "@/libs/function";
import {Price} from "@/types.generated";
import {EntityNotFound, NotFound} from "@/libs/errors";
import {getListingPriceRepository} from "@/repositories/listing_prices";


export const getListingPrices = functionHandler<Price[]>(
    async (event, context) => {

  // TODO Replace this with your implementation.
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
