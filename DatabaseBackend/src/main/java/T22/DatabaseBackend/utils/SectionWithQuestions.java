package T22.DatabaseBackend.utils;

import T22.DatabaseBackend.models.Question;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public class SectionWithQuestions {
    private UUID sectionId;
    private String type;
    private List<QuestionWithSectionData> questions;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<QuestionWithSectionData> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionWithSectionData> questions) {
        this.questions = questions;
    }

    public UUID getSectionId() {
        return sectionId;
    }

    public void setSectionId(UUID sectionId) {
        this.sectionId = sectionId;
    }
}
