# Update Objective

## Endpoint: `/updateObjective`

### Method: POST

### Description
This endpoint updates the details of an existing objective.

### Request Body
- **Type**: `UpdateObjectiveRequest`
- **Content**: The request body should include the updated details of the objective.

#### Sample Request Body
```json
{
  "objectiveId": "42",
  "newName": "Master Cardiac Arrhythmias",
  "newDescription": "Updated description and learning outcomes for the objective."
}
```

### Responses
- **200 OK**: Success response indicating that the objective details have been updated.
- **400 Bad Request**: The request is not properly formatted or is missing required information.
- **404 Not Found**: No objective found with the provided ID to update.
- **500 Internal Server Error**: An error occurred on the server while processing the request.