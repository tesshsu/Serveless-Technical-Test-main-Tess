CREATE TABLE IF NOT EXISTS public.listing_price
(
    id                   serial           primary key,
    listing_id           int              NOT NULL REFERENCES listing,
    price                double precision not null,
    created_date         timestamp
);


