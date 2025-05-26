package T22.DatabaseBackend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "exam_section")
public class ExamSection {
    @Id
    private UUID id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @OneToMany(mappedBy = "examSection")
    private Set<ExamSectionQuestion> examSectionQuestion;

    @Column(name = "name")
    private String name;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public Set<ExamSectionQuestion> getExamSectionQuestion() {
        return examSectionQuestion;
    }

    public void setExamSectionQuestion(Set<ExamSectionQuestion> examSectionQuestion) {
        this.examSectionQuestion = examSectionQuestion;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "ExamSection{" +
                "id=" + id +
                ", exam=" + exam +
                ", examSectionQuestion=" + examSectionQuestion +
                ", name='" + name + '\'' +
                '}';
    }
}
