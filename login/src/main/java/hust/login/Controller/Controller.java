package hust.login.Controller;

import hust.login.Service.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.Serial;

@RestController
@RequestMapping("/auth")
public class Controller {
    @Autowired
    private Service service;

    @PostMapping("/login-via-username")
    public String LoginViaUserName(@RequestParam String userName, @RequestParam String password) {
        if (service.authenticateViaUsername(userName, password)) {
            return "Login successful!";
        } else {
            return "Invalid username or password!";
        }
    }

    @PostMapping("/login-via-email")
    public String loginViaEmail(@RequestParam String email, @RequestParam String password) {
        if (service.authenticateByEmail(email, password)) {
            return "Login successful!";
        } else {
            return "Invalid email or password!";
        }
    }

    @PostMapping("/sign-up")
    public String signUp(@RequestParam String userName, @RequestParam String email, @RequestParam String password) {
        if (service.signUp(userName, email, password)) {
            return "Sign up successful!";
        }
        return "Username or email already exists!";
    }

}
