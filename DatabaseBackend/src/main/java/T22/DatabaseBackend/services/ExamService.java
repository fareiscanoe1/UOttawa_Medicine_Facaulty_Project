package T22.DatabaseBackend.services;

import T22.DatabaseBackend.models.*;
import T22.DatabaseBackend.repositories.*;
import T22.DatabaseBackend.utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamSectionRepository examSectionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ObjectiveCodeRepository objectiveCodeRepository;

    @Autowired
    private ExamSectionQuestionRepository examSectionQuestionRepository;

    @Autowired
    private ExamObjectivesMaxRepository examObjectivesMaxRepository;

    public ResponseEntity<List<Exam>> getAllExams(){
        List<Exam> allExams = examRepository.findAll();
        return ResponseEntity.ok().body(allExams);
    }

    public ResponseEntity<?> pushExam(NewExamRequest examData) {
        // First, create a new Exam entity
        Exam exam = new Exam();
        exam.setName(examData.getName());
        exam.setDateCreated(new Date());
        exam.setId(UUID.randomUUID());
        exam.setNotes(examData.getNotes());
        examRepository.save(exam);

        // Create the Document object that will be used to create a word document.
        Document document = new Document();
        // set the exam instance variable
        document.setExam(exam);

        // create new exam sections
        for(Section section : examData.getSections()) {
            ExamSection examSection = new ExamSection();
            examSection.setName(section.getType()); // should be MCQ or CDMQ
            examSection.setId(UUID.randomUUID());
            examSection.setExam(exam);
            examSectionRepository.save(examSection);

            // now for all the questions in this section, we must make new ExamSectionQuestion entities
            List<QuestionInSection> allQuestionsInSection = section.getQuestions();
            if (allQuestionsInSection != null) {
                for (int i = 0; i < allQuestionsInSection.size(); i++) {
                    // get current question at hand
                    QuestionInSection currentQuestion = allQuestionsInSection.get(i);

                    // in each iteration, create a new ExamSectionQuestion entity
                    ExamSectionQuestion examSectionQuestion = new ExamSectionQuestion();
                    examSectionQuestion.setQuestionNumberOnExam(i + 1);
                    examSectionQuestion.setManualDifficulty(-1.0);
                    examSectionQuestion.setManualDiscrimination(-1.0);
                    examSectionQuestion.setFlags("");

                    // make the link of ExamSectionQuestion to ExamSection
                    examSectionQuestion.setExamSection(examSection);

                    // make the link from ExamSectionQuestion to question
                    // first, we must get the question using the given tracking number
                    List<Question> result = questionRepository.findAllByQuestionTrackingNumber(currentQuestion.getQuestionTrackingNumber());
                    Question question = null;
                    for (int j = 0; j < result.size(); j++) {
                        if (result.get(j).getId().getVersionNumber() == currentQuestion.getQuestionVersionNumber()) {
                            question = result.get(j);
                            break;
                        }
                    }
                    examSectionQuestion.setQuestion(question);

                    // if we are in the mcq section, append the found question to the mcqQuestions list of
                    // the Document object.
                    // if we are in the cdmq section, append the found question to the mcqQuestions list of
                    // the Document object.
                    if (section.getType().strip().toLowerCase().equals("mcq")) {
                        document.addMcqQuestion(question);
                    } else if (section.getType().strip().toLowerCase().equals("cdmq")) {
                        document.addCdmqQuestion(question);
                    }

                    // now we need to set the examSectionQuestion Id, which is a composite key
                    ExamSectionQuestionKey key = new ExamSectionQuestionKey();
                    key.setQuestionId(question.getId());
                    key.setExamSectionId(examSection.getId());
                    examSectionQuestion.setId(key);

                    // finally, save the examSectionQuestion
                    examSectionQuestionRepository.save(examSectionQuestion);
                }
            }
        }

        // link this exam to the given objective codes
        for (ExamObjectives eo : examData.getExamObjectives()){
            // first make the key
            ExamObjectivesMaxKey examObjectivesMaxKey = new ExamObjectivesMaxKey();
            examObjectivesMaxKey.setId(exam.getId());
            examObjectivesMaxKey.setObjectiveCodeId(eo.getObjectiveCode());

            // create new ExamObjectivesMax entity and set they key
            ExamObjectivesMax examObjectivesMax = new ExamObjectivesMax();
            examObjectivesMax.setExamObjectivesMaxKey(examObjectivesMaxKey);
            examObjectivesMax.setMaxAllowedOfObjective(eo.getNumberOfQuestionsOnExam());

            // link to this exam
            examObjectivesMax.setExam(exam);

            // link to ObjectiveCode entity
            ObjectiveCode objectiveCode = objectiveCodeRepository.findById(eo.getObjectiveCode()).orElse(null);
            examObjectivesMax.setObjectiveCode(objectiveCode);

            // save
            examObjectivesMaxRepository.save(examObjectivesMax);
        }
        // last step, call the method from the document object to create and save the word document
        document.createExam();
        byte[] zipData = document.getByteArray();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Disposition", "attachment; filename=files.zip");
        httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        httpHeaders.setContentLength(zipData.length);

        return new ResponseEntity<>(zipData, httpHeaders, HttpStatus.OK);
    }

    public ResponseEntity<?> getExamObjectiveCodes(UUID examId){
        Exam exam = examRepository.findById(examId).orElse(null);
        if(exam == null){
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
        Set<ExamObjectivesMax> returnBody = exam.getExamObjectivesMaxes();
        return ResponseEntity.ok().body(returnBody);
    }

    public ResponseEntity<?> getExamById(UUID examId){
        Exam exam = examRepository.findById(examId).orElse(null);
        if(exam == null){
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
        GetExamByIdBody getExamByIdBody = new GetExamByIdBody();
        getExamByIdBody.setExamId(exam.getId());
        getExamByIdBody.setExamObjectivesMaxes(exam.getExamObjectivesMaxes());
        getExamByIdBody.setDateCreated(exam.getDateCreated());
        getExamByIdBody.setName(exam.getName());
        getExamByIdBody.setNotes(exam.getNotes());

        // get all the question of this exam and set the data for the return object
        Set<SectionWithQuestions> allSectionsSet = new HashSet<>();
        Iterator<ExamSection> it = exam.getExamSections().iterator();
        while(it.hasNext()){
            ExamSection currentSection = it.next();
            SectionWithQuestions sectionWithQuestions = new SectionWithQuestions();
            sectionWithQuestions.setType(currentSection.getName());
            sectionWithQuestions.setSectionId(currentSection.getId());
            // loop through all the questions in the examSection
            List<QuestionWithSectionData> sectionSet = new ArrayList<>();
            Iterator<ExamSectionQuestion> jt = currentSection.getExamSectionQuestion().iterator();
            while(jt.hasNext()) {
                ExamSectionQuestion currentExamSectionQuestion = jt.next();
                // get current question from db
                QuestionId id = new QuestionId();
                id.setQuestionId(currentExamSectionQuestion.getId().getQuestionId().getQuestionId());
                id.setVersionNumber(currentExamSectionQuestion.getId().getQuestionId().getVersionNumber());
                Question question = questionRepository.findById(id).orElse(null);
                if (question == null) {
                    return ResponseEntity.internalServerError().body("Internal Server Error - cannot find question by id.");
                }
                // now I want to add the question to a list of question that I want to add to a return object
                QuestionWithSectionData questionWithSectionData = new QuestionWithSectionData();
                questionWithSectionData.setQuestion(question);
                questionWithSectionData.setQuestionNumberOnExam(currentExamSectionQuestion.getQuestionNumberOnExam());
                questionWithSectionData.setFlags(currentExamSectionQuestion.getFlags());
                questionWithSectionData.setManualDifficulty(currentExamSectionQuestion.getManualDifficulty());
                questionWithSectionData.setManualDiscrimination(currentExamSectionQuestion.getManualDiscrimination());
                sectionSet.add(questionWithSectionData);
            }
            Comparator<QuestionWithSectionData> comparator = new Comparator<QuestionWithSectionData>() {
                @Override
                public int compare(QuestionWithSectionData o1, QuestionWithSectionData o2) {
                    return Integer.compare(o1.getQuestionNumberOnExam(), o2.getQuestionNumberOnExam());
                }
            };
            Collections.sort(sectionSet, comparator);
            sectionWithQuestions.setQuestions(sectionSet);
            allSectionsSet.add(sectionWithQuestions);
        }
        getExamByIdBody.setSections(allSectionsSet);
        return ResponseEntity.ok().body(getExamByIdBody);
    }

    public ResponseEntity<Boolean> deleteExam(UUID examId){
        Exam exam = examRepository.findById(examId).orElse(null);

        if (exam == null){
            // if the given examId is not found in the database, return error code 404 and a boolean value of false
            return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
        }

        // If you see the database entity diagram, we can see that there are 4 entities directly related to
        // the Exam entity. This means that we need to delete all the entities that are related to this exam
        // before we can actually delete the exam

        // We start by deleting all the ExamObjectivesMax entities related to this exam
        Iterator<ExamObjectivesMax> examObjectivesMaxIterator = exam.getExamObjectivesMaxes().iterator();
        while(examObjectivesMaxIterator.hasNext()){
            ExamObjectivesMax examObjectivesMax = examObjectivesMaxIterator.next();
            examObjectivesMaxRepository.delete(examObjectivesMax);
        }

        // We then delete all the ExamSection entities related to the given Exam
        Iterator<ExamSection> examSectionIterator = exam.getExamSections().iterator();
        while(examSectionIterator.hasNext()){

            ExamSection examSection = examSectionIterator.next();

            // Before deleting the ExamSection, we need to delete the ExamSectionQuestion entities related to
            // this ExamSection
            Iterator<ExamSectionQuestion> examSectionQuestionIterator = examSection.getExamSectionQuestion().iterator();
            while(examSectionQuestionIterator.hasNext()){
                ExamSectionQuestion examSectionQuestion = examSectionQuestionIterator.next();
                // delete the examSectionQuestion
                examSectionQuestionRepository.deleteById(examSectionQuestion.getId());
            }

            // Now that we deleted all the ExamSectionQuestion entities related to the ExamSection, we
            // can safely delete the ExamSection
            examSectionRepository.deleteById(examSection.getId());
        }

        // Now that we have deleted the ExamSection and ExamSectionQuestion entities related to this exam
        // we can safely delete the Exam entity
        examRepository.deleteById(examId);

        // Return true to tell the caller that we have successfully deleted the Exam with the given examId
        return ResponseEntity.ok().body(true);
    }
}
