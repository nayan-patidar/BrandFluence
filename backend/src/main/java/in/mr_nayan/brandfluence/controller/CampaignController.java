package in.mr_nayan.brandfluence.controller;

import in.mr_nayan.brandfluence.DTO.CampaignRequest;
import in.mr_nayan.brandfluence.DTO.CampaignResponse;
import in.mr_nayan.brandfluence.service.CampaignService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @PostMapping
    public ResponseEntity<CampaignResponse> createCampaign(
            @RequestBody CampaignRequest request) {

        return ResponseEntity.ok(
                campaignService.createCampaign(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<CampaignResponse>> getAllCampaigns() {

        return ResponseEntity.ok(
                campaignService.getAllCampaigns()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse> getCampaignById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                campaignService.getCampaignById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignResponse> updateCampaign(
            @PathVariable Long id,
            @RequestBody CampaignRequest request) {

        return ResponseEntity.ok(
                campaignService.updateCampaign(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCampaign(
            @PathVariable Long id) {

        campaignService.deleteCampaign(id);

        return ResponseEntity.ok("Campaign Deleted Successfully");
    }

    @GetMapping("/my")
    public ResponseEntity<List<CampaignResponse>> myCampaigns() {

        return ResponseEntity.ok(
                campaignService.getMyCampaigns()
        );
    }

}