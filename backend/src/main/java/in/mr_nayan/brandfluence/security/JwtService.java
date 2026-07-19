package in.mr_nayan.brandfluence.security;


import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "thisIsMySecretKeyForBrandFluenceJwtAuthentication123";


    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

public String generateToken(String email){
        return Jwts.builder().subject( email).issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith( Keys.hmacShaKeyFor(
                        SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                        .compact();


    }


}




