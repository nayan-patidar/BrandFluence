package in.mr_nayan.brandfluence.service;

import in.mr_nayan.brandfluence.DTO.InfluencerProfileRequest;
import in.mr_nayan.brandfluence.DTO.InfluencerProfileResponse;
import in.mr_nayan.brandfluence.entity.InfluencerProfile;
import in.mr_nayan.brandfluence.entity.User;
import in.mr_nayan.brandfluence.repository.InfluencerProfileRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InfluencerProfileService {

    private final InfluencerProfileRepository influencerProfileRepository;

    public InfluencerProfileService(InfluencerProfileRepository influencerProfileRepository) {
        this.influencerProfileRepository = influencerProfileRepository;
    }

    private User getLoggedInUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    private InfluencerProfileResponse mapToResponse(InfluencerProfile profile) {

        InfluencerProfileResponse response = new InfluencerProfileResponse();

        response.setId(profile.getId());
        response.setBio(profile.getBio());
        response.setInstagramHandle(profile.getInstagramHandle());
        response.setYoutubeHandle(profile.getYoutubeHandle());
        response.setFollowers(profile.getFollowers());
        response.setEngagementRate(profile.getEngagementRate());
        response.setNiche(profile.getNiche());
        response.setCity(profile.getCity());
        response.setProfileImage(profile.getProfileImage());

        if (profile.getUser() != null) {
            response.setUserId(profile.getUser().getId());
            response.setName(profile.getUser().getName());
            response.setEmail(profile.getUser().getEmail());
        }

        return response;
    }

    // Create or update the logged-in influencer's own profile
    public InfluencerProfileResponse saveOrUpdateProfile(InfluencerProfileRequest request) {

        User loggedInUser = getLoggedInUser();

        InfluencerProfile profile = influencerProfileRepository.findByUser(loggedInUser)
                .orElse(new InfluencerProfile());

        profile.setBio(request.getBio());
        profile.setInstagramHandle(request.getInstagramHandle());
        profile.setYoutubeHandle(request.getYoutubeHandle());
        profile.setFollowers(request.getFollowers());
        profile.setEngagementRate(request.getEngagementRate());
        profile.setNiche(request.getNiche());
        profile.setCity(request.getCity());
        profile.setProfileImage(request.getProfileImage());
        profile.setUser(loggedInUser);

        InfluencerProfile saved = influencerProfileRepository.save(profile);

        return mapToResponse(saved);
    }

    public List<InfluencerProfileResponse> getAllInfluencers() {

        return influencerProfileRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public InfluencerProfileResponse getInfluencerById(Long id) {

        InfluencerProfile profile = influencerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Influencer profile not found"));

        return mapToResponse(profile);
    }

    public InfluencerProfileResponse getMyProfile() {

        User loggedInUser = getLoggedInUser();

        InfluencerProfile profile = influencerProfileRepository.findByUser(loggedInUser)
                .orElseThrow(() -> new RuntimeException("Profile not created yet"));

        return mapToResponse(profile);
    }

    public List<InfluencerProfileResponse> searchInfluencers(String niche, String city) {

        List<InfluencerProfile> profiles;

        if (niche != null && city != null) {
            profiles = influencerProfileRepository.findByNicheAndCity(niche, city);
        } else if (niche != null) {
            profiles = influencerProfileRepository.findByNiche(niche);
        } else if (city != null) {
            profiles = influencerProfileRepository.findByCity(city);
        } else {
            profiles = influencerProfileRepository.findAll();
        }

        return profiles.stream()
                .map(this::mapToResponse)
                .toList();
    }
}