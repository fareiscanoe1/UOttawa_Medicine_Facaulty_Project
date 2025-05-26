# Get Objective

## Endpoint: `/getObjectiveById`

### Method: GET

### Description
This endpoint retrieves detailed information about a specific objective based on its ID.

### Request Parameters
- **objectiveId** (required): The unique identifier of the objective.

### Example Request
GET /getObjectiveById?objectiveId=42

### Responses
- **200 OK**: Success response with the details of the requested objective.
- **404 Not Found**: No objective found with the provided ID.
- **500 Internal Server Error**: An error occurred on the server while processing the request.
