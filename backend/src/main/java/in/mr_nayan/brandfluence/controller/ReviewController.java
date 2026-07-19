package in.mr_nayan.brandfluence.controller;

import in.mr_nayan.brandfluence.DTO.ReviewRequest;
import in.mr_nayan.brandfluence.DTO.ReviewResponse;
import in.mr_nayan.brandfluence.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    @GetMapping("/influencer/{influencerId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsForInfluencer(@PathVariable Long influencerId) {
        return ResponseEntity.ok(reviewService.getReviewsForInfluencer(influencerId));
    }
}
