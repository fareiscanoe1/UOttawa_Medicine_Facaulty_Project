package T22.DatabaseBackend.repositories;

import T22.DatabaseBackend.models.ExamSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExamSectionRepository extends JpaRepository<ExamSection, UUID> {
}
