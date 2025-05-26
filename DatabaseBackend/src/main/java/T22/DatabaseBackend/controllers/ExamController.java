package T22.DatabaseBackend.controllers;

import T22.DatabaseBackend.models.Exam;
import T22.DatabaseBackend.services.ExamService;
import T22.DatabaseBackend.utils.NewExamRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")  // the link here is the url that we allow to communicate with this controller. We will put the url of our react app here.
public class ExamController {

    @Autowired
    ExamService examService;

    @RequestMapping("/addExam")
    public ResponseEntity<?> pushExam(@RequestBody NewExamRequest newExamRequest){
        return examService.pushExam(newExamRequest);
    }

    @GetMapping("/getAllExams")
    public ResponseEntity<List<Exam>> getAllExams(){
        return examService.getAllExams();
    }

    @GetMapping("/getExamObjectiveCodes")
    public ResponseEntity<?> getExamObjectiveCodes(@RequestParam UUID examId){
        return examService.getExamObjectiveCodes(examId);
    }

    @GetMapping("/getExamById")
    public ResponseEntity<?> getExamById(@RequestParam UUID examId){
        return examService.getExamById(examId);
    }

    @DeleteMapping("/deleteExam")
    public ResponseEntity<Boolean> deleteExam(@RequestParam UUID examId){ return examService.deleteExam(examId);}
}
