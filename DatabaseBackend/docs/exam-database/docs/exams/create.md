# Create Exam

## Endpoint: `/addExam`

### Method: POST

### Description
This endpoint is used to add a new medical exam to the database.

### Request Body
- **Type**: `NewExamRequest`
- **Content**: The request body should include all details of the new exam as outlined by the `NewExamRequest` DTO.

#### Sample Request Body
```json
{
  "examName": "Cardiology Preliminary",
  "examSections": [
    {
      "sectionName": "Heart Anatomy",
      "questions": [
        // Array of question IDs
      ]
    }
  ],
  "duration": 120,
  "totalMarks": 100
}
```
Responses
200 OK: Success response indicating that the exam has been successfully added. The response body contains a confirmation message.
400 Bad Request: The request is not properly formatted or is missing required information.
500 Internal Server Error: An error occurred on the server while processing the request.