# NC NEWS RESTful API

The back-end RESTful API for Northcoders News. All end-points for this API can found here: LINK

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

The project will need to be cloned.

### Prerequisites

- Node v13.0.0
- Express 6.12.0

Database

- psql 10.12

Testing

- Mocha 6.2.2
- Chai & Chai-sorted 4.2.0
- SuperTest 4.0.2

### Installing

Project dependencies are stored in package.json, just run:

- npm install

## Running the tests

Tests have been created using Mocha, Chai & chai-sorted, which tested for ordering of returned queries. HTTP requests and end-point testing has been created with the SuperTest libarary.

Please make sure all dependencies have been installed before running any tests. The database can be run in either development or test environment, by default it is set to develepment.

To seed the database run the relevant command:

- Test data: npm run seed-test
- Development data: npm run seed

To run tests for the utility functions:

- npm run test-utils

To run tests for end-points:

- npm run app-test

## Deployment

Add additional notes about how to deploy this on a live system

## Versioning

Current version: 1.0.0

## Authors

Paul Cook
