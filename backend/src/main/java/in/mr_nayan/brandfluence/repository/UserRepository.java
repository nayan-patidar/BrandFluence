package in.mr_nayan.brandfluence.repository;
import in.mr_nayan.brandfluence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Long> {


 boolean existsByEmail(String email);
 Optional<User> findByEmail(String email);

}
