describe('TruScholar Wallet — Complete End-to-End Resume Flow', () => {

  it('should log in, open TruResume, and fill resume form successfully', () => {

    // === Setup ===
    cy.viewport(1200, 700);
    cy.visit('https://wallet.truscholar.io/signin');

    // === Step 1: Login ===
    cy.get('input[name="email"]', { timeout: 20000 })
      .should('be.visible')
      .type('starishita9900@gmail.com');

    cy.get('input[name="password"]', { timeout: 20000 })
      .should('be.visible')
      .type('Sushil@23');

    cy.get('button[type="submit"]').should('be.visible').click();

    // Wait for dashboard to load
    cy.contains('Dashboard', { timeout: 40000 }).should('be.visible');

    // === Step 2: Navigate to TruResume ===
    cy.contains('a', 'TruResume', { timeout: 30000 })
      .should('be.visible')
      .click();

    cy.url({ timeout: 20000 }).should('include', '/resumes');

    // === Step 3: Start Resume Builder ===
    cy.contains('h3', 'Create Resume', { timeout: 30000 })
      .should('be.visible')
      .click();

    cy.contains('button', 'Start Building', { timeout: 30000 }).click();
//cy.get(':nth-child(1) > .flex-col > .relative > .absolute > .focus-visible\:ring-ring').click()
    // Wait for Resume Builder form to load
    cy.contains('h3', 'AI Powered Resume', { timeout: 40000 }).click();
    //  .should('be.visible');

    // === Step 4: Fill Resume Form ===

    // Title / Role
    cy.get('input[name="title"]', { timeout: 40000 })
      .should('be.visible')
      .clear({ force: true })
      .type('QA', { force: true });

    // First Name
    cy.get('input[name="fname"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('Priya', { force: true });

    // Last Name
    cy.get('input[name="lname"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('Kurai', { force: true })
      .should('have.value', 'Kurai');

    // Email
    cy.get('input[name="email"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('Priyakurai22@gmail.com', { force: true })
      .should('have.value', 'Priyakurai22@gmail.com');

    // Phone
    cy.get('input[name="phone"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('9359668065', { force: true })
      //.should('have.value', '9359668065');

    // City
    cy.get('input[name="city"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('Mumbai', { force: true })
      .should('have.value', 'Mumbai');

    // Country
    cy.get('input[name="country"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('India', { force: true })
      .should('have.value', 'India');

    // === Step 5: Summary Section ===
   // Wait for the editor to exist and be visible
cy.get('div.tiptap.ProseMirror[contenteditable="true"]', { timeout: 15000 })
  .should('exist')
  .first()                // 👈 ensures only one element is selected
  .scrollIntoView()
  .should('be.visible')
  .click({ force: true })
  .clear({ force: true })
  .type(
    'A QA (Quality Assurance) professional ensures that software meets quality standards by identifying defects, documenting findings, and collaborating with development teams to implement fixes.',
    { force: true }
  )
  .should('contain.text', 'A QA (Quality Assurance) professional');


    // === Step 6: Education Section ===
    cy.get('input[name="0.program"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('Bachelors', { force: true })
      .should('have.value', 'Bachelors');

    cy.get('input[name="0.specialization"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('Computer Science', { force: true })
      .should('have.value', 'Computer Science');

    cy.get('input[name="0.institution"]', { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('Amravati University', { force: true })
      .should('have.value', 'Amravati University');

    // Credential Dropdown
  cy.get('#radix-\\:r6i\\: > .pb-4 > .grid > .space-y-2 > .flex')
  //.should('be.visible')
  .click({ force: true });
    cy.contains('[role="option"]', 'SEMESTER I', { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });

    // Education City
    cy.get('#radix-\\:r6i\\: > .pb-4 > .grid > :nth-child(5) > .relative > [name="0.city"]')
      .clear({ force: true })

      .type('Mumbai', { force: true })
      .should('have.value', 'Mumbai');

    // Education Country
    cy.get('#radix-\\:r6i\\: > .pb-4 > .grid > :nth-child(6) > .relative > [name="0.country"]')
  .should('exist')
  .scrollIntoView()
  .click({ force: true })
  .clear({ force: true })
  .type('India', { force: true })
  .should('have.value', 'India');

    // Date Picker (if present)
    //cy.get('div.react-datepicker-wrapper input', { timeout: 10000 }).first().scrollIntoView().click({ force: true });
     // cy.get('.react-datepicker__month-9').click()
     // Open datepicker
cy.get('div.react-datepicker-wrapper input', { timeout: 10000 })
  .first()
  .scrollIntoView()
  .click({ force: true });

// Scroll to month element & click
cy.get('.react-datepicker__month-text')
  .contains('Oct')
  .scrollIntoView()
  .click({ force: true });
// Step 1: Open the second date picker input
cy.get('div.react-datepicker-wrapper input', { timeout: 10000 })
  .eq(1) // 👈 selects the second element
  .scrollIntoView()
  .click({ force: true });

// Step 2: Scroll to month element & click "Oct"
cy.get('.react-datepicker__month-text')
  .contains('Oct')
  .scrollIntoView()
  .click({ force: true });

  cy.get('[name="0.score"]', { timeout: 10000 })
  .should('exist')
  .scrollIntoView()
  .clear({ force: true })
  .type('9', { force: true })
  .should('have.value', '9');
 

  cy.get('[name="0.title"]', { timeout: 10000 })
  .should('exist')
  .scrollIntoView()
  .clear({ force: true })
  .type('Test Engineer', { force: true })
  .should('have.value', 'Test Engineer');

  cy.get('[name="0.company"]', { timeout: 10000 })
  .should('exist')
  .scrollIntoView()
  .clear({ force: true })
  .type('Truscholar', { force: true })
  .should('have.value', 'Truscholar');
 

  // Step 1: Click the dropdown
cy.get('#radix-\\:r73\\: > .pb-4 > .grid > .space-y-2 > .flex', { timeout: 10000 })
  .should('exist')
  .scrollIntoView()
  .click({ force: true });

// Step 2: Select the 2nd option from dropdown
cy.get('[role="option"]')  // Most Radix dropdowns use role="option"
  .eq(2)                   // 👈 0-based index: 0 = first, 1 = second
  .click({ force: true });

  cy.get('#radix-\\:r73\\: > .pb-4 > .grid > :nth-child(5) > .relative > [name="0.city"]', { timeout: 10000 })
  .should('exist')
  .scrollIntoView()
  .clear({ force: true })
  .type('Pune', { force: true })
  .should('have.value', 'Pune');
 
    cy.get('#radix-\\:r73\\: > .pb-4 > .grid > :nth-child(6) > .relative > [name="0.country"]', { timeout: 10000 })
  .should('exist')
  .scrollIntoView()
  .clear({ force: true })
  .type('India', { force: true })
  .should('have.value', 'India');

cy.get('div.tiptap.ProseMirror[contenteditable="true"]', { timeout: 15000 })
  .should('exist')
  .eq(1)                // 👈 ensures only one element is selected
  .scrollIntoView()
  .should('be.visible')
  .click({ force: true })
  .clear({ force: true })

  
  .type(
    'A test engineer job description involves designing and executing tests to ensure product quality, functionality, and reliability through rigorous quality assurance processes. Key responsibilities include creating test plans and cases, identifying and tracking defects, performing various types of testing (like functional, performance, and security), and collaborating with development teams to resolve issues and improve the product. They also document their findings, report results, and suggest improvements to the design and development process.',
    { force: true }
  )
  .should('contain.text', 'A test engineer job description');

cy.get('.flex-col.gap-2 > .space-y-\\[8px\\] > .relative > .jsx-226ef366f5e770aa', { timeout: 10000 })
  .should('exist')
  .scrollIntoView()
  .click({ force: true })
  .clear({ force: true })
  .type('front end', { force: true })
  .should('have.value', 'front end');

const skills = ['test', 'automation', 'manual']; // 👈 your 3 skills to select

skills.forEach((skill) => {
  cy.get('input[cmdk-input]', { timeout: 10000 })
    .should('exist')
    .scrollIntoView()
    .click({ force: true })
    .clear({ force: true })
    .type(`${skill}`, { force: true });

  // wait for dropdown and select first matching item
  cy.get('.cmdk-item, [cmdk-item], [role="option"]', { timeout: 10000 })
    .should('be.visible')
    .first()
    .click({ force: true });

  cy.wait(500); // small delay to let UI update

});
cy.get('[name="0.network"]', { timeout: 10000 })
  .should('be.visible')
  .scrollIntoView()
  .click({ force: true })
  .clear({ force: true })
  .type('LinkedIn', { force: true })
  .should('have.value', 'LinkedIn');

cy.get('[name="0.username"]', { timeout: 10000 })
  .should('be.visible')
  .scrollIntoView()
  .click({ force: true })
  .clear({ force: true })
  .type('priyanka kurai', { force: true })
  .should('have.value', 'priyanka kurai');

cy.get('[name="0.url"]', { timeout: 10000 })
  .should('be.visible')
  .scrollIntoView()
  .click({ force: true })
  .clear({ force: true })
  .type('https://example.com', { force: true })
  .should('have.value', 'https://example.com');


  cy.get('.gap-3 > .flex-wrap > :nth-child(2)', { timeout: 10000 })
  .should('be.visible')
  .scrollIntoView()
  .click({ force: true });

  cy.get('.justify-between > .flex-col > .flex-wrap > *', { timeout: 10000 })
  .should('have.length.greaterThan', 2)
  .then(($items) => {
    for (let i = 0; i < 3; i++) {
      cy.wrap($items[i]).scrollIntoView().click({ force: true });
    }
  });


  cy.get('.jsx-cd1952954e1a9b95.gap-3 > .flex-wrap > :nth-child(4)', { timeout: 10000 })
  .should('be.visible')
  .scrollIntoView()
  .click({ force: true });

  cy.get('.my-2 > *', { timeout: 10000 }) // get all children
  .should('have.length.at.least', 3)    // ensure at least 3 exist
  .then(($items) => {
    for (let i = 0; i < 3; i++) {
      cy.wrap($items[i])
        .scrollIntoView()
        .click({ force: true }); // click each safely
    }
  });

  //  cy.get('.sticky > :nth-child(2) > .flex-wrap', { timeout: 10000 })
  //.should('be.visible')
  //.scrollIntoView()
  //.click({ force: true })
  //.clear({ force: true })
  //.type('My_Resume', { force: true })
  //.should('have.value', 'My_Resume');

cy.get('.bg-primary', { timeout: 10000 })
  .should('be.visible')
  .scrollIntoView()
  .click({ force: true });



});
});
export {}

