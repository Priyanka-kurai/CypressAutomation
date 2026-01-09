

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
// === Step 6: Answer all questions dynamically ===
//cy.url({ timeout: 20000 }).should('include', '/career-test/assessment');

// Select a random visible answer option
cy.get('div.space-y-4 button:visible', { timeout: 20000 })
  .should('have.length.at.least', 1)
  .then(($options) => {
    const randomIndex = Math.floor(Math.random() * $options.length);
    cy.wrap($options.eq(randomIndex)).click({ force: true });
  });
 


// Click "Next" when enabled
cy.contains('button', 'Next', { timeout: 30000 })
  .should('not.be.disabled')
  .click({ force: true });

cy.get('.flex.flex-col.sm\\:flex-row.gap-4.items-stretch button:visible')
  .first()
  .scrollIntoView()
  .click({ force: true });

  cy.contains('button', 'Next', { timeout: 30000 })
  .should('not.be.disabled')
  .click({ force: true });


 // Select and click one of the options inside .space-y-3
cy.get('.space-y-3 button', { timeout: 10000 })
  .should('have.length.greaterThan', 0)
  .then(($buttons) => {
    // pick one option — here random, you can set a fixed index instead
    const index = Math.floor(Math.random() * $buttons.length);
    const $option = $buttons.eq(index);

    cy.wrap($option)
      .scrollIntoView()
      .should('be.visible')
      .click('center', { force: true }); // click at center to trigger the React handler
  });

// Wait for UI update (e.g., selection border color changes)
cy.wait(500);

// Click the "Next" button
cy.contains('button', /^Next$/i)
  .scrollIntoView()
  .should('not.be.disabled')
  .click({ force: true });


  // Select any one of the four options inside the .space-y-3 div

  });

})

})
export {}