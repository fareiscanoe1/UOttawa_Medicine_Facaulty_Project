package T22.DatabaseBackend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Date;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "exam")
public class Exam {
    @Id
    private UUID id;

    @OneToMany(mappedBy = "exam")
    private Set<ExamObjectivesMax> examObjectivesMaxes;

    @OneToMany(mappedBy = "exam")
    private Set<ExamSection> examSections;

    @Column(name = "name")
    private String name;

    @Column(name = "date_created")
    private Date dateCreated;

    @Column(name = "notes")
    private String notes;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public Set<ExamSection> getExamSections() {
        return examSections;
    }

    public void setExamSections(Set<ExamSection> examSections) {
        this.examSections = examSections;
    }

    @Override
    public String toString() {
        return "Exam{" +
                "id=" + id +
                ", examObjectivesMaxes=" + examObjectivesMaxes +
                ", examSections=" + examSections +
                ", name='" + name + '\'' +
                ", dateCreated=" + dateCreated +
                ", notes='" + notes + '\'' +
                '}';
    }
}
