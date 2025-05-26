package T22.DatabaseBackend.utils;

import T22.DatabaseBackend.models.Option;
import org.hibernate.sql.Update;

import java.util.List;

public class UpdateQuestionRequest {

    private List<Option> options;
    private String questionTrackingNumber;
    private String questionEnglish;
    private String questionFrench;
    private String referenceArticleOrBook;
    private String modifications;
    private String authorOfChange;

    public UpdateQuestionRequest(){

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

    public String getReferenceArticleOrBook() {
        return referenceArticleOrBook;
    }

    public void setReferenceArticleOrBook(String referenceArticleOrBook) {
        this.referenceArticleOrBook = referenceArticleOrBook;
    }

    public String getModifications() {
        return modifications;
    }

    public void setModifications(String modifications) {
        this.modifications = modifications;
    }

    public String getAuthorOfChange() {
        return authorOfChange;
    }

    public void setAuthorOfChange(String authorOfChange) {
        this.authorOfChange = authorOfChange;
    }
}
