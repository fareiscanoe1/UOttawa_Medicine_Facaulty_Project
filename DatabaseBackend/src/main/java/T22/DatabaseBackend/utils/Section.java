package T22.DatabaseBackend.utils;

import java.util.List;

public class Section {
    private String type;  // MCQ or CDMQ for now

    private List<QuestionInSection> questions;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<QuestionInSection> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionInSection> questions) {
        this.questions = questions;
    }
}
