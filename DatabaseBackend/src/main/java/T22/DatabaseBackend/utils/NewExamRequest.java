package T22.DatabaseBackend.utils;

import java.util.List;

public class NewExamRequest {
    private String name;

    private List<ExamObjectives> examObjectives;

    private List<Section> sections;

    private String notes;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ExamObjectives> getExamObjectives() {
        return examObjectives;
    }

    public void setExamObjectives(List<ExamObjectives> examObjectives) {
        this.examObjectives = examObjectives;
    }

    public List<Section> getSections() {
        return sections;
    }

    public void setSections(List<Section> sections) {
        this.sections = sections;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
