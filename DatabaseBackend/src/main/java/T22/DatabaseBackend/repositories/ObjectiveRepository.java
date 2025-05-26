package T22.DatabaseBackend.repositories;

import T22.DatabaseBackend.models.Objective;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ObjectiveRepository extends JpaRepository<Objective, Integer> {
}
