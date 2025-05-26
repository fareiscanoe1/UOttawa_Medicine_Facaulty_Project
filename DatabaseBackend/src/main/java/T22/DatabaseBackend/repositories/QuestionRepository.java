package T22.DatabaseBackend.repositories;

import T22.DatabaseBackend.models.Question;
import T22.DatabaseBackend.models.QuestionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, QuestionId> {
    Question findByQuestionTrackingNumber(String trackingNumber);

    List<Question> findAllByQuestionTrackingNumber(String trackingNumber);
}
