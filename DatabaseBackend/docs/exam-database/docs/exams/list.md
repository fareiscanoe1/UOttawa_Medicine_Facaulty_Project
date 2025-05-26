# List Exams

## Endpoint: `/getAllExams`

### Method: GET

### Description
This endpoint retrieves a list of all medical exams in the database.

### Request Parameters
No request parameters are needed for this endpoint.

### Responses
- **200 OK**: Success response containing an array of exam objects, each with details such as exam ID, name, and associated sections.
- **404 Not Found**: No exams were found in the database.
- **500 Internal Server Error**: An error occurred on the server while processing the request.
