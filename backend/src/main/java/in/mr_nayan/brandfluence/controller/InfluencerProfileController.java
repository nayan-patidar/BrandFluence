package in.mr_nayan.brandfluence.controller;

import in.mr_nayan.brandfluence.DTO.InfluencerProfileRequest;
import in.mr_nayan.brandfluence.DTO.InfluencerProfileResponse;
import in.mr_nayan.brandfluence.service.InfluencerProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/influencers")
public class InfluencerProfileController {

    private final InfluencerProfileService influencerProfileService;

    public InfluencerProfileController(InfluencerProfileService influencerProfileService) {
        this.influencerProfileService = influencerProfileService;
    }

    @PostMapping("/profile")
    public ResponseEntity<InfluencerProfileResponse> saveOrUpdateProfile(
            @RequestBody InfluencerProfileRequest request) {
        return ResponseEntity.ok(influencerProfileService.saveOrUpdateProfile(request));
    }

    @GetMapping
    public ResponseEntity<List<InfluencerProfileResponse>> getAllInfluencers() {
        return ResponseEntity.ok(influencerProfileService.getAllInfluencers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InfluencerProfileResponse> getInfluencerById(@PathVariable Long id) {
        return ResponseEntity.ok(influencerProfileService.getInfluencerById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<InfluencerProfileResponse> getMyProfile() {
        return ResponseEntity.ok(influencerProfileService.getMyProfile());
    }

    @GetMapping("/search")
    public ResponseEntity<List<InfluencerProfileResponse>> searchInfluencers(
            @RequestParam(required = false) String niche,
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(influencerProfileService.searchInfluencers(niche, city));
    }
}