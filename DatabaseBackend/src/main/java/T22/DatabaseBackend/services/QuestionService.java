package T22.DatabaseBackend.services;

import T22.DatabaseBackend.models.*;
import T22.DatabaseBackend.repositories.ExamRepository;
import T22.DatabaseBackend.repositories.ExamSectionQuestionRepository;
import T22.DatabaseBackend.repositories.ObjectiveRepository;
import T22.DatabaseBackend.repositories.QuestionRepository;
import T22.DatabaseBackend.utils.NewQuestionRequest;
import T22.DatabaseBackend.utils.UpdateQuestionRequest;
import net.bytebuddy.dynamic.scaffold.MethodGraph;
import org.hibernate.event.spi.ResolveNaturalIdEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class QuestionService {

    @Autowired
    private ObjectiveRepository objectiveRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamSectionQuestionRepository examSectionQuestionRepository;


    public ResponseEntity<String> pushQuestion(NewQuestionRequest newQuestionRequest){
        // Create question entity and set the data
        Question question = new Question();
        question.setQuestionTrackingNumber(newQuestionRequest.getQuestionTrackingNumber());
        question.setType(newQuestionRequest.getType());
        question.setQuestionEnglish(newQuestionRequest.getQuestionEnglish());
        question.setQuestionFrench(newQuestionRequest.getQuestionFrench());
        question.setOverallDifficulty(newQuestionRequest.getOverallDifficulty());
        question.setOverallDiscrimination(newQuestionRequest.getOverallDiscrimination());
        question.setAuthorOfChange(newQuestionRequest.getAuthorOfChange());
        question.setModifications(newQuestionRequest.getModifications());
        question.setReferenceArticleOrBook(newQuestionRequest.getReferenceArticleOrBook());
        // set dateOfChange of question to the current date
        question.setDateOfChange(new Date());

        // link this question to the given objective number
        Objective objective = objectiveRepository.findById(newQuestionRequest.getObjectiveNumber()).orElse(null);
        if (objective ==  null){
            return ResponseEntity.badRequest().body("The given objective number does not exist!");
        }
        question.setObjective(objective);

        // set the list of options for this question
        question.setOptionList(newQuestionRequest.getOptions());

        // save the new question
        UUID newId = UUID.randomUUID();
        QuestionId id = new QuestionId();
        id.setQuestionId(newId);
        id.setVersionNumber(1);  // since this is a new Question, we will set the version number to 1.
        question.setId(id);
        questionRepository.save(question);

        return ResponseEntity.ok().body("New question added to the database!");
    }

    public ResponseEntity<Boolean> isTrackingNumberUsed(String trackingNumber){
        List<Question> questions = questionRepository.findAllByQuestionTrackingNumber(trackingNumber);
        if(questions.size() == 0){
            return ResponseEntity.ok().body(false);
        }
        return ResponseEntity.ok().body(true);
    }

    public ResponseEntity<List<Question>> getAllQuestions(){
        List<Question> questions = questionRepository.findAll();

        // create a set containing all the unique questions ids
        Set<String> uniqueQuestionIds = new HashSet<String>();
        for(int i = 0; i < questions.size(); i++){
            uniqueQuestionIds.add(questions.get(i).getQuestionTrackingNumber());
        }

        List<Question> returnList = new ArrayList<Question>();
        Iterator<String> it = uniqueQuestionIds.iterator();
        while(it.hasNext()){
            String currentId = it.next();

            // construct a list that contains only the questions which have the same UUID
            List<Question> currentQuestions = new ArrayList<Question>();
            for(Question q : questions){
                if (q.getQuestionTrackingNumber().equals(currentId)){
                    currentQuestions.add(q);
                }
            }

            // now find the Question in currentQuestions that has the highest versionNumber
            int highestIndex = 0;
            for(int i = 1; i < currentQuestions.size(); i++){
                if (currentQuestions.get(i).getId().getVersionNumber() > currentQuestions.get(highestIndex).getId().getVersionNumber()){
                    highestIndex = i;
                }
            }
            // The question in currentQuestions with the highest version number is question at index highestIndex
            Question questionToAdd = currentQuestions.get(highestIndex);

            // add it to the return list
            returnList.add(questionToAdd);
        }

        return ResponseEntity.ok().body(returnList);
    }


    public ResponseEntity<?> getQuestionsByTrackingNumber(String trackingNumber){
        List<Question> list = questionRepository.findAllByQuestionTrackingNumber(trackingNumber);
        return ResponseEntity.ok().body(list);
    }

    public ResponseEntity<?> getLatestQuestionVersion(String trackingNumber){
        List<Question> list = questionRepository.findAllByQuestionTrackingNumber(trackingNumber);

        // Return a 404 not found if the given tracking number is invalid
        if (list.size() == 0){
            return ResponseEntity.badRequest().body("There are no questions associated to the given trackingNumber");
        }
        Collections.sort(list, new Comparator<Question>() {
            @Override
            public int compare(Question o1, Question o2) {
                return o2.getId().getVersionNumber()-o1.getId().getVersionNumber();
            }
        });
        return ResponseEntity.ok().body(list.get(0));
    }

    public ResponseEntity<?> updateQuestion(UpdateQuestionRequest updateQuestionRequest){
        // first make sure that the given question exists in the database
        List<Question> questions = questionRepository.findAllByQuestionTrackingNumber(updateQuestionRequest.getQuestionTrackingNumber());
        if (questions.size() == 0){
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
        // if we reach here, it means we have at least one question with the given questionTrackingNumber
        // find the one with the highest version number
        int highestIndex = 0;
        for(int i = 1; i < questions.size(); i++){
            if(questions.get(i).getId().getVersionNumber() > questions.get(highestIndex).getId().getVersionNumber()){
                highestIndex = i;
            }
        }
        Question highestVersionQuestion = questions.get(highestIndex);

        // now we make a new question
        // set the fields that are given in the request
        Question newQuestion = new Question();
        newQuestion.setQuestionTrackingNumber(updateQuestionRequest.getQuestionTrackingNumber());
        newQuestion.setQuestionEnglish(updateQuestionRequest.getQuestionEnglish());
        newQuestion.setQuestionFrench(updateQuestionRequest.getQuestionFrench());
        newQuestion.setReferenceArticleOrBook(updateQuestionRequest.getReferenceArticleOrBook());
        newQuestion.setModifications(updateQuestionRequest.getModifications());
        newQuestion.setAuthorOfChange(updateQuestionRequest.getAuthorOfChange());
        newQuestion.setOptionList(updateQuestionRequest.getOptions());
        // set the date and update the version number
        newQuestion.setDateOfChange(new Date());
        QuestionId id = new QuestionId();
        id.setQuestionId(UUID.randomUUID());
        id.setVersionNumber(highestVersionQuestion.getId().getVersionNumber() + 1);
        newQuestion.setId(id);

        // set the rest of the fields that come from the old question
        newQuestion.setObjective(highestVersionQuestion.getObjective());
        newQuestion.setType(highestVersionQuestion.getType());
        newQuestion.setOverallDiscrimination(highestVersionQuestion.getOverallDiscrimination());
        newQuestion.setOverallDifficulty(highestVersionQuestion.getOverallDifficulty());

        questionRepository.save(newQuestion);

        return ResponseEntity.ok().body("Question was updated!");
    }

    public ResponseEntity<?> updateDiscrimination(UUID examSectionId, UUID questionId, int questionVersionNumber, double discrimination){
        // need to construct the ExamSectionQuestionKey so that we can find the correct ExamSectionQuestion
        // entity in the database
        ExamSectionQuestionKey examSectionQuestionKey = new ExamSectionQuestionKey();
        examSectionQuestionKey.setExamSectionId(examSectionId);
        QuestionId id = new QuestionId();
        id.setQuestionId(questionId);
        id.setVersionNumber(questionVersionNumber);
        examSectionQuestionKey.setQuestionId(id);

        // query the database
        ExamSectionQuestion examSectionQuestion = examSectionQuestionRepository.findById(examSectionQuestionKey).orElse(null);
        if(examSectionQuestion == null){
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
        examSectionQuestion.setManualDiscrimination(discrimination);
        String questionTrackingNumber = examSectionQuestion.getQuestion().getQuestionTrackingNumber();
        examSectionQuestionRepository.save(examSectionQuestion);

        // We also need to set the overall discrimination for the question (average)
        // First, get all the ExamSectionQuestion entities
        List<ExamSectionQuestion> examSectionQuestions = examSectionQuestionRepository.findAll();

        // Now, go through all the ExamSectionQuestions and compare the id of the Question entity in it to the one
        // defined above
        BigDecimal discriminationSum = new BigDecimal("0.0");
        int numberOfInstances = 0;
        for(int i = 0; i < examSectionQuestions.size(); i++){
            ExamSectionQuestion current = examSectionQuestions.get(i);
            if(current.getQuestion().getQuestionTrackingNumber().equals(questionTrackingNumber)){
                // if the above if condition is true, that means that we have found an instance of the Question
                // entity being used in an exam. We can now get the manual discrimination and add to the sum, so we
                // can calculate the average later
                if(current.getManualDiscrimination() != -1.0) {
                    discriminationSum = discriminationSum.add(new BigDecimal(current.getManualDiscrimination()));
                    numberOfInstances++;
                }
            }
        }
        double overallDiscrimination = discriminationSum.divide(new BigDecimal(numberOfInstances)).setScale(2, BigDecimal.ROUND_HALF_EVEN).doubleValue();
        List<Question> questionsToUpdate = questionRepository.findAllByQuestionTrackingNumber(questionTrackingNumber);
        if(questionsToUpdate.size() == 0){
            System.out.println("Error finding questions");
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
        for(Question question : questionsToUpdate){
            question.setOverallDiscrimination(overallDiscrimination);
            questionRepository.save(question);
        }
        return ResponseEntity.ok().body("Updated the discriminaiton successfully!");
    }

    public ResponseEntity<?> updateDifficulty(UUID examSectionId, UUID questionId, int questionVersionNumber, double difficulty){
        // need to construct the ExamSectionQuestionKey so that we can find the correct ExamSectionQuestion
        // entity in the database
        ExamSectionQuestionKey examSectionQuestionKey = new ExamSectionQuestionKey();
        examSectionQuestionKey.setExamSectionId(examSectionId);
        QuestionId id = new QuestionId();
        id.setQuestionId(questionId);
        id.setVersionNumber(questionVersionNumber);
        examSectionQuestionKey.setQuestionId(id);

        // query the database
        ExamSectionQuestion examSectionQuestion = examSectionQuestionRepository.findById(examSectionQuestionKey).orElse(null);
        if(examSectionQuestion == null){
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
        examSectionQuestion.setManualDifficulty(difficulty);
        String questionTrackingNumber = examSectionQuestion.getQuestion().getQuestionTrackingNumber();
        examSectionQuestionRepository.save(examSectionQuestion);

        // We also need to set the overall difficulty for the question (average)
        // First, get all the ExamSectionQuestion entities
        List<ExamSectionQuestion> examSectionQuestions = examSectionQuestionRepository.findAll();

        // Now, go through all the ExamSectionQuestions and compare the id of the Question entity in it to the one
        // defined above
        BigDecimal difficultySum = new BigDecimal("0.0");
        int numberOfInstances = 0;
        for(int i = 0; i < examSectionQuestions.size(); i++){
            ExamSectionQuestion current = examSectionQuestions.get(i);
            if(current.getQuestion().getQuestionTrackingNumber().equals(questionTrackingNumber)){
                // if the above if condition is true, that means that we have found an instance of the Question
                // entity being used in an exam. We can now get the manual discrimination and add to the sum, so we
                // can calculate the average later
                if(current.getManualDifficulty() != -1.0) {
                    difficultySum =  difficultySum.add(new BigDecimal(current.getManualDifficulty()));
                    numberOfInstances++;
                }
            }
        }
        double overallDifficulty = difficultySum.divide(new BigDecimal(numberOfInstances)).setScale(2, BigDecimal.ROUND_HALF_EVEN).doubleValue();
        List<Question> questionsToUpdate = questionRepository.findAllByQuestionTrackingNumber(questionTrackingNumber);
        if(questionsToUpdate.size() == 0){
            System.out.println("Error finding questions");
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
        for (Question question : questionsToUpdate){
            question.setOverallDifficulty(overallDifficulty);
            questionRepository.save(question);
        }
        return ResponseEntity.ok().body("Updated the difficulty successfully!");
    }

    public ResponseEntity<?> updateFlags(UUID examSectionId, UUID questionId, int questionVersionNumber, String flags){
        // need to construct the ExamSectionQuestionKey so that we can find the correct ExamSectionQuestion
        // entity in the database
        ExamSectionQuestionKey examSectionQuestionKey = new ExamSectionQuestionKey();
        examSectionQuestionKey.setExamSectionId(examSectionId);
        QuestionId id = new QuestionId();
        id.setQuestionId(questionId);
        id.setVersionNumber(questionVersionNumber);
        examSectionQuestionKey.setQuestionId(id);

        // query the database
        ExamSectionQuestion examSectionQuestion = examSectionQuestionRepository.findById(examSectionQuestionKey).orElse(null);
        if(examSectionQuestion == null){
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
        examSectionQuestion.setFlags(flags);
        examSectionQuestionRepository.save(examSectionQuestion);
        return ResponseEntity.ok().body("Updated the flags successfully!");
    }

}
