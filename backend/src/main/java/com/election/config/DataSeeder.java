package com.election.config;

import com.election.model.*;
import com.election.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final ElectionRepository electionRepository;
        private final CandidateRepository candidateRepository;
        private final PasswordEncoder passwordEncoder;

        public DataSeeder(UserRepository userRepository, ElectionRepository electionRepository,
                        CandidateRepository candidateRepository, PasswordEncoder passwordEncoder) {
                this.userRepository = userRepository;
                this.electionRepository = electionRepository;
                this.candidateRepository = candidateRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        public void run(String... args) {
                if (userRepository.count() == 0) {
                        User admin = new User();
                        admin.setUsername("admin");
                        admin.setFullName("System Admin");
                        admin.setEmail("admin@election.com");
                        admin.setPassword(passwordEncoder.encode("admin123"));
                        admin.setRole(Role.ROLE_ADMIN);
                        admin.setEnabled(true);
                        userRepository.save(admin);

                        User citizen = new User();
                        citizen.setUsername("citizen1");
                        citizen.setFullName("Rahul Kumar");
                        citizen.setEmail("citizen@election.com");
                        citizen.setPassword(passwordEncoder.encode("citizen123"));
                        citizen.setRole(Role.ROLE_CITIZEN);
                        citizen.setEnabled(true);
                        userRepository.save(citizen);

                        User observer = new User();
                        observer.setUsername("observer1");
                        observer.setFullName("Priya Sharma");
                        observer.setEmail("observer@election.com");
                        observer.setPassword(passwordEncoder.encode("observer123"));
                        observer.setRole(Role.ROLE_OBSERVER);
                        observer.setEnabled(true);
                        userRepository.save(observer);

                        User analyst = new User();
                        analyst.setUsername("analyst1");
                        analyst.setFullName("Amit Verma");
                        analyst.setEmail("analyst@election.com");
                        analyst.setPassword(passwordEncoder.encode("analyst123"));
                        analyst.setRole(Role.ROLE_ANALYST);
                        analyst.setEnabled(true);
                        userRepository.save(analyst);

                        Election e1 = new Election();
                        e1.setName("General Elections 2026");
                        e1.setDescription("National general elections for the 18th Lok Sabha");
                        e1.setElectionDate(LocalDate.of(2026, 4, 15));
                        e1.setStatus(ElectionStatus.ONGOING);
                        e1.setRegion("National");
                        e1.setTotalRegisteredVoters(950000000);
                        e1.setCreatedBy(userRepository.findByUsername("admin").get());
                        electionRepository.save(e1);

                        Election e2 = new Election();
                        e2.setName("State Assembly Elections - Karnataka");
                        e2.setDescription("Karnataka State Legislative Assembly Elections");
                        e2.setElectionDate(LocalDate.of(2026, 5, 10));
                        e2.setStatus(ElectionStatus.UPCOMING);
                        e2.setRegion("Karnataka");
                        e2.setTotalRegisteredVoters(52000000);
                        e2.setCreatedBy(userRepository.findByUsername("admin").get());
                        electionRepository.save(e2);

                        Election e3 = new Election();
                        e3.setName("Municipal Corporation Elections - Mumbai");
                        e3.setDescription("Brihanmumbai Municipal Corporation elections");
                        e3.setElectionDate(LocalDate.of(2025, 12, 20));
                        e3.setStatus(ElectionStatus.COMPLETED);
                        e3.setRegion("Mumbai");
                        e3.setTotalRegisteredVoters(9200000);
                        e3.setCreatedBy(userRepository.findByUsername("admin").get());
                        electionRepository.save(e3);

                        Candidate c1 = new Candidate();
                        c1.setName("Rajesh Patel");
                        c1.setParty("National Progress Party");
                        c1.setManifesto("Focus on economic development and job creation");
                        c1.setElection(e1);
                        candidateRepository.save(c1);

                        Candidate c2 = new Candidate();
                        c2.setName("Sunita Devi");
                        c2.setParty("People's Democratic Front");
                        c2.setManifesto("Empowering rural areas and agricultural reform");
                        c2.setElection(e1);
                        candidateRepository.save(c2);

                        Candidate c3 = new Candidate();
                        c3.setName("Vikram Singh");
                        c3.setParty("United Citizens Alliance");
                        c3.setManifesto("Technology-driven governance and transparency");
                        c3.setElection(e1);
                        candidateRepository.save(c3);

                        Candidate c4 = new Candidate();
                        c4.setName("Lakshmi Narayana");
                        c4.setParty("Karnataka Development Party");
                        c4.setManifesto("State development and infrastructure");
                        c4.setElection(e2);
                        candidateRepository.save(c4);

                        Candidate c5 = new Candidate();
                        c5.setName("Mohammed Ali");
                        c5.setParty("Progressive Karnataka Front");
                        c5.setManifesto("Education and healthcare reform");
                        c5.setElection(e2);
                        candidateRepository.save(c5);

                        System.out.println("=== Sample data loaded successfully! ===");
                        System.out.println("Login credentials:");
                        System.out.println("  Admin:    admin / admin123");
                        System.out.println("  Citizen:  citizen1 / citizen123");
                        System.out.println("  Observer: observer1 / observer123");
                        System.out.println("  Analyst:  analyst1 / analyst123");
                }
        }
}
