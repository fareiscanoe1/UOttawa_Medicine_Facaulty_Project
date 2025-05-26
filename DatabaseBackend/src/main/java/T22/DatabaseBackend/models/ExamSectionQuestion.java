package T22.DatabaseBackend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;

@Entity
public class ExamSectionQuestion {

    @EmbeddedId
    private ExamSectionQuestionKey id;

    @JsonIgnore
    @ManyToOne
    @MapsId("examSectionId")
    @JoinColumn(name = "exam_section_id")
    private ExamSection examSection;

    @JsonIgnore
    @ManyToOne
    @MapsId("questionId")
    @JoinColumns({
            @JoinColumn(name = "question_id", referencedColumnName = "question_id"),
            @JoinColumn(name = "version_number", referencedColumnName = "version_number")
    })
    private Question question;

    @Column(name = "question_number_on_exam")
    private int questionNumberOnExam;

    @Column(name = "manual_discrimination")
    private double manualDiscrimination;

    @Column(name = "manual_difficulty")
    private double manualDifficulty;

    @Column(name = "flags")
    private String flags;

    public ExamSectionQuestionKey getId() {
        return id;
    }

    public void setId(ExamSectionQuestionKey id) {
        this.id = id;
    }

    public ExamSection getExamSection() {
        return examSection;
    }

    public void setExamSection(ExamSection examSection) {
        this.examSection = examSection;
    }

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

    @Override
    public String toString() {
        return "ExamSectionQuestion{" +
                "id=" + id +
                ", examSection=" + examSection +
                ", question=" + question +
                ", questionNumberOnExam=" + questionNumberOnExam +
                ", manualDiscrimination=" + manualDiscrimination +
                ", manualDifficulty=" + manualDifficulty +
                ", flags='" + flags + '\'' +
                '}';
    }
}
