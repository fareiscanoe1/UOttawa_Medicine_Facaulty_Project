package T22.DatabaseBackend.services;


import T22.DatabaseBackend.models.Objective;
import T22.DatabaseBackend.models.ObjectiveCode;
import T22.DatabaseBackend.repositories.ObjectiveCodeRepository;
import T22.DatabaseBackend.repositories.ObjectiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ObjectiveService {

    @Autowired
    ObjectiveCodeRepository objectiveCodeRepository;

    @Autowired
    ObjectiveRepository objectiveRepository;

    public ResponseEntity<List<ObjectiveCode>> getAllObjectiveCodes(){
        List<ObjectiveCode> retVal = objectiveCodeRepository.findAll();
        return ResponseEntity.ok().body(retVal);
    }

    public ResponseEntity<?> getObjectiveHeadingByCode(String objectiveCode){
        ObjectiveCode obCode = objectiveCodeRepository.findById(objectiveCode).orElse(null);
        if (obCode == null){
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
        else{
            return ResponseEntity.ok().body(obCode.getObjectiveHeading());
        }
    }

    public ResponseEntity<?> getObjectives(){
        List<Objective> objectives = objectiveRepository.findAll();
        return ResponseEntity.ok().body(objectives);
    }

    public ResponseEntity<Boolean> isNumberUsed(int objectiveNumber){
        Objective objective = objectiveRepository.findById(objectiveNumber).orElse(null);
        if(objective == null) {
            return ResponseEntity.ok().body(false);
        }
        return ResponseEntity.ok().body(true);
    }

    public ResponseEntity<String> addObjective(String objectiveCode, String objectiveHeading, int objectiveNumber, String description, String facultyRole, String fields, String objectiveType){
        // Creating a new ObjectiveCode object and saving it to the database
        ObjectiveCode obCode = new ObjectiveCode();
        obCode.setObjectiveCodeId(objectiveCode);
        obCode.setObjectiveHeading(objectiveHeading);
        objectiveCodeRepository.save(obCode);

        // Creating a new Objective object and saving it to the database
        Objective objective = new Objective();
        objective.setObjectiveNumber(objectiveNumber);
        objective.setDescription(description);
        objective.setFacultyRole(facultyRole);
        objective.setFields(fields);
        objective.setObjectiveType(objectiveType);
        // link the Objective to the Objective Code
        objective.setObjectiveCode(obCode);
        objectiveRepository.save(objective);

        return ResponseEntity.ok().body("Successfully added new objective and new objective code!");
    }
}
