package in.mr_nayan.brandfluence.repository;

import in.mr_nayan.brandfluence.entity.Collaboration;
import in.mr_nayan.brandfluence.entity.Review;
import in.mr_nayan.brandfluence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByReviewee(User reviewee);

    List<Review> findByRevieweeId(Long revieweeId);

    Optional<Review> findByCollaboration(Collaboration collaboration);
}
