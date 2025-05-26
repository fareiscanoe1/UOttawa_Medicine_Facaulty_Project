package T22.DatabaseBackend.repositories;

import T22.DatabaseBackend.models.ExamObjectivesMax;
import T22.DatabaseBackend.models.ExamObjectivesMaxKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamObjectivesMaxRepository extends JpaRepository<ExamObjectivesMax, ExamObjectivesMaxKey> {
}
