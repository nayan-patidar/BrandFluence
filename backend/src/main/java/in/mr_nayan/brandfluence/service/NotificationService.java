package in.mr_nayan.brandfluence.service;

import in.mr_nayan.brandfluence.DTO.NotificationResponse;
import in.mr_nayan.brandfluence.entity.Notification;
import in.mr_nayan.brandfluence.entity.User;
import in.mr_nayan.brandfluence.repository.NotificationRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    private User getLoggedInUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    private NotificationResponse mapToResponse(Notification notification) {

        NotificationResponse response = new NotificationResponse();

        response.setId(notification.getId());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());

        return response;
    }

    // Called internally by other services (e.g. CollaborationService) to create a notification
    public void createNotification(User user, String message, String type) {

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyNotifications() {

        User loggedInUser = getLoggedInUser();

        return notificationRepository.findByUserOrderByCreatedAtDesc(loggedInUser)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public NotificationResponse markAsRead(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        User loggedInUser = getLoggedInUser();

        if (!notification.getUser().getId().equals(loggedInUser.getId())) {
            throw new RuntimeException("You are not allowed to access this notification");
        }

        notification.setRead(true);

        Notification updated = notificationRepository.save(notification);

        return mapToResponse(updated);
    }
}
