package T22.DatabaseBackend.utils;

import T22.DatabaseBackend.models.Objective;
import T22.DatabaseBackend.models.Option;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;

public class NewQuestionRequest {
    private List<Option> options;  // the options for the question
    private String questionTrackingNumber;
    private String type;
    private String questionEnglish;
    private String questionFrench;
    private double overallDifficulty;
    private double overallDiscrimination;
    private String authorOfChange;
    private Date dateOfChange;
    private String modifications;
    private String referenceArticleOrBook;
    private int objectiveNumber;

    public NewQuestionRequest(){

    }

    public List<Option> getOptions() {
        return options;
    }

    public void setOptions(List<Option> options) {
        this.options = options;
    }

    public String getQuestionTrackingNumber() {
        return questionTrackingNumber;
    }

    public void setQuestionTrackingNumber(String questionTrackingNumber) {
        this.questionTrackingNumber = questionTrackingNumber;
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

    public int getObjectiveNumber() {
        return objectiveNumber;
    }

    public void setObjectiveNumber(int objectiveNumber) {
        this.objectiveNumber = objectiveNumber;
    }
}
