import { functionHandler } from "@/libs/function";
import { getRepository } from "@/repositories/listings";
import { Listing, ListingWrite } from "@/types.generated";
import { EntityNotFound, NotFound, BadRequest } from "@/libs/errors";
import { getListingPriceRepository } from "@/repositories/listing_prices";

export const getListings = functionHandler<Listing[]>(
  async (_event, context) => {
    const listings = await getRepository(context.postgres).getAllListings();

    return { statusCode: 200, response: listings };
  }
);

export const addListing = functionHandler<Listing, ListingWrite>(
  async (event, context) => {
    const listing = await getRepository(context.postgres).insertListing(
      event.body
    );
    // Once create listing sync insert to listing price table
    await getListingPriceRepository(context.postgres).insertListingPrice(
        listing.id,
        event.body
      );

    return { statusCode: 201, response: listing };
  }
);

export const updateListing = functionHandler<Listing, ListingWrite>(
  async (event, context) => {
    try {
        const listing = await getRepository(context.postgres).updateListing(
          parseInt(event.pathParameters.id),
          event.body
        );

      // Once update listing price sync insert to listing price table
        const response = await getListingPriceRepository(context.postgres).insertListingPrice(
            parseInt(event.pathParameters.id),
            event.body
        );

        console.log('response: ', response);

      if (!response) {
        throw new BadRequest(`Inserting listing price failed`);
      }

      // If insert Listing price row over 10, throw error
        const responseListingPrice = await getListingPriceRepository(context.postgres).getListingPrices(
          parseInt(event.pathParameters.id)
        )
      
      if(responseListingPrice.length > 10) {
         throw new BadRequest(`Listing price update over 10 times`)
      }

      return { statusCode: 201, response: listing };
    } catch (e) {
      if (e instanceof EntityNotFound) {
        throw new NotFound(e.message);
      }
      throw e;
    }
  }
);
