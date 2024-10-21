package hust.login.Service;

import hust.login.Entity.User;
import hust.login.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

@org.springframework.stereotype.Service
public class Service {
    @Autowired
    UserRepository userRepository;

    public boolean authenticateViaUsername(String userName, String password) {
        return userRepository.findByUserName(userName)
                .map(user -> user.getPassword().equals(password))
                .orElse(false);
    }

    public boolean authenticateByEmail(String email, String password) {
        return userRepository.findByEmail(email)
                .map(user -> user.getPassword().equals(password))
                .orElse(false);
    }

    public boolean signUp(String userName, String email, String password) {
        if (userRepository.existsByUserNameOrEmail(userName, email)) {
            return false;
        }

        User newUser = new User();
        newUser.setUserName(userName);
        newUser.setEmail(email);
        newUser.setPassword(password);


        userRepository.save(newUser);

        return true;
    }

}
