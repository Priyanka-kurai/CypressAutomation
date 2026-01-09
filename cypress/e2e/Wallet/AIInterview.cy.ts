describe('Interview Form Multi-Step Test', () => {
  // Set up browser permissions before the test
  before(() => {
    cy.wrap(Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: {
        permissions: ['videoCapture', 'audioCapture'],
        origin: 'https://frontend-v2-712919537046.asia-southeast1.run.app',
      },
    }));
  });

  it('should complete entire interview setup flow with random values', () => {
    // Visit the URL with media permissions enabled
    cy.visit('https://frontend-v2-712919537046.asia-southeast1.run.app', {
      onBeforeLoad(win) {
        // Stub getUserMedia to automatically grant permissions
        cy.stub(win.navigator.mediaDevices, 'getUserMedia').resolves({
          getTracks: () => [],
          getVideoTracks: () => [],
          getAudioTracks: () => [],
        });
      },
    });

    // ========== STEP 1: Basic Information Form ==========
    cy.log('=== Step 1: Filling Basic Information ===');
    
    // Wait for the first form to be visible
    cy.get('form').should('be.visible');

    // Generate random values for step 1
    const randomCompanies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Tesla', 'Netflix', 'Adobe', 'Oracle', 'IBM'];
    
    const randomCompany = randomCompanies[Math.floor(Math.random() * randomCompanies.length)];

    // Fill Target Company / Your Name field
    cy.get('input[type="text"][placeholder="Enter company or your name"]')
      .clear()
      .type(randomCompany);

    // Select Interview Category - always domain-specific
    cy.get('select').eq(0).select('domain-specific');

    // Language is always English
    cy.get('select').eq(1).select('en');

    cy.log(`Step 1 - Company: ${randomCompany}, Category: Domain-specific, Language: English`);

    // Enable and click Next button
    cy.get('button[type="button"]')
      .contains('Next')
      .invoke('removeAttr', 'disabled')
      .click();

    cy.wait(1000);

    // ========== STEP 2: Domain and Role Selection ==========
    cy.log('=== Step 2: Selecting Domain and Role ===');

    // Wait for second form
    cy.contains('What domain and role would you like to simulate the interview for?').should('be.visible');

    // Domain options with their IDs
    const domains = [
      { id: '6874b488e8d5483ad607a066', name: 'Art & Design', keyword: 'design' },
      { id: '6874b488e8d5483ad607a067', name: 'Customer Service', keyword: 'customer' },
      { id: '6874b488e8d5483ad607a068', name: 'Education', keyword: 'education' },
      { id: '6874b488e8d5483ad607a069', name: 'Engineering', keyword: 'engineering' },
      { id: '6874b488e8d5483ad607a06a', name: 'Finance', keyword: 'finance' },
      { id: '6874b488e8d5483ad607a06b', name: 'Healthcare', keyword: 'healthcare' },
      { id: '6874b488e8d5483ad607a06c', name: 'Hospitality', keyword: 'hospitality' },
      { id: '6874b488e8d5483ad607a06d', name: 'Human Resources', keyword: 'hr' },
      { id: '6874b488e8d5483ad607a06e', name: 'Information Technology', keyword: 'it' },
      { id: '6874b488e8d5483ad607a06f', name: 'Legal', keyword: 'legal' },
      { id: '6874b488e8d5483ad607a070', name: 'Marketing', keyword: 'marketing' },
      { id: '6874b488e8d5483ad607a071', name: 'Real Estate', keyword: 'realestate' },
      { id: '6874b488e8d5483ad607a072', name: 'Sales', keyword: 'sales' },
      { id: '6874b488e8d5483ad607a073', name: 'Supply Chain & Logistics', keyword: 'logistics' }
    ];

    const randomDomain = domains[Math.floor(Math.random() * domains.length)];

    // Store selected domain for later use
    cy.wrap(randomDomain).as('selectedDomain');

    // Select domain
    cy.get('select').eq(0).select(randomDomain.id);

    cy.log(`Step 2 - Domain: ${randomDomain.name}`);

    cy.wait(1000);

    // Wait for role dropdown to be enabled and populated
    cy.get('select').eq(1).should('not.be.disabled');
    
    // Select first available role (since roles depend on domain)
    cy.get('select').eq(1).find('option').then($options => {
      const availableRoles = [];
      $options.each((index, option) => {
        if (option.value && option.value !== '') {
          availableRoles.push({ value: option.value, text: option.text });
        }
      });
      
      if (availableRoles.length > 0) {
        const randomRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
        cy.get('select').eq(1).select(randomRole.value);
        cy.log(`Selected Role: ${randomRole.text}`);
      }
    });

    cy.wait(500);

    // Click Next button
    cy.get('button[type="button"]')
      .contains('Next')
      .invoke('removeAttr', 'disabled')
      .click();

    cy.wait(1000);

    // ========== STEP 3: Skills Selection ==========
    cy.log('=== Step 3: Adding Skills ===');

    // Wait for third form
    cy.contains('How should we generate your interview questions?').should('be.visible');

    // Select "Add Skills" radio button
    cy.get('input[type="radio"][value="skills-based"]').check();

    cy.wait(500);

    // Get all recommended skill buttons and click 3 random ones
    cy.get('div.flex.flex-wrap.gap-2 button[type="button"]').then($buttons => {
      // Convert to array and shuffle
      const buttons = Array.from($buttons);
      const shuffled = buttons.sort(() => Math.random() - 0.5);
      
      // Click first 3 random buttons
      for (let i = 0; i < Math.min(3, shuffled.length); i++) {
        cy.wrap(shuffled[i]).click();
        cy.log(`Added skill: ${shuffled[i].textContent}`);
        cy.wait(300);
      }
    });

    cy.log('Added 3 random recommended skills');

    cy.wait(500);

    // Enable and click Start Interview button
    cy.get('button[type="submit"]')
      .contains('Start Interview')
      .invoke('removeAttr', 'disabled')
      .click();

    cy.log('=== Interview Setup Complete ===');

    cy.wait(3000);

    // ========== STEP 4: Camera should auto-start with permissions ==========
    cy.log('=== Step 4: Camera Auto-Starting ===');

    // Wait for camera to initialize
    cy.wait(2000);

    // Verify camera is working by checking if "Camera is off" text disappears
    cy.get('body').then($body => {
      if ($body.text().includes('Camera is off')) {
        cy.log('Warning: Camera may not have started automatically');
      } else {
        cy.log('Camera started successfully');
      }
    });

    cy.log('=== Interview Ready ===');

    cy.wait(2000);

    // ========== STEP 5: Answer Interview Questions ==========
    cy.log('=== Step 5: Answering Interview Questions ===');

    // Get the selected domain
    cy.get('@selectedDomain').then((selectedDomain) => {
      const domainKeyword = selectedDomain.keyword;
      cy.log(`Answering questions for domain: ${selectedDomain.name}`);

    // Track used answers to avoid repetition
    const usedAnswers = new Set();

    // Function to answer a question
    const answerQuestion = (questionNumber) => {
      cy.log(`Answering Question ${questionNumber}`);
      
      // Wait for question to appear
      cy.contains(`Question ${questionNumber} of`, { timeout: 10000 }).should('be.visible');
      
      // Wait for question to fully load and display
      cy.wait(3000);
      cy.log('Question displayed - waiting before answering');
      
      // Read the question text
      cy.get('body').then($body => {
        // Extract question text
        const questionText = $body.text();
        cy.log(`Question text detected: ${questionText.substring(0, 100)}...`);
        
        // Domain-specific answer banks
        const domainAnswers = {
          design: {
            introduce: [
              "I'm a creative professional with 4 years of experience in graphic design and UI/UX. I specialize in creating visually compelling designs that effectively communicate brand messages. My work spans print, digital, and motion graphics.",
              "I have a strong background in visual design with expertise in Adobe Creative Suite, Figma, and Sketch. I've worked on branding projects for startups and established companies, focusing on creating cohesive visual identities.",
              "As a designer, I'm passionate about solving problems through visual communication. I have experience in typography, color theory, and layout design. I've led design projects from concept to final delivery.",
              "I'm a versatile designer with experience across multiple mediums including web, mobile, print, and video. I believe great design balances aesthetics with functionality and always keeps the end user in mind.",
              "With a background in both traditional and digital design, I bring a unique perspective to every project. I'm skilled at translating complex ideas into simple, elegant visual solutions."
            ],
            technical: [
              "I'm proficient in Adobe Photoshop, Illustrator, InDesign, After Effects, and Premiere Pro. I also use Figma for UI/UX design and prototyping. I understand design systems, responsive design principles, and accessibility standards.",
              "My toolkit includes the full Adobe Creative Suite, Sketch, Figma, and prototyping tools like Principle and InVision. I'm also familiar with HTML/CSS for web design and have basic knowledge of motion graphics.",
              "I work extensively with industry-standard design tools and stay updated with the latest design trends. I'm skilled in creating wireframes, mockups, style guides, and design documentation.",
              "I'm experienced with design collaboration tools like Abstract and Zeplin. I understand version control for design files and can work effectively with development teams to ensure pixel-perfect implementation.",
              "Beyond design tools, I have knowledge of user research methodologies, A/B testing, and analytics to make data-driven design decisions."
            ],
            project: [
              "I redesigned a complete brand identity for a tech startup, including logo, color palette, typography, and marketing materials. The rebrand increased their social media engagement by 150% and helped them secure Series A funding.",
              "I led the UI/UX design for a mobile banking app serving 100K+ users. I conducted user research, created personas, designed the interface, and worked closely with developers. The app achieved a 4.6-star rating.",
              "I designed packaging and marketing materials for a consumer product launch. My designs helped the product stand out on shelves and contributed to exceeding first-quarter sales targets by 40%.",
              "I created a comprehensive design system for an e-commerce platform that unified their brand across web, mobile, and marketing channels. This reduced design inconsistencies by 80%.",
              "I designed an award-winning magazine layout that improved readability and visual appeal. The redesign led to a 25% increase in subscriptions within three months."
            ],
            challenge: [
              "A major challenge was creating a design system that worked across web, mobile, and print. I researched best practices, created comprehensive guidelines, and collaborated with developers to ensure consistency. This reduced design time by 30%.",
              "I faced tight deadlines on a campaign redesign. I prioritized tasks, communicated clearly with stakeholders, and delivered quality work on time. The campaign won a regional design award.",
              "Balancing client vision with design best practices was challenging. I learned to present multiple options, explain design decisions with data, and find creative solutions that satisfied both aesthetics and functionality.",
              "I had to redesign an entire website with limited resources. I created modular components that could be reused, which saved development time and maintained design consistency throughout.",
              "Working with a difficult stakeholder who kept changing requirements taught me to document decisions clearly and set expectations early in the process."
            ],
            default: [
              "I approach this by first understanding the design brief and target audience thoroughly. Then I research, sketch concepts, iterate based on feedback, and refine until achieving the desired result that meets both aesthetic and functional requirements.",
              "My process involves gathering inspiration, creating mood boards, developing initial concepts, and presenting options with clear rationale. I believe in collaborative design and incorporating feedback while maintaining design integrity.",
              "I would start with user research and competitive analysis, then move to wireframing and prototyping. I'd test designs with users, iterate based on feedback, and work closely with developers to ensure proper implementation.",
              "I believe in starting with the problem, not the solution. I'd ask questions, understand constraints, explore multiple directions, and present solutions that are both creative and strategically sound.",
              "My approach combines creativity with strategic thinking. I consider brand guidelines, user needs, technical constraints, and business goals to create designs that are beautiful and effective."
            ]
          },
          customer: {
            introduce: [
              "I have 5 years of customer service experience across retail, call centers, and chat support. I'm skilled at resolving complex issues, de-escalating tense situations, and ensuring customer satisfaction while maintaining company policies.",
              "I'm a customer service professional passionate about helping people and solving problems. I've handled high-volume support queues, trained new team members, and consistently exceeded satisfaction targets.",
              "My background includes frontline customer support and team leadership. I believe in empathetic communication, active listening, and going above and beyond to create positive customer experiences.",
              "I specialize in multi-channel customer support including phone, email, chat, and social media. I'm known for my patience, problem-solving abilities, and commitment to turning negative experiences into positive ones.",
              "With experience in both B2B and B2C environments, I understand different customer needs and communication styles. I'm dedicated to providing personalized service that builds long-term customer loyalty."
            ],
            technical: [
              "I'm proficient in Zendesk, Salesforce Service Cloud, Freshdesk, and various CRM systems. I'm experienced with live chat platforms, ticketing systems, and have strong knowledge of Microsoft Office and Google Workspace.",
              "I use support tools like Intercom, HubSpot, and Help Scout daily. I'm skilled in typing quickly and accurately, multitasking between systems, and documenting interactions thoroughly for future reference.",
              "My technical skills include CRM management, knowledge base creation, basic troubleshooting, and using analytics tools to track KPIs like response time, resolution rate, and customer satisfaction scores.",
              "I'm experienced with helpdesk software, email management systems, and phone systems. I can quickly learn new tools and adapt to different platforms as needed.",
              "I have certifications in customer service excellence and am proficient in data entry, reporting tools, and customer feedback analysis systems."
            ],
            project: [
              "I led an initiative to reduce average response time from 24 hours to 4 hours by implementing a new ticket prioritization system and creating templates for common issues. Customer satisfaction improved by 35%.",
              "I developed a comprehensive FAQ section and help center that reduced incoming tickets by 40%. I analyzed common queries, wrote clear articles, and organized content for easy navigation.",
              "I handled a major product recall communication, responding to thousands of concerned customers. I maintained professionalism under pressure, provided accurate information, and helped retain customer trust during a crisis.",
              "I trained a team of 10 new customer service representatives, creating training materials and mentoring programs. The team achieved 95% quality scores within their first month.",
              "I implemented a customer feedback system that collected insights from every interaction, leading to product improvements and a 20% reduction in repeat issues."
            ],
            challenge: [
              "Dealing with an extremely upset customer who had a legitimate complaint. I listened actively, apologized sincerely, took ownership, and worked with management to provide a fair solution. The customer later left a 5-star review.",
              "Managing high ticket volumes during peak season while maintaining quality. I organized my workflow, used canned responses effectively, and prioritized urgent cases. I exceeded my resolution targets without sacrificing quality.",
              "Learning a complex product quickly after joining. I studied documentation intensively, shadowed experienced colleagues, asked questions, and created personal notes. Within a month, I was handling advanced queries confidently.",
              "Handling a system outage where I couldn't access customer information. I improvised by taking detailed manual notes, kept customers informed about delays, and followed up once systems were restored.",
              "Dealing with language barriers with international customers. I learned to speak clearly, use simple language, and leverage translation tools to ensure accurate communication."
            ],
            default: [
              "I would handle this by first listening carefully to understand the full situation, showing empathy, and then working systematically to find a solution that satisfies the customer while aligning with company policies.",
              "My approach involves staying calm, gathering all necessary information, consulting resources or colleagues if needed, and communicating clearly throughout. I always follow up to ensure the issue is fully resolved.",
              "I believe in treating each customer as an individual, personalizing my approach, and finding creative solutions when standard procedures don't fit. I'd document everything and escalate appropriately if needed.",
              "I'd start by acknowledging the customer's concern, asking clarifying questions, and setting clear expectations about resolution time. I'd keep them updated throughout the process.",
              "I would use my training and experience to assess the situation quickly, identify the best course of action, and execute it efficiently while maintaining a positive and professional demeanor."
            ]
          },
          engineering: {
            introduce: [
              "I'm a software engineer with 6 years of experience building scalable web applications. I specialize in backend development using Python and Java, with strong knowledge of system design, databases, and cloud infrastructure.",
              "I have extensive experience in full-stack development, working with modern frameworks and technologies. I'm passionate about writing clean, efficient code and solving complex technical challenges.",
              "My engineering background includes both product development and infrastructure work. I've designed APIs, optimized database performance, and implemented CI/CD pipelines for multiple projects.",
              "I'm a solutions-oriented engineer who enjoys tackling difficult problems. I have experience with microservices architecture, distributed systems, and building high-availability applications.",
              "With a strong foundation in computer science fundamentals, I bring both theoretical knowledge and practical experience to every project. I'm committed to continuous learning and staying current with technology trends."
            ],
            technical: [
              "I'm proficient in Python, Java, JavaScript, and Go. I work with frameworks like Django, Spring Boot, React, and Node.js. I have experience with PostgreSQL, MongoDB, Redis, and cloud platforms like AWS and GCP.",
              "My tech stack includes modern development tools, version control with Git, containerization using Docker and Kubernetes, and CI/CD pipelines. I'm experienced with both SQL and NoSQL databases.",
              "I specialize in backend technologies but have full-stack capabilities. I'm skilled in API design, microservices, message queues like RabbitMQ, and monitoring tools like Prometheus and Grafana.",
              "I work with agile methodologies, test-driven development, and follow SOLID principles. I'm experienced in code reviews, technical documentation, and mentoring junior developers.",
              "My expertise includes cloud architecture, serverless computing, database optimization, caching strategies, and performance tuning for high-traffic applications."
            ],
            project: [
              "I architected and built a payment processing system handling 1M+ transactions daily. I implemented retry logic, idempotency, and comprehensive monitoring, achieving 99.99% uptime.",
              "I led the migration of a monolithic application to microservices, improving deployment frequency from monthly to daily while reducing system downtime by 70%.",
              "I developed a real-time analytics platform processing millions of events per second using Kafka and Spark. The system provided insights that increased business revenue by 15%.",
              "I built a recommendation engine using machine learning that increased user engagement by 40%. I optimized the algorithms for performance and integrated them into the production system.",
              "I created a developer platform with APIs and SDKs used by 500+ external developers. I focused on documentation, developer experience, and maintaining backward compatibility."
            ],
            challenge: [
              "Our database was becoming a bottleneck. I implemented read replicas, optimized queries, added proper indexes, and introduced caching layers. Query response time improved from 2 seconds to under 100ms.",
              "We experienced a major security vulnerability. I quickly patched the issue, conducted a full security audit, implemented additional safeguards, and improved our security practices going forward.",
              "Debugging a production issue that only occurred under high load. I used profiling tools, analyzed logs, and discovered a race condition. I fixed it and added comprehensive tests to prevent recurrence.",
              "Integrating with a poorly documented third-party API. I reverse-engineered the behavior through testing, created wrapper libraries, and documented everything for the team.",
              "Meeting aggressive deadlines without compromising quality. I broke down the work, prioritized ruthlessly, automated testing, and coordinated effectively with the team to deliver on time."
            ],
            default: [
              "I would analyze the requirements carefully, consider different architectural approaches, evaluate trade-offs, and choose the solution that best balances performance, maintainability, and scalability.",
              "My approach involves breaking down complex problems into smaller pieces, researching similar solutions, prototyping if needed, and implementing with proper testing and monitoring.",
              "I'd start by understanding the business need, then design a technical solution that's pragmatic and future-proof. I'd consider edge cases, document my decisions, and get feedback from peers.",
              "I believe in iterative development - start with an MVP, gather feedback, and improve incrementally. I'd focus on code quality, testing, and making it easy for others to understand and maintain.",
              "I would research best practices, consider our existing infrastructure, evaluate risks, and implement a solution that's both technically sound and aligned with business objectives."
            ],
        },
          finance: [
            "I'm a finance professional with expertise in financial analysis, budgeting, and forecasting. I have 5 years of experience in corporate finance and hold a CFA certification. I'm skilled at interpreting financial data to drive business decisions.",
            "My background includes investment banking, portfolio management, and financial modeling. I'm proficient in Excel, Bloomberg Terminal, and financial software. I excel at analyzing market trends and making data-driven recommendations.",
            "I specialize in financial planning and analysis with experience across multiple industries. I've managed budgets exceeding $50M, conducted variance analysis, and presented insights to C-level executives."
          ],
          healthcare: [
            "I'm a healthcare professional with 7 years of experience in patient care and clinical operations. I'm committed to providing compassionate, high-quality care while maintaining strict adherence to safety protocols and regulations.",
            "My background includes both direct patient care and healthcare administration. I'm skilled in electronic health records, patient communication, and coordinating care across multidisciplinary teams.",
            "I have extensive experience in healthcare delivery with focus on improving patient outcomes. I stay current with medical best practices, regulations, and am passionate about patient advocacy and quality care."
          ],
          hospitality: [
            "I have 5 years of experience in the hospitality industry, working in hotels and restaurants. I excel at creating memorable guest experiences, managing operations efficiently, and leading teams to deliver exceptional service.",
            "My hospitality career spans front desk operations, guest services, and event coordination. I'm skilled at multitasking in fast-paced environments, problem-solving on the fly, and ensuring guest satisfaction.",
            "I'm passionate about hospitality and creating welcoming environments. I have experience in customer service, operations management, and staff training. I believe in going the extra mile for every guest."
          ],
          hr: [
            "I'm an HR professional with 6 years of experience in talent acquisition, employee relations, and performance management. I'm skilled at building positive workplace cultures and aligning HR strategies with business objectives.",
            "My background includes full-cycle recruiting, onboarding, and HR operations. I'm experienced with HRIS systems, employment law compliance, and developing training programs that enhance employee performance.",
            "I specialize in strategic HR with focus on employee engagement and organizational development. I've implemented HR initiatives that improved retention by 25% and streamlined recruitment processes."
          ],
          it: [
            "I'm an IT professional with 5 years of experience in system administration, network management, and technical support. I'm skilled at troubleshooting complex issues, maintaining infrastructure, and implementing security best practices.",
            "My background includes cloud computing, cybersecurity, and IT project management. I'm experienced with AWS, Azure, and various enterprise software. I excel at optimizing IT operations and supporting business needs.",
            "I specialize in IT infrastructure and support with experience managing servers, networks, and end-user systems. I'm passionate about leveraging technology to improve business efficiency and security."
          ],
          legal: [
            "I'm a legal professional with 4 years of experience in contract law and corporate legal matters. I'm skilled at legal research, drafting documents, and providing practical legal advice that supports business objectives.",
            "My background includes litigation support, compliance, and regulatory matters. I'm detail-oriented, analytical, and experienced in managing multiple cases while meeting strict deadlines.",
            "I have strong experience in legal analysis and risk assessment. I'm proficient in legal research tools and have successfully handled complex legal matters while maintaining confidentiality and professional ethics."
          ],
          marketing: [
            "I'm a marketing professional with 5 years of experience in digital marketing, content strategy, and campaign management. I'm data-driven and have successfully increased brand awareness and lead generation for multiple companies.",
            "My background includes SEO, social media marketing, email campaigns, and paid advertising. I'm experienced with Google Analytics, marketing automation tools, and creating compelling content that converts.",
            "I specialize in integrated marketing strategies that drive ROI. I've managed budgets exceeding $500K, launched successful product campaigns, and grown social media followings by 200%."
          ],
          realestate: [
            "I'm a real estate professional with 6 years of experience in residential and commercial properties. I'm skilled at market analysis, client relationship management, and negotiating favorable deals.",
            "My background includes property management, leasing, and real estate sales. I have strong knowledge of local markets, financing options, and am committed to helping clients make informed property decisions.",
            "I specialize in real estate with proven track record of closing deals and exceeding sales targets. I'm excellent at networking, understanding client needs, and providing exceptional service throughout the buying/selling process."
          ],
          sales: [
            "I'm a sales professional with 7 years of B2B and B2C sales experience. I consistently exceed quotas through consultative selling, relationship building, and deep product knowledge. I've closed deals worth over $2M.",
            "My background includes inside sales, field sales, and account management. I'm skilled at prospecting, presentations, objection handling, and closing. I believe in adding value to customers and building long-term partnerships.",
            "I have a proven track record in sales with expertise in pipeline management, CRM systems, and sales forecasting. I'm motivated by targets, enjoy the challenge of competitive markets, and thrive on achieving results."
          ],
          logistics: [
            "I have 5 years of experience in supply chain and logistics management. I'm skilled at optimizing operations, managing inventory, coordinating shipments, and reducing costs while maintaining service quality.",
            "My background includes warehouse management, transportation coordination, and vendor relations. I'm experienced with logistics software, data analysis, and implementing process improvements.",
            "I specialize in supply chain optimization with experience in demand forecasting, inventory control, and distribution. I've successfully reduced lead times by 30% and improved delivery accuracy to 99%."
          ]
        };
        
        // Get domain-specific answers or use general ones
        let answerBank = domainAnswers[domainKeyword] || domainAnswers.engineering;
        
        // If answer bank is an array (single category), convert to object format
        if (Array.isArray(answerBank)) {
          answerBank = {
            introduce: answerBank,
            technical: answerBank,
            project: answerBank,
            challenge: answerBank,
            default: answerBank
          };
        }
        
        // Determine question category
        let answer = '';
        let category = 'default';
        
        const lowerText = questionText.toLowerCase();
        
        if (lowerText.includes('introduce') || lowerText.includes('background') || lowerText.includes('tell me about yourself') || lowerText.includes('experience')) {
          category = 'introduce';
        } else if (lowerText.includes('technical') || lowerText.includes('skills') || lowerText.includes('technologies') || lowerText.includes('tools')) {
          category = 'technical';
        } else if (lowerText.includes('project') || lowerText.includes('worked on') || lowerText.includes('experience with')) {
          category = 'project';
        } else if (lowerText.includes('challenge') || lowerText.includes('problem') || lowerText.includes('difficult') || lowerText.includes('overcome')) {
          category = 'challenge';
        }
        
        // Get answer from category or default
        const categoryAnswers = answerBank[category] || answerBank.default;
        
        // Find an answer that hasn't been used yet
        let answer = '';
        let availableAnswers = categoryAnswers.filter(ans => !usedAnswers.has(ans));
        
        // If all answers in this category have been used, use any available answer from other categories
        if (availableAnswers.length === 0) {
          cy.log('All answers in category used, finding from other categories');
          const allAnswers = [
            ...(answerBank.introduce || []),
            ...(answerBank.technical || []),
            ...(answerBank.project || []),
            ...(answerBank.challenge || []),
            ...(answerBank.default || [])
          ];
          availableAnswers = allAnswers.filter(ans => !usedAnswers.has(ans));
        }
        
        // If somehow all answers are used (shouldn't happen with enough variety), generate a unique one
        if (availableAnswers.length === 0) {
          answer = `Based on my experience in ${selectedDomain.name}, I have developed strong skills and expertise over the years. I approach challenges systematically, focusing on delivering quality results. I'm passionate about continuous learning and staying updated with industry trends. My work ethic and dedication have consistently helped me exceed expectations and contribute meaningfully to team success. Question ${questionNumber} - ${Date.now()}`;
          cy.log('Generated unique fallback answer');
        } else {
          // Select random answer from available ones
          answer = availableAnswers[Math.floor(Math.random() * availableAnswers.length)];
        }
        
        // Mark this answer as used
        usedAnswers.add(answer);
        
        cy.log(`Category: ${category}, Domain: ${domainKeyword}, Used ${usedAnswers.size}/5 answers`);
        
        // Type the answer
        cy.get('textarea, input[type="text"]').first().clear().type(answer, { delay: 30 });
        cy.log(`Typed domain-specific answer (${answer.length} chars)`);
      });
      
      cy.wait(2000);
      
      // Click "Post Answer" button
      cy.contains('button', 'Post Answer').should('be.visible').click();
      cy.log('Posted answer');
      
      cy.wait(2000);
      
      // Wait for feedback and "Answer Submitted" message
      cy.contains('Answer Submitted', { timeout: 30000 }).should('be.visible');
      cy.log('Answer submitted confirmation received');
      
      cy.wait(1000);
      
      // Click "Next Question" button (skip for last question)
      if (questionNumber < 5) {
        cy.contains('button', 'Next Question').should('be.visible').click();
        cy.log('Clicked Next Question');
        cy.wait(2000);
      } else {
        cy.log('Last question answered - looking for Get Assessment button');
        cy.wait(2000);
      }
    };

    // Answer all 5 questions
    for (let i = 1; i <= 5; i++) {
      answerQuestion(i);
    }

    cy.log('=== All Questions Answered ===');
    
    cy.wait(3000);
    
    // ========== STEP 6: Click Get Assessment ==========
    cy.log('=== Step 6: Getting Assessment ===');
    
    // Click "Get Assessment!" button
    cy.contains('button', 'Get Assessment!').should('be.visible').click();
    cy.log('Clicked Get Assessment button');
    
    cy.wait(3000);
    
    cy.log('=== Interview Complete - Assessment Retrieved ===');
    }); // End of cy.get('@selectedDomain')
  });
});
export {}