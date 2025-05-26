package T22.DatabaseBackend.utils;

import T22.DatabaseBackend.models.Question;

public class QuestionWithSectionData {
    private Question question;
    private int questionNumberOnExam;
    private double manualDiscrimination;
    private double manualDifficulty;
    private String flags;

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public int getQuestionNumberOnExam() {
        return questionNumberOnExam;
    }

    public void setQuestionNumberOnExam(int questionNumberOnExam) {
        this.questionNumberOnExam = questionNumberOnExam;
    }

    public double getManualDiscrimination() {
        return manualDiscrimination;
    }

    public void setManualDiscrimination(double manualDiscrimination) {
        this.manualDiscrimination = manualDiscrimination;
    }

    public double getManualDifficulty() {
        return manualDifficulty;
    }

    public void setManualDifficulty(double manualDifficulty) {
        this.manualDifficulty = manualDifficulty;
    }

    public String getFlags() {
        return flags;
    }

    public void setFlags(String flags) {
        this.flags = flags;
    }
}
