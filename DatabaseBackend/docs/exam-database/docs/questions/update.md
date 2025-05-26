# Update Question

## Endpoint: `/updateQuestion`

### Method: POST

### Description
This endpoint is used to update an existing question in the database.

### Request Body
- **Type**: `UpdateQuestionRequest`
- **Content**: Includes the details for the update such as new question text, options, etc.

#### Sample Request Body
```json
{
  "questionTrackingNumber": "Q-1001",
  "newQuestionText": "What is the first-line treatment for hypertension?",
  "modifications": "Updated the question text based on new guidelines",
  "authorOfChange": "Dr. Jones",
  "dateOfChange": "2023-11-09"
}
```

### Responses
- **200 OK**: The question was successfully updated.
- **404 Not Found**: The question with the given tracking number was not found.
- **500 Internal Server Error**: An unexpected error occurred on the server.