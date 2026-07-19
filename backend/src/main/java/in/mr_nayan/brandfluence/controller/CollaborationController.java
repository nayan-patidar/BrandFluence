package in.mr_nayan.brandfluence.controller;

import in.mr_nayan.brandfluence.DTO.CollaborationRequest;
import in.mr_nayan.brandfluence.DTO.CollaborationResponse;
import in.mr_nayan.brandfluence.service.CollaborationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaborations")
public class CollaborationController {

    private final CollaborationService collaborationService;

    public CollaborationController(CollaborationService collaborationService) {
        this.collaborationService = collaborationService;
    }

    @PostMapping("/apply/{campaignId}")
    public ResponseEntity<CollaborationResponse> applyToCampaign(
            @PathVariable Long campaignId,
            @RequestBody CollaborationRequest request) {
        return ResponseEntity.ok(collaborationService.applyToCampaign(campaignId, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<CollaborationResponse>> getMyApplications() {
        return ResponseEntity.ok(collaborationService.getMyApplications());
    }

    @GetMapping("/received")
    public ResponseEntity<List<CollaborationResponse>> getReceivedRequests() {
        return ResponseEntity.ok(collaborationService.getReceivedRequests());
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<CollaborationResponse> acceptCollaboration(@PathVariable Long id) {
        return ResponseEntity.ok(collaborationService.acceptCollaboration(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<CollaborationResponse> rejectCollaboration(@PathVariable Long id) {
        return ResponseEntity.ok(collaborationService.rejectCollaboration(id));
    }
}
