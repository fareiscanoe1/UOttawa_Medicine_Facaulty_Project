package T22.DatabaseBackend.models;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class ExamSectionQuestionKey implements Serializable {
    private QuestionId questionId;

    private UUID examSectionId;

    public QuestionId getQuestionId() {
        return questionId;
    }

    public void setQuestionId(QuestionId questionId) {
        this.questionId = questionId;
    }

    public UUID getExamSectionId() {
        return examSectionId;
    }

    public void setExamSectionId(UUID examSectionId) {
        this.examSectionId = examSectionId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExamSectionQuestionKey that = (ExamSectionQuestionKey) o;
        return Objects.equals(questionId, that.questionId) && Objects.equals(examSectionId, that.examSectionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(questionId, examSectionId);
    }

    @Override
    public String toString() {
        return "ExamSectionQuestionKey{" +
                "questionId=" + questionId +
                ", examSectionId=" + examSectionId +
                '}';
    }
}
