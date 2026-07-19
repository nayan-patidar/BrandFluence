package in.mr_nayan.brandfluence.service;

import in.mr_nayan.brandfluence.DTO.CampaignRequest;
import in.mr_nayan.brandfluence.DTO.CampaignResponse;
import in.mr_nayan.brandfluence.entity.Campaign;
import in.mr_nayan.brandfluence.entity.User;
import in.mr_nayan.brandfluence.repository.CampaignRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    // Get the logged-in user from SecurityContext (set by JwtAuthenticationFilter)
    private User getLoggedInUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    private CampaignResponse mapToResponse(Campaign campaign) {

        CampaignResponse response = new CampaignResponse();

        response.setId(campaign.getId());
        response.setTitle(campaign.getTitle());
        response.setDescription(campaign.getDescription());
        response.setBudget(campaign.getBudget());
        response.setPlatform(campaign.getPlatform());
        response.setCategory(campaign.getCategory());
        response.setStartDate(campaign.getStartDate());
        response.setEndDate(campaign.getEndDate());
        response.setStatus(campaign.getStatus());
        response.setCreatedAt(campaign.getCreatedAt());

        if (campaign.getCreatedBy() != null) {
            response.setBrandName(campaign.getCreatedBy().getName());
        }

        return response;
    }

    public CampaignResponse createCampaign(CampaignRequest request) {

        User loggedInUser = getLoggedInUser();

        Campaign campaign = new Campaign();
        campaign.setTitle(request.getTitle());
        campaign.setDescription(request.getDescription());
        campaign.setBudget(request.getBudget());
        campaign.setPlatform(request.getPlatform());
        campaign.setCategory(request.getCategory());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        campaign.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        campaign.setCreatedAt(LocalDateTime.now());
        campaign.setCreatedBy(loggedInUser);

        Campaign saved = campaignRepository.save(campaign);

        return mapToResponse(saved);
    }

    public List<CampaignResponse> getAllCampaigns() {

        return campaignRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CampaignResponse getCampaignById(Long id) {

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        return mapToResponse(campaign);
    }

    public List<CampaignResponse> getMyCampaigns() {

        User loggedInUser = getLoggedInUser();

        return campaignRepository.findByCreatedBy(loggedInUser)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CampaignResponse updateCampaign(Long id, CampaignRequest request) {

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        User loggedInUser = getLoggedInUser();

        if (!campaign.getCreatedBy().getId().equals(loggedInUser.getId())) {
            throw new RuntimeException("You are not allowed to update this campaign");
        }

        campaign.setTitle(request.getTitle());
        campaign.setDescription(request.getDescription());
        campaign.setBudget(request.getBudget());
        campaign.setPlatform(request.getPlatform());
        campaign.setCategory(request.getCategory());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        campaign.setStatus(request.getStatus());

        Campaign updated = campaignRepository.save(campaign);

        return mapToResponse(updated);
    }

    public void deleteCampaign(Long id) {

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        User loggedInUser = getLoggedInUser();

        if (!campaign.getCreatedBy().getId().equals(loggedInUser.getId())) {
            throw new RuntimeException("You are not allowed to delete this campaign");
        }

        campaignRepository.delete(campaign);
    }
}