# Update Exam

## Endpoint: `/updateExam`

### Method: POST

### Description
This endpoint updates the details of an existing medical exam.

### Request Body
- **Type**: `UpdateExamRequest`
- **Content**: The request body should include the updated details of the exam as outlined by the `UpdateExamRequest` DTO.

#### Sample Request Body
```json
{
  "examId": "1234",
  "newName": "Cardiology Advanced",
  "updatedSections": [
    // Array of updated sections with questions
  ],
  "newDuration": 150
}
```
### Responses
- **200 OK**: Success response indicating that the exam details have been updated.
- **400 Bad Request**: The request is not properly formatted or is missing required information.
- **404 Not Found**: No exam found with the provided ID to update.
- **500 Internal Server Error**: An error occurred on the server while processing the request.
