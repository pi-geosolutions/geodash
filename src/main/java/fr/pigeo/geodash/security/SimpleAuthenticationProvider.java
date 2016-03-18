package fr.pigeo.geodash.security;

import fr.pigeo.geodash.dao.UserDao;
import fr.pigeo.geodash.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
public class SimpleAuthenticationProvider  {

    @Autowired
    private UserDao repository;

    public void authenticatez(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = (String) authentication.getCredentials();

        User user = repository.findByLogin(username);

        if (user == null) {
            throw new BadCredentialsException("User not found.");
        }

        if (!password.equals(user.getPassword())) {
            throw new BadCredentialsException("Wrong password.");
        }

/*
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        return new UsernamePasswordAuthenticationToken(user, password, authorities);
*/
    }

    public boolean supports(Class<?> arg0) {
        return true;
    }

}