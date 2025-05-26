package T22.DatabaseBackend.controllers;

import T22.DatabaseBackend.models.Exam;
import T22.DatabaseBackend.models.Option;
import T22.DatabaseBackend.models.Question;
import T22.DatabaseBackend.services.QuestionService;
import T22.DatabaseBackend.utils.NewQuestionRequest;
import T22.DatabaseBackend.utils.UpdateQuestionRequest;
import org.apache.coyote.Response;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")  // the link here is the url that we allow to communicate with this controller. We will put the url of our react app here.
public class QuestionController {

    @Autowired
    private QuestionService questionService;


    @PostMapping("/addQuestion")
    public ResponseEntity<String> pushQuestion(@RequestBody NewQuestionRequest newQuestionRequest){
        return questionService.pushQuestion(newQuestionRequest);
    }

    @PostMapping("/updateQuestion")
    public ResponseEntity<?> updateQuestion(@RequestBody UpdateQuestionRequest updateQuestionRequest){
        return questionService.updateQuestion(updateQuestionRequest);
    }

    @GetMapping("/trackingNumberIsUsed")
    public ResponseEntity<Boolean> isTrackingNumberUsed(String trackingNumber){
        return questionService.isTrackingNumberUsed(trackingNumber);
    }

    @GetMapping("/getAllQuestions")
    public ResponseEntity<List<Question>> getAllQuestions(){
        return questionService.getAllQuestions();
    }

    @GetMapping("/getQuestionsByTrackingNumber")
    public ResponseEntity<?> getQuestionsByTrackingNumber(@RequestParam String trackingNumber){
        return questionService.getQuestionsByTrackingNumber(trackingNumber);
    }

    @GetMapping("/getLatestQuestionVersion")
    public ResponseEntity<?> getLatestQuestionVersion(@RequestParam String trackingNumber){
        return questionService.getLatestQuestionVersion(trackingNumber);
    }

    @PostMapping("/updateDiscrimination")
    public ResponseEntity<?> updateDiscrimination(@RequestParam UUID examSectionId, @RequestParam UUID questionId, @RequestParam int questionVersionNumber, @RequestParam double discrimination){
        return questionService.updateDiscrimination(examSectionId, questionId, questionVersionNumber, discrimination);
    }

    @PostMapping("/updateDifficulty")
    public ResponseEntity<?> updateDifficulty(@RequestParam UUID examSectionId, @RequestParam UUID questionId, @RequestParam int questionVersionNumber, @RequestParam double difficulty){
        return questionService.updateDifficulty(examSectionId, questionId, questionVersionNumber, difficulty);
    }

    @PostMapping("updateFlags")
    public ResponseEntity<?> updateFlags(@RequestParam UUID examSectionId, @RequestParam UUID questionId, @RequestParam int questionVersionNumber, @RequestParam String flags){
        return questionService.updateFlags(examSectionId, questionId, questionVersionNumber, flags);
    }

}
