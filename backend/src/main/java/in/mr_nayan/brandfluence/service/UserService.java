package in.mr_nayan.brandfluence.service;


import in.mr_nayan.brandfluence.DTO.LoginRequest;
import in.mr_nayan.brandfluence.DTO.LoginResponse;
import in.mr_nayan.brandfluence.DTO.UserRequest;
import in.mr_nayan.brandfluence.DTO.UserResponse;
import in.mr_nayan.brandfluence.entity.User;
import in.mr_nayan.brandfluence.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import in.mr_nayan.brandfluence.security.JwtService;
import javax.management.RuntimeErrorException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {
    private  final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
//    UserService(UserRepository userRepository){
//        this.userRepository=userRepository;
//
//        }
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService =  jwtService;
    }

        public UserResponse registerUser(UserRequest request) {

        if(userRepository.existsByEmail(request.getEmail())){
throw new RuntimeException("Email alreadt exist");
        }

User user=new User();
        user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());

            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
User savedUser=userRepository.save(user);

UserResponse response=new UserResponse();
response.setId(savedUser.getId());
response.setName(savedUser.getName());
            response.setEmail(savedUser.getEmail());
            response.setRole(savedUser.getRole());
            response.setCreatedAt(savedUser.getCreatedAt());

    return response;
    }


public LoginResponse loginUser(LoginRequest request){
    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(
            request.getPassword(),
            user.getPassword())) {

        throw new RuntimeException("Invalid password");
    }
    String token = jwtService.generateToken(user.getEmail());
    LoginResponse response = new LoginResponse();

    response.setId(user.getId());
    response.setName(user.getName());
    response.setEmail(user.getEmail());
    response.setRole(user.getRole());
    response.setToken(token);
    response.setMessage("Login Successful");

    return response;


}


public List<UserResponse> getAllUsers(){
        List<User>users=userRepository.findAll();



    return users.stream()
            .map(user -> {
                UserResponse response = new UserResponse();
                response.setId(user.getId());
                response.setName(user.getName());
                response.setEmail(user.getEmail());
                response.setRole(user.getRole());
                response.setCreatedAt(user.getCreatedAt());
                return response;
            })
            .toList();


}

    }



