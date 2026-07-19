package in.mr_nayan.brandfluence.service;

import in.mr_nayan.brandfluence.DTO.ReviewRequest;
import in.mr_nayan.brandfluence.DTO.ReviewResponse;
import in.mr_nayan.brandfluence.entity.Collaboration;
import in.mr_nayan.brandfluence.entity.CollaborationStatus;
import in.mr_nayan.brandfluence.entity.Review;
import in.mr_nayan.brandfluence.entity.User;
import in.mr_nayan.brandfluence.repository.CollaborationRepository;
import in.mr_nayan.brandfluence.repository.ReviewRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CollaborationRepository collaborationRepository;
    private final NotificationService notificationService;

    public ReviewService(ReviewRepository reviewRepository,
                         CollaborationRepository collaborationRepository,
                         NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.collaborationRepository = collaborationRepository;
        this.notificationService = notificationService;
    }

    private User getLoggedInUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    private ReviewResponse mapToResponse(Review review) {

        ReviewResponse response = new ReviewResponse();

        response.setId(review.getId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());

        if (review.getCollaboration() != null) {
            response.setCollaborationId(review.getCollaboration().getId());
        }

        if (review.getReviewer() != null) {
            response.setReviewerName(review.getReviewer().getName());
        }

        if (review.getReviewee() != null) {
            response.setRevieweeName(review.getReviewee().getName());
        }

        return response;
    }

    // Brand reviews the influencer after an accepted collaboration
    public ReviewResponse createReview(ReviewRequest request) {

        User loggedInUser = getLoggedInUser();

        Collaboration collaboration = collaborationRepository.findById(request.getCollaborationId())
                .orElseThrow(() -> new RuntimeException("Collaboration not found"));

        User brand = collaboration.getCampaign().getCreatedBy();

        if (brand == null || !brand.getId().equals(loggedInUser.getId())) {
            throw new RuntimeException("You are not allowed to review this collaboration");
        }

        if (collaboration.getStatus() != CollaborationStatus.ACCEPTED) {
            throw new RuntimeException("You can only review accepted collaborations");
        }

        reviewRepository.findByCollaboration(collaboration)
                .ifPresent(r -> {
                    throw new RuntimeException("This collaboration has already been reviewed");
                });

        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = new Review();
        review.setCollaboration(collaboration);
        review.setReviewer(loggedInUser);
        review.setReviewee(collaboration.getInfluencer());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);

        notificationService.createNotification(
                collaboration.getInfluencer(),
                loggedInUser.getName() + " left you a review for \"" + collaboration.getCampaign().getTitle() + "\"",
                "REVIEW"
        );

        return mapToResponse(saved);
    }

    public List<ReviewResponse> getReviewsForInfluencer(Long influencerId) {

        return reviewRepository.findByRevieweeId(influencerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}
