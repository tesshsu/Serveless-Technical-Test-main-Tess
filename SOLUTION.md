# AVIV technical test solution

You can use this file to write down your assumptions and list the missing features or technical revamp that should
be achieved with your implementation.

## Notes

Write here notes about your implementation choices and assumptions.

### Follow are my work flow for this task--Tess

![AVIA1](https://user-images.githubusercontent.com/3927152/227252301-18fe0e82-2b80-47a5-8288-42b4732ce0cb.png)

- **Define a database schema for the ListingPrice entity that will hold the price history for each listing. This schema should include a foreign key to the Listing entity to establish a one-to-many relationship between listings and their price histories.**

- **Create a new endpoint /listings/<id>/prices in the ListingAPI that will return the price changes for a given listing over time. This endpoint should query the database to retrieve the price history of the listing and return it as a JSON response.**

- **Implement a database migration to add the ListingPrice entity to the database schema**

- **Implement a database repository that will handle CRUD operations for the ListingPrice entity**

- **In the ListingService class, modify the update_listing method to append a new ListingPrice entity to the price history of the listing whenever its price is updated**

- **Test the new endpoint and ensure that it returns the correct price history for a given listing**

## Questions

This section contains additional questions your expected to answer before the debrief interview.

- **What is missing with your implementation to go to production?**
    - Security : The API should be secured with authentication and authorization middleware to ensure that only authorized users can access the data and do CRUD operations.
    - Testing: A set of unit, integration tests should be executed to ensure the functionality and reliability of the API.
    - Error handling: Error handling should be implemented to gracefully handle errors like try cache which not been integrated in handler.
    - Scalability performance: This is expected to handle a large volume of data and traffic, it is better use cache like Redis to cache frequently accessed data, and load balancing to dispatch different requests across the servers.

- **How would you deploy your implementation?**
     If project had been installed in Aws ECS here might be the steps
    - Push the Docker image to a container registry like Amazon ECR repository
    - Create a service that runs and manages the tasks defined in the task definition
    - Create a load balancer to distribute traffic to the running tasks
    - Test the deployed application using automated tests
    - Configure CloudWatch Logs to collect log and set up Metrics to check performance and resouce usage

- **If you had to implement the same application from scratch, what would you do differently?**
      Follow will be my approach to add on those approches from scratch, otherwise rest in this repo had been implement correct
     - I would break down the application into smaller microservices, like CRUD prices part could be HandlePriceService, in this case if there's rule or bussiness model concerning of pricing change, it could be make easier to scale the application
     - Use a message queue like RabbitMQ which used to handle the communication between the different components of the application, for example, when a new listing is created then publish a message to the queue indicating new listing either way when new pricing updated
     - Unit test: use like Jest or Enzyme to test for backend and Mocha or Chai for front
     - Monitor:  Datadog to monitor the application and performance

- **The application aims at storing hundreds of thousands listings and millions of prices, and be accessed by millions
  of users every month. What should be anticipated and done to handle it?**
      Follow could be help to enhance the performance:
    - Use load balancer
    - Use caching like Redis we could had pre-cache and regular-cache
    - Index database queries like in postgresql
    - Use CDN for example in AWS S3 bucket to store updated files images video as path_url storage in Database
  

  NB : You can update the [given architecture schema](./schemas/Aviv_Technical_Test_Architecture.drawio) by importing it
  on [diagrams.net](https://app.diagrams.net/) 
