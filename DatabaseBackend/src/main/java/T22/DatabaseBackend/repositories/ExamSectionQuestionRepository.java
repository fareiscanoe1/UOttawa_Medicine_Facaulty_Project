package T22.DatabaseBackend.repositories;

import T22.DatabaseBackend.models.ExamSectionQuestion;
import T22.DatabaseBackend.models.ExamSectionQuestionKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamSectionQuestionRepository extends JpaRepository<ExamSectionQuestion, ExamSectionQuestionKey> {
}
