package T22.DatabaseBackend.models;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;


@Embeddable
public class QuestionId implements Serializable {

    @Column(name = "question_id")
    private UUID questionId;

    @Column(name = "version_number")
    private int versionNumber;

    public UUID getQuestionId() {
        return questionId;
    }

    public void setQuestionId(UUID questionId) {
        this.questionId = questionId;
    }

    public int getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(int versionNumber) {
        this.versionNumber = versionNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuestionId that = (QuestionId) o;
        return versionNumber == that.versionNumber && Objects.equals(questionId, that.questionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(questionId, versionNumber);
    }

    @Override
    public String toString() {
        return "QuestionId{" +
                "questionId=" + questionId +
                ", versionNumber=" + versionNumber +
                '}';
    }
}
