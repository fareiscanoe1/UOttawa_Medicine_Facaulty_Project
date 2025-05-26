# Delete Exam

## Endpoint: `/deleteExam`

### Method: DELETE

### Description
This endpoint deletes a specified medical exam from the database.

### Request Parameters
- **examId** (required): The unique identifier of the exam to be deleted.

### Example Request
DELETE /deleteExam?examId=1234

### Responses
- **200 OK**: Success response indicating that the exam has been successfully deleted.
- **404 Not Found**: No exam found with the provided ID to delete.
- **500 Internal Server Error**: An error occurred on the server while processing the request.