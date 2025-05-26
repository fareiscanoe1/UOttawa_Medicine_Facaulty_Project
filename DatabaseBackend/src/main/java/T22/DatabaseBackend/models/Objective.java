package T22.DatabaseBackend.models;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "objective")
public class Objective {

    @Id
    @Column(name = "objective_number")
    private int objectiveNumber;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "faculty_role")
    private String facultyRole;

    @Column(name = "fields")
    private String fields;

    @Column(name = "objective_type")
    private String objectiveType;

    @ManyToOne
    private ObjectiveCode objectiveCode;

    public int getObjectiveNumber() {
        return objectiveNumber;
    }

    public void setObjectiveNumber(int objectiveNumber) {
        this.objectiveNumber = objectiveNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFacultyRole() {
        return facultyRole;
    }

    public void setFacultyRole(String facultyRole) {
        this.facultyRole = facultyRole;
    }

    public String getFields() {
        return fields;
    }

    public void setFields(String fields) {
        this.fields = fields;
    }

    public String getObjectiveType() {
        return objectiveType;
    }

    public void setObjectiveType(String objectiveType) {
        this.objectiveType = objectiveType;
    }

    public ObjectiveCode getObjectiveCode() {
        return objectiveCode;
    }

    public void setObjectiveCode(ObjectiveCode objectiveCode) {
        this.objectiveCode = objectiveCode;
    }


    @Override
    public String toString() {
        return "Objective{" +
                "objectiveNumber=" + objectiveNumber +
                ", description='" + description + '\'' +
                ", facultyRole='" + facultyRole + '\'' +
                ", fields='" + fields + '\'' +
                ", objectiveType='" + objectiveType + '\'' +
                ", objectiveCode=" + objectiveCode +
                '}';
    }
}
