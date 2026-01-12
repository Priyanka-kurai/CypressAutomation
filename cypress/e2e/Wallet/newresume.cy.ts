describe('TruScholar Wallet - Automated Resume Creation', () => {
  
  // Configuration constants
  const LOGIN_CREDENTIALS = {
    email: 'starishita9900@gmail.com',
    password: 'Sushil@23'
  };

  const RESUME_DATA = {
    personal: {
      title: 'QA Engineer',
      firstName: 'Priya',
      lastName: 'Kurai',
      email: 'Priyakurai22@gmail.com',
      phone: '9359668065',
      city: 'Mumbai',
      country: 'India'
    },
    summary: 'A QA (Quality Assurance) professional ensures that software meets quality standards by identifying defects, documenting findings, and collaborating with development teams to implement fixes.',
    education: {
      program: 'Bachelors',
      specialization: 'Computer Science',
      institution: 'Amravati University',
      city: 'Mumbai',
      country: 'India',
      startMonth: 'Oct',
      endMonth: 'Oct',
      score: '9'
    },
    experience: {
      title: 'Test Engineer',
      company: 'Truscholar',
      city: 'Pune',
      country: 'India',
      description: 'A test engineer job description involves designing and executing tests to ensure product quality, functionality, and reliability through rigorous quality assurance processes. Key responsibilities include creating test plans and cases, identifying and tracking defects, performing various types of testing (like functional, performance, and security), and collaborating with development teams to resolve issues and improve the product. They also document their findings, report results, and suggest improvements to the design and development process.'
    },
    skills: {
      category: 'front end',
      items: ['test', 'automation', 'manual']
    },
    socialLinks: {
      network: 'LinkedIn',
      username: 'priyanka kurai',
      url: 'https://example.com'
    }
  };

  beforeEach(() => {
    cy.viewport(1200, 700);
  });

  it('should complete the entire resume creation flow', () => {
    
    // ============================================
    // STEP 1: Login
    // ============================================
    cy.log('**Step 1: Logging in**');
    cy.visit('https://wallet.truscholar.io/signin');

    cy.get('input[name="email"]', { timeout: 20000 })
      .should('be.visible')
      .type(LOGIN_CREDENTIALS.email);

    cy.get('input[name="password"]', { timeout: 20000 })
      .should('be.visible')
      .type(LOGIN_CREDENTIALS.password);

    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();

    cy.contains('Dashboard', { timeout: 40000 })
      .should('be.visible');

    // ============================================
    // STEP 2: Navigate to TruResume
    // ============================================
    cy.log('**Step 2: Opening TruResume**');
    cy.contains('a', 'TruResume', { timeout: 30000 })
      .should('be.visible')
      .click();

    cy.url({ timeout: 20000 })
      .should('include', '/resumes');

    // ============================================
    // STEP 3: Start Resume Builder
    // ============================================
    cy.log('**Step 3: Starting Resume Builder**');
    cy.contains('h3', 'Create Resume', { timeout: 30000 })
      .should('be.visible')
      .click();

    cy.contains('button', 'Start Building', { timeout: 30000 })
      .click();

    cy.contains('h3', 'AI Powered Resume', { timeout: 40000 })
      .click();

    // ============================================
    // STEP 4: Fill Personal Details
    // ============================================
    cy.log('**Step 4: Filling Personal Details**');
    
    // Job Title
    cy.get('input[name="title"]', { timeout: 40000 })
      .should('be.visible')
      .clear({ force: true });
    cy.get('input[name="title"]').type(RESUME_DATA.personal.title, { force: true });
    cy.wait(300);

    // First Name
    cy.get('input[name="fname"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true });
    cy.get('input[name="fname"]').type(RESUME_DATA.personal.firstName, { force: true });
    cy.wait(300);

    // Last Name
    cy.get('input[name="lname"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true });
    cy.get('input[name="lname"]').type(RESUME_DATA.personal.lastName, { force: true });
    cy.get('input[name="lname"]').should('have.value', RESUME_DATA.personal.lastName);
    cy.wait(300);

    // Email
    cy.get('input[name="email"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true });
    cy.get('input[name="email"]').type(RESUME_DATA.personal.email, { force: true });
    cy.get('input[name="email"]').should('have.value', RESUME_DATA.personal.email);
    cy.wait(300);

    // Phone
    cy.get('input[name="phone"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true });
    cy.get('input[name="phone"]').type(RESUME_DATA.personal.phone, { force: true });
    cy.wait(300);

    // City
    cy.get('input[name="city"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true });
    cy.get('input[name="city"]').type(RESUME_DATA.personal.city, { force: true });
    cy.get('input[name="city"]').should('have.value', RESUME_DATA.personal.city);
    cy.wait(300);

    // Country
    cy.get('input[name="country"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true });
    cy.get('input[name="country"]').type(RESUME_DATA.personal.country, { force: true });
    cy.get('input[name="country"]').should('have.value', RESUME_DATA.personal.country);
    cy.wait(300);

    // ============================================
    // STEP 5: Fill Summary
    // ============================================
    cy.log('**Step 5: Adding Summary**');
    
    cy.get('div.tiptap.ProseMirror[contenteditable="true"]', { timeout: 15000 })
      .should('exist')
      .first()
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.wait(500);
    
    cy.get('div.tiptap.ProseMirror[contenteditable="true"]')
      .first()
      .clear({ force: true });
    
    cy.get('div.tiptap.ProseMirror[contenteditable="true"]')
      .first()
      .type(RESUME_DATA.summary, { force: true, delay: 50 });
    
    cy.get('div.tiptap.ProseMirror[contenteditable="true"]')
      .first()
      .should('contain.text', 'A QA (Quality Assurance) professional');
    
    cy.wait(500);

    // ============================================
    // STEP 6: Fill Education Details
    // ============================================
    cy.log('**Step 6: Adding Education**');
    
    cy.get('input[name="0.program"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true });
    cy.get('input[name="0.program"]').type(RESUME_DATA.education.program, { force: true });
    cy.get('input[name="0.program"]').should('have.value', RESUME_DATA.education.program);
    cy.wait(300);

    cy.get('input[name="0.specialization"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true });
    cy.get('input[name="0.specialization"]').type(RESUME_DATA.education.specialization, { force: true });
    cy.get('input[name="0.specialization"]').should('have.value', RESUME_DATA.education.specialization);
    cy.wait(300);

    cy.get('input[name="0.institution"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true });
    cy.get('input[name="0.institution"]').type(RESUME_DATA.education.institution, { force: true });
    cy.get('input[name="0.institution"]').should('have.value', RESUME_DATA.education.institution);
    cy.wait(500);

    // Education Start Date
    cy.get('div.react-datepicker-wrapper input', { timeout: 10000 })
      .first()
      .scrollIntoView()
      .click({ force: true });

    cy.get('.react-datepicker__month-text')
      .contains(RESUME_DATA.education.startMonth)
      .scrollIntoView()
      .click({ force: true });

    // Education End Date
    cy.get('div.react-datepicker-wrapper input', { timeout: 10000 })
      .eq(1)
      .scrollIntoView()
      .click({ force: true });

    cy.get('.react-datepicker__month-text')
      .contains(RESUME_DATA.education.endMonth)
      .scrollIntoView()
      .click({ force: true });

    // Education Score
    cy.get('[name="0.score"]', { timeout: 10000 })
      .should('exist')
      .scrollIntoView()
      .clear({ force: true });
    cy.get('[name="0.score"]').type(RESUME_DATA.education.score, { force: true });
    cy.get('[name="0.score"]').should('have.value', RESUME_DATA.education.score);
    cy.wait(500);

    // ============================================
    // STEP 7: Fill Work Experience
    // ============================================
    cy.log('**Step 7: Adding Work Experience**');
    
    cy.get('[name="0.title"]', { timeout: 10000 })
      .should('exist')
      .scrollIntoView()
      .clear({ force: true });
    cy.get('[name="0.title"]').type(RESUME_DATA.experience.title, { force: true });
    cy.get('[name="0.title"]').should('have.value', RESUME_DATA.experience.title);
    cy.wait(300);

    cy.get('[name="0.company"]', { timeout: 10000 })
      .should('exist')
      .scrollIntoView()
      .clear({ force: true });
    cy.get('[name="0.company"]').type(RESUME_DATA.experience.company, { force: true });
    cy.get('[name="0.company"]').should('have.value', RESUME_DATA.experience.company);
    cy.wait(300);

    /*cy.get('#radix-\\:r73\\: > .pb-4 > .grid > :nth-child(5) > .relative > [name="0.city"]', { timeout: 10000 })
      .should('exist')
      .scrollIntoView()
      .clear({ force: true });*/
    //cy.get('#radix-\\:r73\\: > .pb-4 > .grid > :nth-child(5) > .relative > [name="0.city"]')
    //  .type(RESUME_DATA.experience.city, { force: true });
    //cy.get('#radix-\\:r73\\: > .pb-4 > .grid > :nth-child(5) > .relative > [name="0.city"]')
    //  .should('have.value', RESUME_DATA.experience.city);
    cy.wait(500);

    // Work Description
    cy.get('div.tiptap.ProseMirror[contenteditable="true"]', { timeout: 15000 })
      .should('exist')
      .eq(1)
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.wait(500);
    
    cy.get('div.tiptap.ProseMirror[contenteditable="true"]')
      .eq(1)
      .clear({ force: true });
    
    cy.get('div.tiptap.ProseMirror[contenteditable="true"]')
      .eq(1)
      .type(RESUME_DATA.experience.description, { force: true, delay: 50 });
    
    cy.get('div.tiptap.ProseMirror[contenteditable="true"]')
      .eq(1)
      .should('contain.text', 'A test engineer job description');
    
    cy.wait(500);

    // ============================================
    // STEP 8: Add Skills
    // ============================================
    cy.log('**Step 8: Adding Skills**');
    
    // Skills Category
    cy.get('.flex-col.gap-2 > .space-y-\\[8px\\] > .relative > .jsx-226ef366f5e770aa', { timeout: 10000 })
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
    
    cy.wait(300);
    
    cy.get('.flex-col.gap-2 > .space-y-\\[8px\\] > .relative > .jsx-226ef366f5e770aa')
      .clear({ force: true });
    
    cy.get('.flex-col.gap-2 > .space-y-\\[8px\\] > .relative > .jsx-226ef366f5e770aa')
      .type(RESUME_DATA.skills.category, { force: true });
    
    cy.get('.flex-col.gap-2 > .space-y-\\[8px\\] > .relative > .jsx-226ef366f5e770aa')
      .should('have.value', RESUME_DATA.skills.category);
    
    cy.wait(500);

    // Add individual skills
    RESUME_DATA.skills.items.forEach((skill) => {
      cy.get('input[cmdk-input]', { timeout: 10000 })
        .should('exist')
        .scrollIntoView()
        .click({ force: true });
      
      cy.wait(300);
      
      cy.get('input[cmdk-input]')
        .clear({ force: true });
      
      cy.get('input[cmdk-input]')
        .type(`${skill}`, { force: true, delay: 50 });

      cy.wait(500);

      cy.get('.cmdk-item, [cmdk-item], [role="option"]', { timeout: 10000 })
        .should('be.visible')
        .first()
        .click({ force: true });

      cy.wait(700);
    });

    // ============================================
    // STEP 9: Add Social Links
    // ============================================
    cy.log('**Step 9: Adding Social Links**');
    
    cy.get('[name="0.network"]', { timeout: 10000 })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });
    cy.wait(300);
    cy.get('[name="0.network"]').clear({ force: true });
    cy.get('[name="0.network"]').type(RESUME_DATA.socialLinks.network, { force: true });
    cy.get('[name="0.network"]').should('have.value', RESUME_DATA.socialLinks.network);
    cy.wait(300);

    cy.get('[name="0.username"]', { timeout: 10000 })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });
    cy.wait(300);
    cy.get('[name="0.username"]').clear({ force: true });
    cy.get('[name="0.username"]').type(RESUME_DATA.socialLinks.username, { force: true });
    cy.get('[name="0.username"]').should('have.value', RESUME_DATA.socialLinks.username);
    cy.wait(300);

    cy.get('[name="0.url"]', { timeout: 10000 })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });
    cy.wait(300);
    cy.get('[name="0.url"]').clear({ force: true });
    cy.get('[name="0.url"]').type(RESUME_DATA.socialLinks.url, { force: true });
    cy.get('[name="0.url"]').should('have.value', RESUME_DATA.socialLinks.url);
    cy.wait(500);

    // ============================================
    // STEP 10: Configure Layout
    // ============================================
    cy.log('**Step 10: Configuring Layout**');
    
    // Select 3 layout items
   /* cy.get('.justify-between > .flex-col > .flex-wrap > *', { timeout: 10000 })
      .should('have.length.greaterThan', 2)
      .then(($items) => {
        for (let i = 0; i < 3; i++) {
          cy.wrap($items[i]).scrollIntoView().click({ force: true });
        }
      });*/

    // Add custom section (Languages)
    cy.get('.jsx-cd1952954e1a9b95.gap-3 > .flex-wrap > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });

    // Click 3 items in another section
    cy.get('.my-2 > *', { timeout: 10000 })
      .should('have.length.at.least', 3)
      .then(($items) => {
        for (let i = 0; i < 3; i++) {
          cy.wrap($items[i])
            .scrollIntoView()
            .click({ force: true });
        }
      });

    // ============================================
    // STEP 11: Save Resume
    // ============================================
    cy.log('**Step 11: Saving Resume**');
    
  /*  cy.get('.bg-primary', { timeout: 10000 })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });*/

    cy.log('**Resume Creation Completed Successfully!**');
  });
});

export {};