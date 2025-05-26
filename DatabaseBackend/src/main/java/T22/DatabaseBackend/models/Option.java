package T22.DatabaseBackend.models;

import jakarta.persistence.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "option")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "option_english")
    private String optionEnglish;

    @Column(name = "option_french")
    private String optionFrench;

    @Column(name = "is_correct")
    private boolean isCorrect;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getOptionEnglish() {
        return optionEnglish;
    }

    public void setOptionEnglish(String optionEnglish) {
        this.optionEnglish = optionEnglish;
    }

    public String getOptionFrench() {
        return optionFrench;
    }

    public void setOptionFrench(String optionFrench) {
        this.optionFrench = optionFrench;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    @Override
    public String toString() {
        return "Option{" +
                "id=" + id +
                ", optionEnglish='" + optionEnglish + '\'' +
                ", optionFrench='" + optionFrench + '\'' +
                ", isCorrect=" + isCorrect +
                '}';
    }
}
