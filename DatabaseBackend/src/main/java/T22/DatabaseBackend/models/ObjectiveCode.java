package T22.DatabaseBackend.models;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "objective_code")
public class ObjectiveCode {
    @Id
    @Column(name = "objective_code_id")
    private String objectiveCodeId;

    @OneToMany(mappedBy = "objectiveCode")
    private Set<ExamObjectivesMax> examObjectivesMaxes;

    @Column(name = "objective_heading")
    private String objectiveHeading;

    public String getObjectiveCodeId() {
        return objectiveCodeId;
    }

    public void setObjectiveCodeId(String objectiveCodeId) {
        this.objectiveCodeId = objectiveCodeId;
    }

    public String getObjectiveHeading() {
        return objectiveHeading;
    }

    public void setObjectiveHeading(String objectiveHeading) {
        this.objectiveHeading = objectiveHeading;
    }

    public Set<ExamObjectivesMax> getExamObjectivesMaxes() {
        return examObjectivesMaxes;
    }

    public void setExamObjectivesMaxes(Set<ExamObjectivesMax> examObjectivesMaxes) {
        this.examObjectivesMaxes = examObjectivesMaxes;
    }

    @Override
    public String toString() {
        return "ObjectiveCode{" +
                "objectiveCodeId='" + objectiveCodeId + '\'' +
                ", examObjectivesMaxes=" + examObjectivesMaxes +
                ", objectiveHeading='" + objectiveHeading + '\'' +
                '}';
    }
}
