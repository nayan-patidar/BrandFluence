package in.mr_nayan.brandfluence.service;

import in.mr_nayan.brandfluence.DTO.CollaborationRequest;
import in.mr_nayan.brandfluence.DTO.CollaborationResponse;
import in.mr_nayan.brandfluence.entity.Campaign;
import in.mr_nayan.brandfluence.entity.Collaboration;
import in.mr_nayan.brandfluence.entity.CollaborationStatus;
import in.mr_nayan.brandfluence.entity.User;
import in.mr_nayan.brandfluence.repository.CampaignRepository;
import in.mr_nayan.brandfluence.repository.CollaborationRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CollaborationService {

    private final CollaborationRepository collaborationRepository;
    private final CampaignRepository campaignRepository;
    private final NotificationService notificationService;

    public CollaborationService(CollaborationRepository collaborationRepository,
                                CampaignRepository campaignRepository,
                                NotificationService notificationService) {
        this.collaborationRepository = collaborationRepository;
        this.campaignRepository = campaignRepository;
        this.notificationService = notificationService;
    }

    private User getLoggedInUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    private CollaborationResponse mapToResponse(Collaboration collaboration) {

        CollaborationResponse response = new CollaborationResponse();

        response.setId(collaboration.getId());
        response.setStatus(collaboration.getStatus().name());
        response.setMessage(collaboration.getMessage());
        response.setCreatedAt(collaboration.getCreatedAt());

        if (collaboration.getCampaign() != null) {
            response.setCampaignId(collaboration.getCampaign().getId());
            response.setCampaignTitle(collaboration.getCampaign().getTitle());

            if (collaboration.getCampaign().getCreatedBy() != null) {
                response.setBrandName(collaboration.getCampaign().getCreatedBy().getName());
            }
        }

        if (collaboration.getInfluencer() != null) {
            response.setInfluencerId(collaboration.getInfluencer().getId());
            response.setInfluencerName(collaboration.getInfluencer().getName());
        }

        return response;
    }

    // Influencer applies to a campaign
    public CollaborationResponse applyToCampaign(Long campaignId, CollaborationRequest request) {

        User loggedInUser = getLoggedInUser();

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        collaborationRepository.findByCampaignAndInfluencer(campaign, loggedInUser)
                .ifPresent(c -> {
                    throw new RuntimeException("You have already applied to this campaign");
                });

        Collaboration collaboration = new Collaboration();
        collaboration.setCampaign(campaign);
        collaboration.setInfluencer(loggedInUser);
        collaboration.setStatus(CollaborationStatus.PENDING);
        collaboration.setMessage(request.getMessage());
        collaboration.setCreatedAt(LocalDateTime.now());

        Collaboration saved = collaborationRepository.save(collaboration);

        if (campaign.getCreatedBy() != null) {
            notificationService.createNotification(
                    campaign.getCreatedBy(),
                    loggedInUser.getName() + " applied to your campaign \"" + campaign.getTitle() + "\"",
                    "COLLABORATION_REQUEST"
            );
        }

        return mapToResponse(saved);
    }

    // Influencer's own applications
    public List<CollaborationResponse> getMyApplications() {

        User loggedInUser = getLoggedInUser();

        return collaborationRepository.findByInfluencer(loggedInUser)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Brand's received requests (across all their campaigns)
    public List<CollaborationResponse> getReceivedRequests() {

        User loggedInUser = getLoggedInUser();

        return collaborationRepository.findByCampaignCreatedBy(loggedInUser)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CollaborationResponse acceptCollaboration(Long id) {
        return updateStatus(id, CollaborationStatus.ACCEPTED);
    }

    public CollaborationResponse rejectCollaboration(Long id) {
        return updateStatus(id, CollaborationStatus.REJECTED);
    }

    private CollaborationResponse updateStatus(Long id, CollaborationStatus status) {

        Collaboration collaboration = collaborationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collaboration not found"));

        User loggedInUser = getLoggedInUser();

        User brand = collaboration.getCampaign().getCreatedBy();

        if (brand == null || !brand.getId().equals(loggedInUser.getId())) {
            throw new RuntimeException("You are not allowed to update this collaboration");
        }

        collaboration.setStatus(status);

        Collaboration updated = collaborationRepository.save(collaboration);

        notificationService.createNotification(
                collaboration.getInfluencer(),
                "Your application for \"" + collaboration.getCampaign().getTitle()
                        + "\" was " + status.name().toLowerCase(),
                "COLLABORATION_STATUS"
        );

        return mapToResponse(updated);
    }
}
