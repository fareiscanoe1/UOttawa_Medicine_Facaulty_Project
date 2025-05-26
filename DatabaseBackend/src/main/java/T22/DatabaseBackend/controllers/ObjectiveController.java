package T22.DatabaseBackend.controllers;


import T22.DatabaseBackend.models.ObjectiveCode;
import T22.DatabaseBackend.services.ObjectiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class ObjectiveController {

    @Autowired
    ObjectiveService objectiveService;

    @GetMapping("/getAllObjectiveCodes")
    public ResponseEntity<List<ObjectiveCode>> getAllObjectiveCodes(){
        return objectiveService.getAllObjectiveCodes();
    }

    @GetMapping("/getObjectiveHeadingByCode")
    public ResponseEntity<?> getObjectiveHeadingByObjectiveCode(@RequestParam String objectiveCode){
        return objectiveService.getObjectiveHeadingByCode(objectiveCode);
    }

    @GetMapping("/getAllObjectives")
    public ResponseEntity<?> getAllObjectives(){
        return objectiveService.getObjectives();
    }

    @GetMapping("/objectiveNumberIsUsed")
    public ResponseEntity<Boolean> objectiveNumberIsUsed(@RequestParam int objectiveNumber){
        return objectiveService.isNumberUsed(objectiveNumber);
    }

    //This endpoint will be used to post a new ObjectiveCode and Objective
    @PostMapping("/addNewObjective")
    public ResponseEntity<String> newObjective(@RequestParam String objectiveCode, @RequestParam String objectiveHeading, @RequestParam int objectiveNumber, @RequestParam String description, @RequestParam String facultyRole, @RequestParam String fields, @RequestParam String objectiveType){
        return objectiveService.addObjective(objectiveCode, objectiveHeading, objectiveNumber, description, facultyRole, fields, objectiveType);
    }
}
