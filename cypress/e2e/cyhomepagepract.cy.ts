describe('HomePage', () => {
  it('open url and homepage contains welcome', () => {
    cy.visit('https://wallet.truscholar.io/signin')
    cy.get("h3").contains("Welcome")
  })
it('login credentials', () => {
   cy.visit('https://wallet.truscholar.io/signin')
    cy.viewport(1366, 968);
  cy.get('#email',{ timeout: 10000 }).type('starishita9900@gmail.com');
    cy.get('input[name=password]').type('Sushil@23');
    cy.get('button[type=submit]').click();
    cy.contains('button', 'Announcements', { timeout: 30000 })
  .should('be.visible')
  .click();
  cy.get("h2").contains("Announcements").should('be.visible')
  cy.wait(5000);
  cy.get('svg.lucide-x', { timeout: 10000 })
  .should('be.visible')
  .click();
cy.get('div.cursor-pointer.size-10', { timeout: 10000 })
  .should('be.visible')
  .click();
cy.wait(5000);
cy.get('svg.lucide-x.size-6', { timeout: 10000 })
  .should('be.visible')
  .click({ force: true }); // force in case it’s inside a container


   cy.contains('a', 'My Credentials', { timeout: 10000 })
    .should('be.visible')
    .click();
 cy.contains('a', 'View', { timeout: 10000 })
  .should('be.visible')
  .click();

// wait for 5 seconds to ensure download is complete
// Optionally, you can add assertions to verify the file download if needed 
  cy.contains('button', 'Copy Verification Link', { timeout: 10000 })
  .should('be.visible')
  .click();
cy.wait(2000); // wait for 2 seconds to ensure the link is copied  
// assert navigation
cy.url().should('include', '/credentials/certificates/');
cy.contains('button', 'Download', { timeout: 30000 })
  .should('be.visible')
  .click();
cy.wait(5000); 
//click on truresume
   cy.contains('a', 'TruResume', { timeout: 10000 })
  .should('be.visible')
  .click();
  //click on create resume
cy.contains('h3', 'Create Resume', { timeout: 10000 })
  .should('be.visible')
  .click();
  //click on start building
cy.contains('button', 'Start Building', { timeout: 10000 })
  
  .click();
cy.contains('h3', 'AI Powered Resume', { timeout: 10000 })
  .should('be.visible')
  .click();
// Get the input first
cy.get('input[name="fname"]', { timeout: 20000 }).as('firstName');

// Click and type separately
cy.get('@firstName').click({ force: true });
cy.get('@firstName').type('priya', { force: true });
 // 7️⃣ Fill Role robustly
    cy.get('input[name="title"]', { timeout: 10000 }).as('roleInput');
    cy.get('@roleInput').scrollIntoView().click({ force: true });
    cy.get('@roleInput').type('QA', { force: true });
  
 // Alias the input
cy.get('input[name="lname"]', { timeout: 10000 }).as('lastName');

// Scroll into view and type
cy.get('@lastName').scrollIntoView().click({ force: true });
cy.get('@lastName').type('Kurai', { force: true });

// Optional: assert value
cy.get('@lastName').should('have.value', 'Kurai');

// Alias the email input
cy.get('input[name="email"]', { timeout: 10000 }).as('emailInput');

// Scroll into view and type
cy.get('@emailInput').scrollIntoView().click({ force: true });
cy.get('@emailInput').type('Priyakurai22@gmail.com', { force: true });

// Optional: assert value
cy.get('@emailInput').should('have.value', 'Priyakurai22@gmail.com');
// Fill phone number
cy.get('input[name="phone"]', { timeout: 10000 }).as('phoneInput'); 
// Scroll into view and type
cy.get('@phoneInput').scrollIntoView().click({ force: true });
cy.get('@phoneInput').type('9359668065', { force: true });

// Optional: assert value
cy.get('@phoneInput').should('have.value', '93596 68065');

// Option 1: Click using button text
// Target the city input and type "Mumbai"
cy.get('input[name="city"]', { timeout: 10000 })
  .should('exist')
  .scrollIntoView({ offset: { top: -120, left: 0 } }) // avoids sticky header overlap
  .should('be.visible')
  .clear({ force: true }) // in case something is pre-filled
  .type('Mumbai', { force: true });

// Optional: Assert the value
cy.get('input[name="city"]').should('have.value', 'Mumbai');
// Type "India" into country input
cy.get('input[name="country"]', { timeout: 10000 })
  .should('exist')
  .scrollIntoView({ offset: { top: -120, left: 0 } }) // make sure it's not hidden
  .should('be.visible')
  .clear({ force: true }) // clear any existing value
  .type('India', { force: true });

// Optional: Assert the typed value
cy.get('input[name="country"]').should('have.value', 'India');

// Click the "Generate with AI" button
cy.contains('button', 'Generate with AI', { timeout: 10000 })
  .scrollIntoView()
  .click({ force: true });






})
 
})
