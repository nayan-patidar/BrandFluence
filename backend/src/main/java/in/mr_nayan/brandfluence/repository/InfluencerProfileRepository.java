package in.mr_nayan.brandfluence.repository;

import in.mr_nayan.brandfluence.entity.InfluencerProfile;
import in.mr_nayan.brandfluence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InfluencerProfileRepository extends JpaRepository<InfluencerProfile, Long> {

    Optional<InfluencerProfile> findByUser(User user);

    List<InfluencerProfile> findByNiche(String niche);

    List<InfluencerProfile> findByCity(String city);

    List<InfluencerProfile> findByNicheAndCity(String niche, String city);
}