describe('Multi-tab handling demo', () => {

  beforeEach(() => {
    // Use Cypress’s own test page
    cy.visit('https://example.cypress.io/commands/window');
  });

  it('Forces a new-tab link to open in the same tab', () => {
    // Find link that opens a new tab and remove the target
    cy.get('a[target="_blank"]')
      .first()
      .invoke('removeAttr', 'target')
      .click();

    // Now you’re on the new page — verify navigation
    cy.url().should('include', 'example.cypress.io');
  });

  it('Visits the new-tab URL directly', () => {
    // Get the link’s href and visit it directly
    cy.get('a[target="_blank"]').first().then(($a) => {
      const url = $a.prop('href');
      cy.visit(url);
    });

    cy.url().should('include', 'example.cypress.io');
  });

  it('Stubs window.open() and verifies it was called', () => {
    // Example stub of window.open
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    // Simulate a window.open() event manually (demo)
    cy.window().then((win) => {
      win.open('https://docs.cypress.io', '_blank');
    });

    cy.get('@windowOpen').should('have.been.calledWithMatch', 'https://docs.cypress.io');
  });

});
