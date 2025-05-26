# Delete Question Endpoint

This document covers the `DELETE` endpoint available in the `QuestionController` used for deleting a question from the database.

## Delete a Question

### Endpoint: `/deleteQuestion`
Delete a specific question from the database.

#### Query Parameters
- `questionId`: The unique identifier of the question to be deleted.
- `version`: The version number of the question if applicable.

#### Responses
- `200 OK`: Successfully deleted the question.
- `404 Not Found`: No question found for the given ID.
- `500 Internal Server Error`: An error occurred on the server.



