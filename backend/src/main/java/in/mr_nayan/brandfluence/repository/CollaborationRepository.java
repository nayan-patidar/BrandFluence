package in.mr_nayan.brandfluence.repository;

import in.mr_nayan.brandfluence.entity.Campaign;
import in.mr_nayan.brandfluence.entity.Collaboration;
import in.mr_nayan.brandfluence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CollaborationRepository extends JpaRepository<Collaboration, Long> {

    List<Collaboration> findByInfluencer(User influencer);

    List<Collaboration> findByCampaign(Campaign campaign);

    List<Collaboration> findByCampaignCreatedBy(User brand);

    Optional<Collaboration> findByCampaignAndInfluencer(Campaign campaign, User influencer);
}
