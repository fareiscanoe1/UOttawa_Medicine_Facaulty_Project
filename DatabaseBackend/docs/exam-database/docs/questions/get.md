# Question Retrieval Endpoints

This document covers the `GET` endpoints available in the `QuestionController` that are used for retrieving question data.

## Get All Questions

### Endpoint: `/getAllQuestions`
Retrieve a list of all questions from the database.

#### Responses
- `200 OK`: Successfully retrieved the list of all questions.
- `500 Internal Server Error`: An error occurred on the server.

## Check Tracking Number Usage

### Endpoint: `/trackingNumberIsUsed`
Check if a tracking number is already used for any question.

#### Query Parameters
- `trackingNumber`: The tracking number to check.

#### Responses
- `200 OK`: Returns `true` if tracking number is used, `false` otherwise.
- `400 Bad Request`: The tracking number is not provided.
- `500 Internal Server Error`: An error occurred on the server.

## Get Questions by Tracking Number

### Endpoint: `/getQuestionsByTrackingNumber`
Retrieve all versions of questions associated with a specific tracking number.

#### Query Parameters
- `trackingNumber`: The tracking number for the question.

#### Responses
- `200 OK`: Successfully retrieved question versions.
- `404 Not Found`: No questions found for the given tracking number.
- `500 Internal Server Error`: An error occurred on the server.

## Get Latest Question Version

### Endpoint: `/getLatestQuestionVersion`
Fetch the most recent version of a question for a given tracking number.

#### Query Parameters
- `trackingNumber`: The tracking number for the question.

#### Responses
- `200 OK`: Successfully retrieved the latest version of the question.
- `404 Not Found`: No question found for the given tracking number.
- `500 Internal Server Error`: An error occurred on the server.

