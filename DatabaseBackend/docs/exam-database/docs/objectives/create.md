# Create Objective

## Endpoint: `/addObjective`

### Method: POST

### Description
This endpoint is used to add a new objective to the medical exam database.

### Request Body
- **Type**: `NewObjectiveRequest`
- **Content**: The request body should include all details of the new objective.

#### Sample Request Body
```json
{
  "objectiveName": "Understand Cardiac Arrhythmias",
  "description": "The objective focuses on identifying and treating different types of cardiac arrhythmias.",
  "importanceLevel": "High"
}
```

### Responses
- **200 OK**: Success response indicating that the objective has been successfully added.
- **400 Bad Request**: The request is not properly formatted or is missing required information.
- **500 Internal Server Error**: An error occurred on the server while processing the request.