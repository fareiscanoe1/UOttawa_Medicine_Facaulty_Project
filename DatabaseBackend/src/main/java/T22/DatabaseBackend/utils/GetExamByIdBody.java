package T22.DatabaseBackend.utils;

import T22.DatabaseBackend.models.Exam;
import T22.DatabaseBackend.models.ExamObjectivesMax;
import T22.DatabaseBackend.models.Question;

import java.util.Date;
import java.util.Set;
import java.util.UUID;

public class GetExamByIdBody {
    // things that come from exam
    private UUID examId;
    private String name;
    private Date dateCreated;
    private String notes;
    private Set<ExamObjectivesMax> examObjectivesMaxes;
    private Set<SectionWithQuestions> sections;

    public UUID getExamId() {
        return examId;
    }

    public void setExamId(UUID examId) {
        this.examId = examId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Set<ExamObjectivesMax> getExamObjectivesMaxes() {
        return examObjectivesMaxes;
    }

    public void setExamObjectivesMaxes(Set<ExamObjectivesMax> examObjectivesMaxes) {
        this.examObjectivesMaxes = examObjectivesMaxes;
    }

    public Set<SectionWithQuestions> getSections() {
        return sections;
    }

    public void setSections(Set<SectionWithQuestions> sections) {
        this.sections = sections;
    }
}