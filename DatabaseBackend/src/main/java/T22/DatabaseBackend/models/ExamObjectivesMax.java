package T22.DatabaseBackend.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class ExamObjectivesMax {

    @EmbeddedId
    private ExamObjectivesMaxKey examObjectivesMaxKey;

    @JsonIgnore
    @ManyToOne
    @MapsId("objectiveCodeId")
    @JoinColumn(name = "objective_code_id")
    private ObjectiveCode objectiveCode;

    @JsonIgnore
    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "id")
    private Exam exam;


    @Column(name = "max_allowed_of_objective")
    private double maxAllowedOfObjective;

    public ExamObjectivesMaxKey getExamObjectivesMaxKey() {
        return examObjectivesMaxKey;
    }

    public void setExamObjectivesMaxKey(ExamObjectivesMaxKey examObjectivesMaxKey) {
        this.examObjectivesMaxKey = examObjectivesMaxKey;
    }

    public ObjectiveCode getObjectiveCode() {
        return objectiveCode;
    }

    public void setObjectiveCode(ObjectiveCode objectiveCode) {
        this.objectiveCode = objectiveCode;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public double getMaxAllowedOfObjective() {
        return maxAllowedOfObjective;
    }

    public void setMaxAllowedOfObjective(double maxAllowedOfObjective) {
        this.maxAllowedOfObjective = maxAllowedOfObjective;
    }

    @Override
    public String toString() {
        return "ExamObjectivesMax{" +
                "examObjectivesMaxKey=" + examObjectivesMaxKey +
                ", objectiveCode=" + objectiveCode +
                ", exam=" + exam +
                ", maxAllowedOfObjective=" + maxAllowedOfObjective +
                '}';
    }
}
