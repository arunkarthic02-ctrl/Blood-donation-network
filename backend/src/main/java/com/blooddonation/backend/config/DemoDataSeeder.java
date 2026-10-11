package com.blooddonation.backend.config;

import com.blooddonation.backend.entity.DonorProfile;
import com.blooddonation.backend.entity.User;
import com.blooddonation.backend.repository.DonorProfileRepository;
import com.blooddonation.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.seed-demo-data", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonorProfileRepository donorProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("SEED_DEMO_DATA=true detected. Seeding idempotent demo data...");

        seedDonor("Ravi Kumar", "donor1@bloodconnect.demo", "Demo@1234", "9876543211", "O+", "Male", 10.7905, 78.7047);
        seedDonor("Priya Sharma", "donor2@bloodconnect.demo", "Demo@1234", "9876543212", "O+", "Female", 10.8050, 78.6850);
        seedPatient("Anand V", "patient@bloodconnect.demo", "Demo@1234", "9876543213");

        log.info("Demo data seeding completed.");
    }

    private void seedDonor(String name, String email, String password, String phone,
                           String bloodGroup, String gender, double lat, double lon) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setPhone(phone);
            user.setRole(User.Role.DONOR);
            user = userRepository.save(user);
            log.info("Created demo donor user: {}", email);
        }

        DonorProfile profile = donorProfileRepository.findByUserId(user.getId());
        if (profile == null) {
            profile = new DonorProfile();
            profile.setUser(user);
            profile.setBloodGroup(bloodGroup);
            profile.setGender(gender);
            profile.setLatitude(lat);
            profile.setLongitude(lon);
            profile.setIsAvailable(true);
            donorProfileRepository.save(profile);
            log.info("Created donor profile for: {}", email);
        }
    }

    private void seedPatient(String name, String email, String password, String phone) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setPhone(phone);
            user.setRole(User.Role.PATIENT);
            userRepository.save(user);
            log.info("Created demo patient user: {}", email);
        }
    }
}
