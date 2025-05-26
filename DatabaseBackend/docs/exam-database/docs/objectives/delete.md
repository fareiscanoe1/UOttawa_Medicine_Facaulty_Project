# Delete Objective

## Endpoint: `/deleteObjective`

### Method: DELETE

### Description
This endpoint deletes a specified objective from the medical exam database.

### Request Parameters
- **objectiveId** (required): The unique identifier of the objective to be deleted.

### Example Request
DELETE /deleteObjective?objectiveId=42

### Responses
- **200 OK**: Success response indicating that the objective has been successfully deleted.
- **404 Not Found**: No objective found with the provided ID to delete.
- **500 Internal Server Error**: An error occurred on the server while processing the request.
