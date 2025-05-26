package T22.DatabaseBackend.controllers;

import T22.DatabaseBackend.DatabaseBackendApplication;
import T22.DatabaseBackend.RestTemplateConfig;
import T22.DatabaseBackend.models.Exam;
import T22.DatabaseBackend.models.Option;
import T22.DatabaseBackend.utils.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Import;
import org.springframework.http.*;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ActiveProfiles;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;


import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest(classes = DatabaseBackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(RestTemplateConfig.class)
public class ExamControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private NewExamRequest newExamRequest;

    private TestRestTemplate testRestTemplate = new TestRestTemplate();

    //specified port
    private int port = 8080;
    @BeforeEach
    public void setup() {
        newExamRequest = new NewExamRequest();
        newExamRequest.setName("Sample Exam");
    }
    @Test
    public void testGetAllExams() {
        String url = "http://localhost:" + port + "/getAllExams";

        ResponseEntity<String> response = testRestTemplate.getForEntity(url, String.class);

        assertEquals(200, response.getStatusCodeValue());

    }
    @Test
    public void testGetAllObjectiveCodes() {

        String url = "http://localhost:" + port + "/getAllObjectiveCodes";

        ResponseEntity<String> response = testRestTemplate.getForEntity(url, String.class);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    public void testGetAllObjectives() {

        String url = "http://localhost:" + port + "/getAllObjectives";

        ResponseEntity<String> response = testRestTemplate.getForEntity(url, String.class);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    public void testGetObjectiveHeadingCode() {
        String urlCreate = "http://localhost:" + port + "/addNewObjective";

        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("objectiveCode", "testCode1");
        parameters.add("objectiveHeading", "testHeading");
        parameters.add("objectiveNumber", "2");
        parameters.add("description", "testDescription");
        parameters.add("facultyRole", "testRole");
        parameters.add("fields", "testFields");
        parameters.add("objectiveType", "testType");

        ResponseEntity<String> responseCreate = testRestTemplate.postForEntity(urlCreate, parameters, String.class);

        assertEquals(200, responseCreate.getStatusCodeValue());

        String url = "http://localhost:" + port + "/getObjectiveHeadingByCode?objectiveCode=testCode1";

        ResponseEntity<String> response = testRestTemplate.getForEntity(url, String.class);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("testHeading", response.getBody());
    }

    @Test
    public void testObjectiveNumberIsUsed() {

        String url = "http://localhost:" + port + "/objectiveNumberIsUsed?objectiveNumber=0";

        ResponseEntity<Boolean> response = testRestTemplate.getForEntity(url, Boolean.class);

        assertEquals(200, response.getStatusCodeValue());

        assertFalse(response.getBody());  // Assuming that the objective number 1 is not used.
    }

    @Test
    public void testAddNewObjective() {

        String url = "http://localhost:" + port + "/addNewObjective";

        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("objectiveCode", "testCode");
        parameters.add("objectiveHeading", "testHeading");
        parameters.add("objectiveNumber", "2");
        parameters.add("description", "testDescription");
        parameters.add("facultyRole", "testRole");
        parameters.add("fields", "testFields");
        parameters.add("objectiveType", "testType");

        ResponseEntity<String> response = testRestTemplate.postForEntity(url, parameters, String.class);

        assertEquals(200, response.getStatusCodeValue());

        assertEquals("Successfully added new objective and new objective code!", response.getBody());
    }

    @Test
    public void testIsTrackingNumberUsed() {

        String url = "http://localhost:" + port + "/trackingNumberIsUsed?trackingNumber=testNumber";

        ResponseEntity<Boolean> response = testRestTemplate.getForEntity(url, Boolean.class);

        assertEquals(200, response.getStatusCodeValue());

        assertFalse(response.getBody());
    }

    @Test
    public void testGetAllQuestions() {

        String url = "http://localhost:" + port + "/getAllQuestions";

        ResponseEntity<List> response = testRestTemplate.getForEntity(url, List.class);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    public void testGetQuestionsByTrackingNumber() {

        String url = "http://localhost:" + port + "/getQuestionsByTrackingNumber?trackingNumber=sampleTrackingNumber";

        ResponseEntity<?> response = testRestTemplate.getForEntity(url, String.class);

        assertEquals(200, response.getStatusCodeValue());
    }
//    @Test
//    public void testPushExam() {
//
//        String url = "http://localhost:" + port + "/addExam";
//
//        NewExamRequest newExamRequest = new NewExamRequest();
//        newExamRequest.setName("Sample Exam");
//
//        ExamObjectives objective1 = new ExamObjectives();
//        objective1.setObjectiveCode("a01");
//        objective1.setNumberOfQuestionsOnExam(10);
//
//        ExamObjectives objective2 = new ExamObjectives();
//        objective2.setObjectiveCode("a02");
//        objective2.setNumberOfQuestionsOnExam(5);
//
//        List<ExamObjectives> examObjectives = Arrays.asList(objective1, objective2);
//        newExamRequest.setExamObjectives(examObjectives);
//
//        Section section1 = new Section();
//        section1.setType("MCQ");
//
//        Section section2 = new Section();
//        section2.setType("CDMQ");
//
//        List<Section> sections = Arrays.asList(section1, section2);
//        newExamRequest.setSections(sections);
//
//        ResponseEntity<?> response = testRestTemplate.postForEntity(url, newExamRequest, String.class);
//
//        assertEquals(200, response.getStatusCodeValue());
//    }
    @Test
    public void testAddNewObjectiveWithInvalidInput() {
        String url = "http://localhost:" + port + "/addNewObjective";

        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("objectiveCode", ""); // Invalid input: empty string
        parameters.add("objectiveHeading", "testHeading");
        parameters.add("objectiveNumber", "");
        parameters.add("description", "");
        parameters.add("facultyRole", "testRole");
        parameters.add("fields", "testFields");
        parameters.add("objectiveType", "testType");

        ResponseEntity<String> response = testRestTemplate.postForEntity(url, parameters, String.class);

        assertEquals(400, response.getStatusCodeValue()); // Expecting a Bad Request error
    }
    @Test
    public void whenAddExamWithInvalidData_thenStatus500() {
        NewExamRequest newExamRequest = new NewExamRequest();
        newExamRequest.setName(""); // Invalid input: empty name

        ResponseEntity<String> response = testRestTemplate.postForEntity(
                "http://localhost:" + port + "/addExam",
                newExamRequest,
                String.class
        );

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
    @Test
    public void whenGetQuestionsByInvalidTrackingNumber_thenEmptyArray() {
        ResponseEntity<String> response = testRestTemplate.getForEntity(
                "http://localhost:" + port + "/getQuestionsByTrackingNumber?trackingNumber=INVALIDDD",
                String.class
        );
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("[]", response.getBody());

    }

    @Test
    public void whenAddQuestionWithInValidData_thenStatus400() {
        NewQuestionRequest newQuestionRequest = new NewQuestionRequest();
        ResponseEntity<String> response = testRestTemplate.postForEntity(
                "http://localhost:" + port + "/addQuestion",
                newQuestionRequest,
                String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void whenDeleteNonExistentExam_thenStatus404() {
        UUID examId = UUID.randomUUID(); // This ID does not exist in the database

        ResponseEntity<Boolean> response = testRestTemplate.exchange(
                "http://localhost:" + port + "/deleteExam?examId=" + examId.toString(),
                HttpMethod.DELETE,
                HttpEntity.EMPTY,
                Boolean.class
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void whenGetExamObjectiveCodesWithNonExistentId_thenStatus204NoContent() {
        // Using a randomly generated UUID which is unlikely to exist in the database
        UUID nonExistentId = UUID.randomUUID();

        ResponseEntity<String> response = testRestTemplate.getForEntity(
                "http://localhost:" + port + "/getExamObjectiveCodes?examId=" + nonExistentId.toString(),
                String.class
        );

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
    @Test
    public void whenSendGetRequestToPostEndpoint_thenStatus405MethodNotAllowed() {
        ResponseEntity<String> response = testRestTemplate.getForEntity(
                "http://localhost:" + port + "/addNewObjective",
                String.class
        );

        assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
    }

    @Test
    public void whenAddQuestionWithLongText_thenStatus400BadRequest() {
        NewQuestionRequest newQuestionRequest = new NewQuestionRequest();
        // Create an extremely long string for the question text
        String longText = String.join("", Collections.nCopies(10000, "a"));
        newQuestionRequest.setQuestionEnglish(longText);

        ResponseEntity<String> response = testRestTemplate.postForEntity(
                "http://localhost:" + port + "/addQuestion",
                newQuestionRequest,
                String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

//    @Test
//    public void whenAddExamWithDuplicateName_thenStatus500() {
//        NewExamRequest newExamRequest = new NewExamRequest();
//        newExamRequest.setName("Duplicate Exam Name");
//
//        testRestTemplate.postForEntity("http://localhost:" + port + "/addExam", newExamRequest, String.class);
//        // Second request with the same name should fail
//        ResponseEntity<String> response = testRestTemplate.postForEntity(
//                "http://localhost:" + port + "/addExam",
//                newExamRequest,
//                String.class
//        );
//
//        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
//    }

    @Test
    public void whenGetExamByIdWithInvalidIdFormat_thenStatus400BadRequest() {
        String invalidId = "not-a-valid-uuid";

        ResponseEntity<String> response = testRestTemplate.getForEntity(
                "http://localhost:" + port + "/getExamById?examId=" + invalidId,
                String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void whenAddNewObjectiveWithInvalidNumber_thenStatus400BadRequest() {
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("objectiveCode", "OBJ123");
        parameters.add("objectiveHeading", "Sample Heading");
        parameters.add("objectiveNumber", "-1"); // Negative numbers are invalid

        ResponseEntity<String> response = testRestTemplate.postForEntity(
                "http://localhost:" + port + "/addNewObjective",
                parameters,
                String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
