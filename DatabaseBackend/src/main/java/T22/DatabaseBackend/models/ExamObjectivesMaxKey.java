package T22.DatabaseBackend.models;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class ExamObjectivesMaxKey implements Serializable {
    private String objectiveCodeId;

    private UUID id; // the of the Exam entity

    public String getObjectiveCodeId() {
        return objectiveCodeId;
    }

    public void setObjectiveCodeId(String objectiveCodeId) {
        this.objectiveCodeId = objectiveCodeId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExamObjectivesMaxKey that = (ExamObjectivesMaxKey) o;
        return Objects.equals(objectiveCodeId, that.objectiveCodeId) && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(objectiveCodeId, id);
    }

    @Override
    public String toString() {
        return "ExamObjectivesMaxKey{" +
                "objectiveCodeId='" + objectiveCodeId + '\'' +
                ", id=" + id +
                '}';
    }
}
