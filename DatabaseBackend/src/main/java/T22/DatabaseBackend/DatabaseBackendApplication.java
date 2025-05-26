package T22.DatabaseBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class DatabaseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DatabaseBackendApplication.class, args);
	}
}
