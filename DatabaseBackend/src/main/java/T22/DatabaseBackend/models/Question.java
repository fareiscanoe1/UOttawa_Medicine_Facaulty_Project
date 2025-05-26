package T22.DatabaseBackend.models;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
public class Question {

    @EmbeddedId
    private QuestionId id;

    @OneToMany(targetEntity = Option.class, cascade = {CascadeType.ALL})
    private List optionList;

    @ManyToOne
    private Objective objective;

    @OneToMany(mappedBy = "question")
    private Set<ExamSectionQuestion> examSectionQuestion;

    @Column(name = "question_tracking_number")
    private String questionTrackingNumber;

    @Column(name = "type")
    private String type;

    @Column(name = "question_english", columnDefinition = "text")
    private String questionEnglish;

    @Column(name = "question_french", columnDefinition = "text")
    private String questionFrench;

    @Column(name = "overall_difficulty")
    private double overallDifficulty;

    @Column(name = "overall_discrimination")
    private double overallDiscrimination;

    @Column(name = "author_of_change")
    private String authorOfChange;

    @Column(name = "date_of_change")
    private Date dateOfChange;

    @Column(name = "modifications")
    private String modifications;

    @Column(name = "reference_article_or_book", columnDefinition = "text")
    private String referenceArticleOrBook;

    public QuestionId getId() {
        return id;
    }

    public void setId(QuestionId id) {
        this.id = id;
    }

    public List getOptionList() {
        return optionList;
    }

    public void setOptionList(List optionList) {
        this.optionList = optionList;
    }

    public Set<ExamSectionQuestion> getExamSectionQuestion() {
        return examSectionQuestion;
    }

    public void setExamSectionQuestion(Set<ExamSectionQuestion> examSectionQuestion) {
        this.examSectionQuestion = examSectionQuestion;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getQuestionEnglish() {
        return questionEnglish;
    }

    public void setQuestionEnglish(String questionEnglish) {
        this.questionEnglish = questionEnglish;
    }

    public String getQuestionFrench() {
        return questionFrench;
    }

    public void setQuestionFrench(String questionFrench) {
        this.questionFrench = questionFrench;
    }

    public double getOverallDifficulty() {
        return overallDifficulty;
    }

    public void setOverallDifficulty(double overallDifficulty) {
        this.overallDifficulty = overallDifficulty;
    }

    public double getOverallDiscrimination() {
        return overallDiscrimination;
    }

    public void setOverallDiscrimination(double overallDiscrimination) {
        this.overallDiscrimination = overallDiscrimination;
    }

    public String getAuthorOfChange() {
        return authorOfChange;
    }

    public void setAuthorOfChange(String authorOfChange) {
        this.authorOfChange = authorOfChange;
    }

    public Date getDateOfChange() {
        return dateOfChange;
    }

    public void setDateOfChange(Date dateOfChange) {
        this.dateOfChange = dateOfChange;
    }

    public String getModifications() {
        return modifications;
    }

    public void setModifications(String modifications) {
        this.modifications = modifications;
    }

    public String getReferenceArticleOrBook() {
        return referenceArticleOrBook;
    }

    public void setReferenceArticleOrBook(String referenceArticleOrBook) {
        this.referenceArticleOrBook = referenceArticleOrBook;
    }

    public Objective getObjective() {
        return objective;
    }

    public void setObjective(Objective objective) {
        this.objective = objective;
    }

    public String getQuestionTrackingNumber() {
        return questionTrackingNumber;
    }

    public void setQuestionTrackingNumber(String questionTrackingNumber) {
        this.questionTrackingNumber = questionTrackingNumber;
    }

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", optionList=" + optionList +
                ", objective=" + objective +
                ", examSectionQuestion=" + examSectionQuestion +
                ", questionTrackingNumber='" + questionTrackingNumber + '\'' +
                ", type='" + type + '\'' +
                ", questionEnglish='" + questionEnglish + '\'' +
                ", questionFrench='" + questionFrench + '\'' +
                ", overallDifficulty=" + overallDifficulty +
                ", overallDiscrimination=" + overallDiscrimination +
                ", authorOfChange='" + authorOfChange + '\'' +
                ", dateOfChange=" + dateOfChange +
                ", modifications='" + modifications + '\'' +
                ", referenceArticleOrBook='" + referenceArticleOrBook + '\'' +
                '}';
    }
}
