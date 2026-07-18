from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import Job


JOBS = [
    {
        "title": "Computer System Operator",
        "description": (
            "StackSentry Technologies is looking for a detail-oriented Computer System Operator "
            "to join our Operations team in Chennai. As a Computer System Operator, you will be "
            "responsible for operating computer systems, managing digital records, and ensuring "
            "smooth daily technical operations across the organization. This is an excellent "
            "opportunity for fresh graduates to begin their career in a fast-growing technology "
            "company with exposure to enterprise-level systems and workflows."
        ),
        "responsibilities": (
            "Operate computer systems and manage daily operational tasks\n"
            "Maintain digital records, files, and databases accurately\n"
            "Prepare reports using MS Excel and Word with attention to detail\n"
            "Enter and update data in internal systems with high accuracy\n"
            "Monitor system performance and report any issues to the IT team\n"
            "Assist employees with basic computer and software issues\n"
            "Follow data backup and security protocols\n"
            "Maintain logs of system activities and operations"
        ),
        "requirements": (
            "0-1 years of experience (freshers welcome)\n"
            "Proficiency in computer operations and Windows OS\n"
            "Strong knowledge of MS Office (Word, Excel, PowerPoint)\n"
            "Good data management and organizational skills\n"
            "Familiarity with internet browsing and email communication\n"
            "Basic troubleshooting skills for hardware and software\n"
            "Strong attention to detail and accuracy\n"
            "Good communication skills in English and Tamil"
        ),
        "benefits": (
            "Competitive salary with annual performance bonuses\n"
            "Health insurance for employee and dependents\n"
            "Paid sick leave and casual leave\n"
            "Professional development and training programs\n"
            "Modern office environment in Chennai\n"
            "Career growth opportunities within the operations team\n"
            "Team outings and employee engagement activities\n"
            "Provident fund and gratuity benefits"
        ),
        "salary_min": 180000,
        "salary_max": 280000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "entry",
        "location": "Chennai",
        "is_remote": False,
        "department": "Operations",
        "positions_available": 5,
    },
    {
        "title": "Data Entry Operator",
        "description": (
            "StackSentry Technologies is hiring a Data Entry Operator to join our Operations "
            "team in Chennai. You will be responsible for accurate and efficient data entry, "
            "maintaining spreadsheets, and ensuring the integrity of company and customer data. "
            "This role is ideal for freshers who are detail-oriented and proficient in MS Office "
            "applications. You will work closely with multiple departments to support data-driven "
            "decision-making."
        ),
        "responsibilities": (
            "Enter customer and company data into internal systems accurately\n"
            "Maintain and update spreadsheets and reports in MS Excel\n"
            "Verify data accuracy by cross-referencing source documents\n"
            "Organize and manage digital documents and filing systems\n"
            "Prepare daily and weekly data reports for management\n"
            "Identify and correct data inconsistencies and errors\n"
            "Follow data entry standards and quality benchmarks\n"
            "Maintain confidentiality of sensitive information"
        ),
        "requirements": (
            "0-1 years of experience (freshers welcome)\n"
            "Excellent typing speed and accuracy (minimum 30 WPM)\n"
            "Proficiency in MS Excel and MS Word\n"
            "Strong data entry and documentation skills\n"
            "Basic computer knowledge and familiarity with Windows OS\n"
            "Keen eye for detail and accuracy\n"
            "Ability to meet deadlines and manage time effectively\n"
            "Good verbal and written communication skills"
        ),
        "benefits": (
            "Competitive salary with performance incentives\n"
            "Health insurance coverage\n"
            "Paid leaves (casual, sick, and earned)\n"
            "On-the-job training and skill development\n"
            "Comfortable work environment in Chennai\n"
            "Opportunities for career advancement\n"
            "Employee recognition programs\n"
            "Provident fund and statutory benefits"
        ),
        "salary_min": 160000,
        "salary_max": 260000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "entry",
        "location": "Chennai",
        "is_remote": False,
        "department": "Operations",
        "positions_available": 4,
    },
    {
        "title": "Computer Support Executive",
        "description": (
            "StackSentry Technologies is seeking a Computer Support Executive to join our "
            "IT Support team in Chennai. In this role, you will provide first-line technical "
            "support to employees, troubleshoot hardware and software issues, and ensure all "
            "computer systems are running smoothly. This is a great opportunity for freshers "
            "passionate about IT support to gain hands-on experience in a professional "
            "technology environment."
        ),
        "responsibilities": (
            "Troubleshoot computer hardware and software issues for employees\n"
            "Install and configure software applications and operating systems\n"
            "Provide first-level support for technical problems via walk-in, phone, and ticketing system\n"
            "Maintain and update computer systems, drivers, and patches\n"
            "Resolve basic network connectivity and printer setup issues\n"
            "Document common issues and solutions in the knowledge base\n"
            "Set up new workstations and peripherals for onboarding employees\n"
            "Escalate unresolved issues to senior technical staff"
        ),
        "requirements": (
            "0-1 years of experience (freshers welcome)\n"
            "Strong knowledge of computer hardware troubleshooting\n"
            "Proficiency in software installation and Windows OS configuration\n"
            "Basic understanding of networking (TCP/IP, DNS, DHCP)\n"
            "Experience with printer and peripheral setup\n"
            "Familiarity with remote desktop tools\n"
            "Good customer service and communication skills\n"
            "Ability to prioritize and manage multiple support requests"
        ),
        "benefits": (
            "Competitive salary with annual increments\n"
            "Health and accident insurance\n"
            "Paid time off and public holidays\n"
            "IT certification sponsorship (CompTIA, Microsoft)\n"
            "Hands-on experience with enterprise IT infrastructure\n"
            "Mentorship from senior IT professionals\n"
            "Modern office with latest tools and equipment\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 200000,
        "salary_max": 350000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "entry",
        "location": "Chennai",
        "is_remote": False,
        "department": "IT Support",
        "positions_available": 3,
    },
    {
        "title": "System Administrator Trainee",
        "description": (
            "StackSentry Technologies is offering a System Administrator Trainee position "
            "within our IT Infrastructure team in Chennai. This role provides a structured "
            "training path for aspiring system administrators to learn enterprise-level system "
            "management, networking, and infrastructure operations. You will work alongside "
            "senior administrators to gain real-world experience managing Linux and Windows "
            "environments, user accounts, and system monitoring tools."
        ),
        "responsibilities": (
            "Monitor company systems, servers, and network infrastructure\n"
            "Manage user accounts, permissions, and access controls\n"
            "Install and configure operating systems and enterprise applications\n"
            "Perform routine system maintenance, updates, and security patches\n"
            "Assist senior administrators with infrastructure projects\n"
            "Respond to system alerts and perform initial incident triage\n"
            "Maintain documentation of system configurations and procedures\n"
            "Participate in backup and disaster recovery exercises"
        ),
        "requirements": (
            "0-1 years of experience (freshers welcome)\n"
            "Foundational knowledge of Windows Server and Linux administration\n"
            "Understanding of networking fundamentals (TCP/IP, DNS, DHCP, VPN)\n"
            "Basic knowledge of virtualization (VMware, Hyper-V, or KVM)\n"
            "Familiarity with system monitoring tools\n"
            "Interest in cloud platforms (AWS, Azure) is a plus\n"
            "Strong problem-solving and analytical thinking\n"
            "Willingness to learn and work in a fast-paced environment"
        ),
        "benefits": (
            "Competitive trainee stipend with full-time conversion opportunity\n"
            "Health insurance for employee\n"
            "Paid training and certification programs (Linux, AWS, Azure)\n"
            "Structured mentorship program with senior engineers\n"
            "Hands-on experience with production infrastructure\n"
            "Career progression to System Administrator and beyond\n"
            "Flexible working hours\n"
            "Provident fund and statutory benefits"
        ),
        "salary_min": 220000,
        "salary_max": 380000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "entry",
        "location": "Chennai",
        "is_remote": False,
        "department": "IT Infrastructure",
        "positions_available": 2,
    },
    {
        "title": "MS Office Specialist",
        "description": (
            "StackSentry Technologies is looking for an MS Office Specialist to join our "
            "Administration team in Chennai on an internship basis. You will be responsible "
            "for creating professional documents, preparing reports and presentations, and "
            "supporting day-to-day administrative tasks. This internship provides an excellent "
            "platform for freshers to develop professional office skills and gain corporate "
            "experience in a technology-driven company."
        ),
        "responsibilities": (
            "Create and format professional documents in MS Word\n"
            "Prepare detailed Excel reports, dashboards, and data visualizations\n"
            "Design and build PowerPoint presentations for meetings and events\n"
            "Manage and organize office documentation and digital filing\n"
            "Support administrative tasks including scheduling and correspondence\n"
            "Maintain shared drives and ensure proper document versioning\n"
            "Assist in preparing meeting minutes and follow-up summaries\n"
            "Handle confidential information with discretion"
        ),
        "requirements": (
            "0-1 years of experience (freshers and recent graduates welcome)\n"
            "Advanced proficiency in MS Excel (VLOOKUP, Pivot Tables, formulas)\n"
            "Strong MS Word formatting and document design skills\n"
            "Experience creating professional PowerPoint presentations\n"
            "Basic data reporting and visualization abilities\n"
            "Excellent documentation and organizational skills\n"
            "Strong attention to detail and time management\n"
            "Good interpersonal and communication skills"
        ),
        "benefits": [
            "Monthly internship stipend",
            "Certificate of completion and experience letter",
            "Potential for full-time conversion based on performance",
            "Hands-on corporate experience in a technology company",
            "Mentorship from senior administrative professionals",
            "Exposure to enterprise documentation standards",
            "Networking opportunities within the organization",
            "Recommendation letter for future opportunities",
        ],
        "salary_min": 100000,
        "salary_max": 180000,
        "salary_currency": "INR",
        "job_type": "internship",
        "experience_level": "entry",
        "location": "Chennai",
        "is_remote": False,
        "department": "Administration",
        "positions_available": 3,
    },
    {
        "title": "Junior Software Developer",
        "description": (
            "StackSentry Technologies is hiring a Junior Software Developer to join our "
            "Engineering team in Chennai. You will work on building and maintaining web "
            "applications using modern frameworks and technologies. This role is ideal for "
            "candidates with 1-2 years of experience or strong project portfolios who want "
            "to grow in a collaborative, fast-paced development environment."
        ),
        "responsibilities": (
            "Develop, test, and maintain web applications using Python/JavaScript\n"
            "Write clean, reusable, and well-documented code\n"
            "Participate in code reviews and contribute to team coding standards\n"
            "Fix bugs and resolve issues reported through the ticketing system\n"
            "Collaborate with the frontend team to integrate REST APIs\n"
            "Write unit tests and integration tests for developed features\n"
            "Assist in database design and query optimization\n"
            "Contribute to technical documentation and knowledge base"
        ),
        "requirements": (
            "1-2 years of experience in software development\n"
            "Proficiency in Python or JavaScript/TypeScript\n"
            "Experience with web frameworks (FastAPI, Django, React, or Node.js)\n"
            "Familiarity with databases (PostgreSQL, MySQL, or MongoDB)\n"
            "Understanding of REST APIs and HTTP protocols\n"
            "Knowledge of Git version control\n"
            "Basic understanding of CI/CD pipelines\n"
            "Strong problem-solving skills and eagerness to learn"
        ),
        "benefits": (
            "Competitive salary with performance-based increments\n"
            "Health insurance for employee and family\n"
            "Flexible hybrid work arrangement\n"
            "Annual learning and development budget\n"
            "Paid time off, sick leave, and public holidays\n"
            "Latest development tools and hardware\n"
            "Hackathons and innovation days\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 400000,
        "salary_max": 700000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "entry",
        "location": "Chennai",
        "is_remote": True,
        "department": "Engineering",
        "positions_available": 4,
    },
    {
        "title": "Full Stack Developer",
        "description": (
            "StackSentry Technologies is looking for a skilled Full Stack Developer to "
            "join our Engineering team in Chennai. You will own end-to-end feature development "
            "across our recruitment platform, building both frontend interfaces and backend "
            "services. This mid-level role requires 2-4 years of hands-on experience with "
            "modern web technologies and a passion for building scalable applications."
        ),
        "responsibilities": (
            "Design and develop full-stack web applications using React and Python\n"
            "Build and maintain RESTful APIs and backend services\n"
            "Implement responsive frontend interfaces with modern UI frameworks\n"
            "Design database schemas and write optimized SQL queries\n"
            "Integrate third-party services, APIs, and payment gateways\n"
            "Implement authentication, authorization, and security best practices\n"
            "Participate in architecture decisions and technical design reviews\n"
            "Mentor junior developers and conduct code reviews"
        ),
        "requirements": (
            "2-4 years of experience in full-stack development\n"
            "Strong proficiency in React/TypeScript and Python (FastAPI or Django)\n"
            "Solid experience with PostgreSQL or MySQL\n"
            "Experience with Docker and containerized deployments\n"
            "Knowledge of Redis, Celery, or similar task queue systems\n"
            "Familiarity with cloud services (AWS, GCP, or Azure)\n"
            "Understanding of CI/CD, testing frameworks, and agile practices\n"
            "Strong communication skills and ability to work in a team"
        ),
        "benefits": (
            "Competitive salary with equity options\n"
            "Health insurance for employee and dependents\n"
            "Hybrid work model (3 days office, 2 days remote)\n"
            "Annual conference and training budget\n"
            "Generous paid time off and mental health days\n"
            "Latest MacBook Pro or equivalent hardware\n"
            "Team offsites and hackathons\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 800000,
        "salary_max": 1400000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "mid",
        "location": "Chennai",
        "is_remote": True,
        "department": "Engineering",
        "positions_available": 3,
    },
    {
        "title": "Senior Software Engineer",
        "description": (
            "StackSentry Technologies is seeking a Senior Software Engineer to lead "
            "technical development of our core recruitment platform. Based in Chennai, "
            "you will architect scalable systems, mentor engineering talent, and drive "
            "technical excellence across the team. This role demands 4-6 years of "
            "experience and a proven track record of delivering production-grade "
            "applications at scale."
        ),
        "responsibilities": (
            "Architect and lead development of scalable microservices and web applications\n"
            "Design system architecture, data models, and API contracts\n"
            "Lead technical design reviews and establish engineering best practices\n"
            "Mentor mid-level and junior developers through pairing and code reviews\n"
            "Optimize application performance, database queries, and caching strategies\n"
            "Drive adoption of testing, CI/CD, and observability practices\n"
            "Collaborate with product and design teams on technical feasibility\n"
            "Participate in on-call rotation for production incident response"
        ),
        "requirements": (
            "4-6 years of experience in software engineering\n"
            "Expert-level proficiency in Python and/or TypeScript/JavaScript\n"
            "Deep experience with React, FastAPI, or equivalent frameworks\n"
            "Strong database skills with PostgreSQL including indexing and optimization\n"
            "Experience designing and operating microservices architectures\n"
            "Proficiency with Docker, Kubernetes, and cloud platforms (AWS/GCP)\n"
            "Knowledge of message brokers (RabbitMQ, Kafka) and caching (Redis)\n"
            "BS/MS in Computer Science or equivalent practical experience"
        ),
        "benefits": (
            "Top-of-market salary with stock options\n"
            "Premium health insurance for employee and family\n"
            "Fully flexible hybrid work arrangement\n"
            "Unlimited learning budget (conferences, courses, certifications)\n"
            "Generous PTO plus wellness days\n"
            "Latest hardware and home office setup allowance\n"
            "Annual team retreat and innovation sprints\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 1500000,
        "salary_max": 2500000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "senior",
        "location": "Chennai",
        "is_remote": True,
        "department": "Engineering",
        "positions_available": 2,
    },
    {
        "title": "DevOps Engineer",
        "description": (
            "StackSentry Technologies is hiring a DevOps Engineer to build and maintain "
            "our cloud infrastructure and deployment pipelines in Chennai. You will be "
            "responsible for automating infrastructure, ensuring high availability, and "
            "streamlining the software delivery process. This role is perfect for engineers "
            "with 2-4 years of experience who are passionate about infrastructure-as-code "
            "and reliability engineering."
        ),
        "responsibilities": (
            "Design, build, and maintain CI/CD pipelines for automated deployments\n"
            "Manage cloud infrastructure on AWS (EC2, ECS, RDS, S3, Lambda)\n"
            "Implement infrastructure-as-code using Terraform or CloudFormation\n"
            "Configure and manage container orchestration with Docker and ECS/Kubernetes\n"
            "Set up monitoring, alerting, and logging with Grafana, Prometheus, and ELK\n"
            "Manage database deployments, backups, and disaster recovery procedures\n"
            "Implement security best practices for infrastructure and deployments\n"
            "Automate operational tasks and reduce manual intervention"
        ),
        "requirements": (
            "2-4 years of experience in DevOps or SRE roles\n"
            "Strong hands-on experience with AWS cloud services\n"
            "Proficiency with infrastructure-as-code (Terraform preferred)\n"
            "Experience with Docker and container orchestration\n"
            "Scripting skills in Python, Bash, or Go\n"
            "Knowledge of CI/CD tools (GitHub Actions, GitLab CI, Jenkins)\n"
            "Experience with monitoring stacks (Prometheus, Grafana, Datadog)\n"
            "Familiarity with Linux system administration and networking"
        ),
        "benefits": (
            "Competitive salary with annual performance bonus\n"
            "Health insurance for employee and dependents\n"
            "Hybrid work model\n"
            "AWS/GCP certification sponsorship\n"
            "Conference and training budget\n"
            "Paid time off and public holidays\n"
            "Latest tools and home office setup\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 900000,
        "salary_max": 1600000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "mid",
        "location": "Chennai",
        "is_remote": True,
        "department": "Engineering",
        "positions_available": 2,
    },
    {
        "title": "Cybersecurity Analyst",
        "description": (
            "StackSentry Technologies is looking for a Cybersecurity Analyst to protect "
            "our systems, data, and infrastructure in Chennai. You will monitor security "
            "events, conduct vulnerability assessments, and respond to security incidents "
            "across the organization. This role requires 2-4 years of experience in "
            "information security and a strong understanding of threat detection and "
            "incident response."
        ),
        "responsibilities": (
            "Monitor security events and alerts using SIEM tools (Splunk, Wazuh)\n"
            "Conduct vulnerability assessments and penetration testing\n"
            "Investigate and respond to security incidents following IR procedures\n"
            "Perform risk assessments on new systems, applications, and changes\n"
            "Develop and maintain security policies, procedures, and documentation\n"
            "Manage firewalls, IDS/IPS, and endpoint security solutions\n"
            "Conduct security awareness training for employees\n"
            "Ensure compliance with security standards (ISO 27001, SOC 2)"
        ),
        "requirements": (
            "2-4 years of experience in cybersecurity or information security\n"
            "Knowledge of SIEM tools and security monitoring techniques\n"
            "Experience with vulnerability scanning tools (Nessus, OpenVAS)\n"
            "Understanding of OWASP Top 10 and common attack vectors\n"
            "Familiarity with network security (firewalls, VPN, IDS/IPS)\n"
            "Knowledge of Linux and Windows security configurations\n"
            "Relevant certifications preferred (CEH, CompTIA Security+, CISSP)\n"
            "Strong analytical thinking and attention to detail"
        ),
        "benefits": (
            "Competitive salary with security certification bonuses\n"
            "Health insurance for employee and family\n"
            "Hybrid work arrangement\n"
            "Annual certification and training sponsorship\n"
            "Paid time off and public holidays\n"
            "Access to security labs and testing environments\n"
            "Industry conference attendance\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 700000,
        "salary_max": 1300000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "mid",
        "location": "Chennai",
        "is_remote": False,
        "department": "Information Security",
        "positions_available": 2,
    },
    {
        "title": "Cloud Engineer",
        "description": (
            "StackSentry Technologies is hiring a Cloud Engineer to design, deploy, and "
            "manage our cloud infrastructure on AWS. Based in Chennai, you will migrate "
            "services to the cloud, optimize costs, and ensure our platform achieves "
            "high availability and performance targets. This role requires 2-5 years "
            "of hands-on cloud engineering experience."
        ),
        "responsibilities": (
            "Design and deploy scalable, secure cloud architectures on AWS\n"
            "Migrate on-premise applications and databases to cloud environments\n"
            "Optimize cloud costs through resource right-sizing and reserved instances\n"
            "Implement auto-scaling, load balancing, and high-availability configurations\n"
            "Manage cloud networking (VPCs, subnets, security groups, Route 53)\n"
            "Automate deployments and infrastructure using Terraform and CloudFormation\n"
            "Configure cloud-native databases (RDS, DynamoDB, ElastiCache)\n"
            "Establish disaster recovery and backup strategies for cloud workloads"
        ),
        "requirements": (
            "2-5 years of experience with cloud engineering on AWS\n"
            "AWS Solutions Architect or equivalent certification preferred\n"
            "Strong experience with EC2, ECS, RDS, S3, Lambda, and CloudFront\n"
            "Proficiency with Terraform or CloudFormation for IaC\n"
            "Experience with Docker and container orchestration\n"
            "Knowledge of cloud security, IAM policies, and encryption\n"
            "Scripting skills in Python or Bash\n"
            "Strong understanding of networking, DNS, and CDN concepts"
        ),
        "benefits": (
            "Competitive salary with cloud certification incentives\n"
            "Health insurance for employee and dependents\n"
            "Hybrid work model\n"
            "AWS certification sponsorship and recertification support\n"
            "Annual learning and conference budget\n"
            "Flexible PTO and public holidays\n"           "Latest hardware and home office setup\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 1000000,
        "salary_max": 1800000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "mid",
        "location": "Chennai",
        "is_remote": True,
        "department": "Cloud Infrastructure",
        "positions_available": 2,
    },
    {
        "title": "QA Automation Engineer",
        "description": (
            "StackSentry Technologies is seeking a QA Automation Engineer to join our "
            "Quality Assurance team in Chennai. You will design and build automated test "
            "frameworks, write test scripts, and ensure the reliability of our recruitment "
            "platform. This role requires 2-4 years of experience in test automation and "
            "a commitment to shipping high-quality software."
        ),
        "responsibilities": (
            "Design and develop automated test frameworks for web and API testing\n"
            "Write and maintain end-to-end test scripts using Selenium, Cypress, or Playwright\n"
            "Build and maintain API test suites using pytest or similar frameworks\n"
            "Integrate automated tests into CI/CD pipelines for continuous testing\n"
            "Perform functional, regression, and performance testing\n"
            "Identify, document, and track software defects through resolution\n"
            "Collaborate with developers to define testability requirements\n"
            "Generate test reports and communicate quality metrics to stakeholders"
        ),
        "requirements": (
            "2-4 years of experience in QA automation\n"
            "Proficiency with test automation frameworks (Selenium, Cypress, or Playwright)\n"
            "Strong programming skills in Python or JavaScript/TypeScript\n"
            "Experience with API testing tools (Postman, pytest, REST-assured)\n"
            "Knowledge of CI/CD integration for test automation\n"
            "Familiarity with performance testing tools (JMeter, k6)\n"
            "Understanding of Agile/Scrum testing methodologies\n"
            "ISTQB certification is a plus"
        ),
        "benefits": (
            "Competitive salary with quality-focused bonuses\n"
            "Health insurance for employee and family\n"
            "Hybrid work arrangement\n"
            "Certification and training sponsorship\n"
            "Paid time off and public holidays\n"
            "Latest testing tools and hardware\n"
            "Innovation time for tool development\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 700000,
        "salary_max": 1200000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "mid",
        "location": "Chennai",
        "is_remote": True,
        "department": "Quality Assurance",
        "positions_available": 2,
    },
    {
        "title": "Technical Lead",
        "description": (
            "StackSentry Technologies is looking for a Technical Lead to drive the "
            "technical vision and execution of our product engineering team in Chennai. "
            "You will lead a team of developers, make architectural decisions, and "
            "ensure the delivery of scalable, high-quality software. This senior role "
            "requires 6-8 years of software engineering experience with at least 2 years "
            "in a technical leadership capacity."
        ),
        "responsibilities": (
            "Lead a team of 5-8 engineers across frontend and backend development\n"
            "Define technical architecture and make high-impact design decisions\n"
            "Set engineering standards, coding guidelines, and review processes\n"
            "Drive technical roadmap planning in collaboration with product management\n"
            "Conduct architecture reviews and ensure system scalability and reliability\n"
            "Mintor and grow senior and mid-level engineers through coaching\n"
            "Manage technical debt and drive continuous improvement initiatives\n"
            "Coordinate with DevOps, QA, and security teams on cross-cutting concerns"
        ),
        "requirements": (
            "6-8 years of experience in software engineering\n"
            "2+ years in a technical lead or engineering manager role\n"
            "Expert-level skills in Python and/or TypeScript\n"
            "Deep experience with React, FastAPI, and cloud-native architectures\n"
            "Proven track record of leading teams and delivering complex projects\n"
            "Strong system design and architecture skills\n"
            "Experience with agile practices, sprint planning, and delivery management\n"
            "Excellent communication and stakeholder management skills"
        ),
        "benefits": (
            "Leadership-level salary with equity and performance bonuses\n"
            "Premium health insurance for employee and family\n"
            "Flexible hybrid work model\n"
            "Unlimited learning and conference budget\n"
            "Generous PTO and executive wellness days\n"
            "Latest MacBook Pro and home office setup\n"
            "Annual leadership retreat and team offsites\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 2200000,
        "salary_max": 3500000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "senior",
        "location": "Chennai",
        "is_remote": True,
        "department": "Engineering",
        "positions_available": 1,
    },
    {
        "title": "IT Project Manager",
        "description": (
            "StackSentry Technologies is hiring an IT Project Manager to lead and "
            "deliver technology projects across the organization in Chennai. You will "
            "manage project timelines, resources, budgets, and stakeholder communication "
            "for our recruitment platform and internal tooling projects. This role requires "
            "4-6 years of IT project management experience with strong technical acumen."
        ),
        "responsibilities": (
            "Plan, execute, and deliver IT projects on time and within budget\n"
            "Define project scope, goals, deliverables, and success criteria\n"
            "Manage project resources, budgets, and risk registers\n"
            "Facilitate daily standups, sprint planning, and retrospectives\n"
            "Communicate project status, risks, and milestones to stakeholders\n"
            "Coordinate between engineering, design, QA, and product teams\n"
            "Document project requirements and maintain project documentation\n"
            "Drive continuous improvement in project delivery processes"
        ),
        "requirements": (
            "4-6 years of experience in IT project management\n"
            "PMP, PRINCE2, or Certified Scrum Master certification preferred\n"
            "Experience managing web application development projects\n"
            "Proficiency with project management tools (Jira, Linear, or Asana)\n"
            "Strong understanding of software development lifecycle (SDLC)\n"
            "Excellent stakeholder management and communication skills\n"
            "Ability to manage multiple concurrent projects\n"
            "Technical background with ability to understand engineering trade-offs"
        ),
        "benefits": (
            "Competitive salary with project completion bonuses\n"
            "Health insurance for employee and dependents\n"
            "Hybrid work model\n"
            "PMP/Scrum certification sponsorship\n"
            "Generous PTO and public holidays\n"
            "Professional development and leadership training\n"
            "Annual team events and company offsites\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 1200000,
        "salary_max": 2000000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "mid",
        "location": "Chennai",
        "is_remote": True,
        "department": "Engineering",
        "positions_available": 1,
    },
    {
        "title": "Network Administrator",
        "description": (
            "StackSentry Technologies is looking for a Network Administrator to manage "
            "and maintain our enterprise network infrastructure in Chennai. You will be "
            "responsible for ensuring network reliability, security, and performance across "
            "all office locations and cloud environments. This role requires 2-4 years of "
            "hands-on networking experience."
        ),
        "responsibilities": (
            "Configure, manage, and maintain routers, switches, and firewalls\n"
            "Monitor network performance and resolve connectivity issues\n"
            "Manage VPN tunnels, VLANs, and network segmentation\n"
            "Implement and maintain DNS, DHCP, and IP address management\n"
            "Perform network security assessments and apply firmware updates\n"
            "Document network topology, configurations, and procedures\n"
            "Manage wireless access points and network bandwidth allocation\n"
            "Support cloud networking configurations and hybrid connectivity"
        ),
        "requirements": (
            "2-4 years of experience in network administration\n"
            "CCNA, CompTIA Network+, or equivalent certification preferred\n"
            "Strong knowledge of TCP/IP, DNS, DHCP, and routing protocols\n"
            "Experience with Cisco, Juniper, or similar enterprise networking equipment\n"
            "Proficiency with network monitoring tools (Nagios, PRTG, Zabbix)\n"
            "Understanding of firewalls, IDS/IPS, and network security\n"
            "Experience with VPN configuration and management\n"
            "Strong troubleshooting and documentation skills"
        ),
        "benefits": (
            "Competitive salary with networking certification bonuses\n"
            "Health insurance for employee and family\n"
            "Standard office work schedule\n"
            "Certification sponsorship (CCNA, CCNP)\n"
            "Paid time off and public holidays\n"
            "Hands-on enterprise networking experience\n"
            "Professional development opportunities\n"
            "Provident fund, gratuity, and statutory benefits"
        ),
        "salary_min": 500000,
        "salary_max": 900000,
        "salary_currency": "INR",
        "job_type": "full_time",
        "experience_level": "mid",
        "location": "Chennai",
        "is_remote": False,
        "department": "IT Infrastructure",
        "positions_available": 2,
    },
]


async def seed_jobs(db: AsyncSession) -> None:
    """Create default job postings if they don't already exist."""
    result = await db.execute(select(Job.title))
    existing_titles = {row[0] for row in result.all()}

    now = datetime.now(timezone.utc)
    deadline = now + timedelta(days=60)

    for job_data in JOBS:
        if job_data["title"] in existing_titles:
            continue

        benefits = job_data["benefits"]
        if isinstance(benefits, list):
            benefits = "\n".join(benefits)

        job = Job(
            title=job_data["title"],
            description=job_data["description"],
            responsibilities=job_data["responsibilities"],
            requirements=job_data["requirements"],
            benefits=benefits,
            salary_min=job_data["salary_min"],
            salary_max=job_data["salary_max"],
            salary_currency=job_data["salary_currency"],
            job_type=job_data["job_type"],
            experience_level=job_data["experience_level"],
            location=job_data["location"],
            is_remote=job_data["is_remote"],
            department=job_data["department"],
            is_active=True,
            application_deadline=deadline,
            positions_available=job_data["positions_available"],
        )
        db.add(job)

    await db.flush()
