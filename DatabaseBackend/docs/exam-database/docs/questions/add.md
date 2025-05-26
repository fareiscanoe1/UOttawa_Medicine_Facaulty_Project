# Add Question

## Endpoint: `/addQuestion`

### Method: POST

### Description
This endpoint allows for the submission of a new medical examination question to the database.

### Request Body
- **Type**: `NewQuestionRequest`
- **Content**: The request body should include all the details of the new question as outlined by the `NewQuestionRequest` DTO (Data Transfer Object).

#### Sample Request Body
```json
{
  "questionTrackingNumber": "Q-1001",
  "questionEnglish": "Which of the following medications is primarily used to treat hypertension?",
  "questionFrench": "Lequel des médicaments suivants est principalement utilisé pour traiter l'hypertension?",
  "options": [
    {
      "optionEnglish": "Amlodipine",
      "optionFrench": "Amlodipine",
      "correct": true
    },
    {
      "optionEnglish": "Metformin",
      "optionFrench": "Métformine",
      "correct": false
    },
    {
      "optionEnglish": "Levothyroxine",
      "optionFrench": "Lévothyroxine",
      "correct": false
    },
    {
      "optionEnglish": "Atorvastatin",
      "optionFrench": "Atorvastatine",
      "correct": false
    }
  ],
  "type": "Multiple Choice",
  "overallDifficulty": 2.5,
  "overallDiscrimination": 0.7,
  "authorOfChange": "Dr. Smith",
  "dateOfChange": "2023-11-08",
  "modifications": "Created for Cardiology Module",
  "referenceArticleOrBook": "Harrison's Principles of Internal Medicine",
  "objectiveNumber": 42
}
```

### Responses
- **200 OK**: Success response indicating that the question has been successfully added. The response body contains a confirmation message.
- **400 Bad Request**: The request is not properly formatted or is missing required information.
- **500 Internal Server Error**: An error occurred on the server while processing the request.
