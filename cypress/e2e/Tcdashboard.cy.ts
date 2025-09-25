describe('Organization Login and Dashboard Flow', () => {
  beforeEach(() => {
    // Ignore app-level JS errors
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.visit('https://test.truscholar.io/');
  });

  it('Verify Organization login button navigation', () => {
    cy.contains('Log In as Organization').click();
    cy.get('#email').should('be.visible'); // Org login form appears
    cy.get('input[name=password]').should('be.visible');
  });

  it('Verify login with valid credentials', () => {
    cy.contains('Log In as Organization').click();
    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();
    cy.url().should('include', '/dashboard'); // Redirected to dashboard
  });

  it('Verify login with invalid credentials', () => {
    cy.contains('Log In as Organization').click();
    cy.get('#email').type('wrong@test.com');
    cy.get('input[name=password]').type('WrongPass');
    cy.get('#signin').click();
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('Verify mandatory fields validation', () => {
    cy.contains('Log In as Organization').click();
    cy.get('#signin').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('Verify Forgot Password link', () => {
    cy.contains('Log In as Organization').click();
    cy.contains('Forgot?').click();
    cy.url().should('include', '/forgot-password');
  });

  context('After successful login', () => {
    beforeEach(() => {
      cy.contains('Log In as Organization').click();
      cy.get('#email').type('trupriyanka32k@gmail.com');
      cy.get('input[name=password]').type('TruscholarTest@123');
      cy.get('#signin').click();
        cy.get('#Dashboard', { timeout: 20000 }).should('be.visible');
        //cy.wait("3000")
    });

    it('Verify dashboard overview stats', () => {
      cy.contains('Overview').should('be.visible');
    });

    it('Verify learners joined graph', () => {
      //cy.contains('Learners Joined').should('be.visible');
      // Example: Check if graph element exists
     cy.contains('Learners Joined').should('be.visible');
cy.get('svg[role="img"]', { timeout: 20000 }).should('exist');

    });

    it('Verify number of verifications', () => {
      cy.contains('No. of Verification').should('be.visible');
    });

    it('Verify wallet access stats', () => {
      cy.contains('Wallet Access').should('be.visible');
    });

    it("Verify 'Send Reminder Mail' function", () => {
      cy.contains('Send Reminder Mail').click();
      cy.contains('Reminder mails sent successfully').should('be.visible');
    });

it('Verify sidebar navigation', () => {
  const menuItems = [
    { label: 'Dashboard', urlPart: '/dashboard' },
    { label: 'Instructors', urlPart: '/instructoruser/list' },
    // Alumni Connect is a parent, so we’ll handle its child separately
  ];

  menuItems.forEach(({ label, urlPart }) => {
    cy.contains(label).click();
    cy.location('pathname').should('include', urlPart);
  });

  // Handle Alumni Connect -> Custom Notification separately
  cy.contains('Alumni Connect').click();              // expand parent
  cy.contains('Notifications').click();       // click child
  cy.location('pathname').should('eq', '/custom-notification'); // verify
});

    
  });
});
