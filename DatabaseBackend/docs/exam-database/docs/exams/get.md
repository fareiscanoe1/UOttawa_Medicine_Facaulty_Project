# Get Exam

## Endpoint: `/getExamById`

### Method: GET

### Description
This endpoint retrieves detailed information about a specific medical exam based on its ID.

### Request Parameters
- **examId** (required): The unique identifier of the exam.

### Example Request
GET /getExamById?examId=1234

### Responses
- **200 OK**: Success response with the details of the requested exam.
- **404 Not Found**: No exam found with the provided ID.
- **500 Internal Server Error**: An error occurred on the server while processing the request.
