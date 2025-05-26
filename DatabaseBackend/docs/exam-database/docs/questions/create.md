# Exam Database API Documentation

Welcome to the Exam Database API. This API provides endpoints for managing exam-related data, including questions, exams, and objectives.

## Getting Started

To begin using this API, you'll need to set up your environment and get the necessary credentials if authentication is required.

### Prerequisites

- [Postman](https://www.postman.com/) or any API client to interact with the API.
- Access credentials (if applicable).

## Authentication

Describe how the user can get authenticated, any tokens they might need, and how to use them in subsequent requests.

## API Endpoints

Below are the available endpoints, grouped by functionality.

### Questions

#### List Questions

`GET /getAllQuestions`

Retrieves a list of all questions.

#### Get Question

`GET /getQuestionsByTrackingNumber?trackingNumber={trackingNumber}`

Retrieves a specific question by its tracking number.

#### Create Question

`POST /addQuestion`

Creates a new question.

**Request Body:**

```json
{
  "questionText": "Sample question text",
  "choices": ["Option1", "Option2"],
  "correctAnswer": "Option1",
  "metadata": {}
}
