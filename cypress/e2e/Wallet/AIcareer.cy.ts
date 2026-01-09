describe('TruScholar Wallet — AI Career Test navigation', () => {
  it('should log in and click on AI Career Test successfully', () => {

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

    cy.contains('Dashboard', { timeout: 40000 }).should('be.visible');

    // === Step 2: Navigate to TruScholar AI section ===
    cy.contains('a', 'TruScholar AI')
      .should('be.visible')
      .click();

    // === Step 3: Prevent new tab opening ===
    cy.window().then((win) => {
      cy.stub(win, 'open').callsFake((url) => {
        win.location.href = url; // 🔥 force same-tab navigation
      });
    });

    // === Step 4: Click on AI Career Test (Beta) ===
    cy.contains('h3', 'AI Career Test (Beta)')
      .should('be.visible')
      .click();

    // === Step 5: Interact with new origin ===
    cy.origin('https://beta.aicareercoach.truscholar.io', () => {
      cy.get('button', { timeout: 15000 })
        .contains('Find Your Career Path')
        .should('be.visible')
        .click();

            cy.get('input[placeholder="Enter 10-digit phone number"]')
      .type('9985856856')
      .should('have.value', '9985856856');


        cy.get('input[placeholder="Enter your full name"]')
      .type('Rahul')
      .should('have.value', 'Rahul');

       cy.get('input[placeholder="Enter your age"]')
      .type('25')
      .should('have.value', '25');

        cy.get('input[placeholder="Enter your email address"]')
      .type('priyakurai222@gmail.com')
      .should('have.value', 'priyakurai222@gmail.com');

         cy.get('select.w-full')
      .select('job_seeker')
      .should('have.value', 'job_seeker');

      cy.get('input[placeholder="e.g., Bachelor of Engineering, MBA, etc."]')
  .should('be.visible')
  .type('MBA');


          cy.contains('button', 'Start Assessment').click();

              // === Step 6: Wait for the new page to load ===
      cy.url({ timeout: 20000 }).should('include', '/career-test/assessment');
//Q1

          cy.wait(100); // Wait for 5 seconds to observe the result
          cy.contains('button', 'A tech lab with cutting-edge equipment and tools')
  .should('be.visible')
  .click();

 cy.contains('button', 'Next')
  .should('be.visible')
  .click();
//Q2
  cy.contains('p','Analyzing data and conducting research to find insights')
  .should('be.visible')        // Make sure it's visible
  .click({ force: true });  

  cy.contains('button', 'Next').click();

//Q3
  cy.contains('button', 'Enhancing creative and design thinking')
  .should('be.visible')
  .click({ force: true });

  
  cy.contains('button', 'Next').click();
//Q4
  cy.contains('button', 'Software Developer or Engineer')
  .should('be.visible')
  .click({ force: true });

   cy.contains('button', 'Next').click();
   //Q5
 cy.contains('button', 'Artificial Intelligence & Machine Learning', { timeout: 20000 })
  .should('be.visible')
  .click({ force: true });
    cy.contains('button', 'Next').click();
    //Q6
    cy.contains('button', "Making a difference in people's lives and communities")
  .should('be.visible')
  .click({ force: true });
    cy.contains('button', 'Next').click();
    //Q7
    cy.contains('button', 'Starting my own business or venture')
  .should('be.visible')
  .click({ force: true });
    cy.contains('button', 'Next').click();
    //Q8
   cy.get('div.bg-orange-500.text-white.px-3.py-1.rounded-lg.text-sm.font-semibold.shadow-lg')
  .should('be.visible')
  .and('contain.text', '77');
    cy.contains('button', 'Next').click();

    cy.get('div.bg-orange-500.text-white.px-3.py-1.rounded-lg.text-sm.font-semibold.shadow-lg')
  .should('be.visible')
  .and('contain.text', '77')
  .click({ force: true });
 cy.contains('button', 'Next').click();

      
    });
  });
});
export {}