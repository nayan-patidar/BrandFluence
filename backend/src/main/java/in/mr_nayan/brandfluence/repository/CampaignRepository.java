package in.mr_nayan.brandfluence.repository;

import in.mr_nayan.brandfluence.entity.Campaign;
import in.mr_nayan.brandfluence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignRepository
        extends JpaRepository<Campaign, Long> {

    List<Campaign> findByCreatedBy(User user);

}