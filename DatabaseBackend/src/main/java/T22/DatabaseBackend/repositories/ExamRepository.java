package T22.DatabaseBackend.repositories;

import T22.DatabaseBackend.models.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExamRepository extends JpaRepository<Exam, UUID> {

}
