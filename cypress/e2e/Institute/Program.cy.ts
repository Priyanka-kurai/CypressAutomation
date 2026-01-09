describe('Curriculum Management Tests', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);

    // Login before each test
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();

    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();

    // Wait for dashboard load
    cy.contains('span', 'Academic', { timeout: 15000 }).click({ force: true });
    cy.wait(1000);

    cy.contains('span', 'Curriculum', { timeout: 15000 }).click({ force: true });
    cy.wait(1000); 

    cy.contains('button', 'Add Program', { timeout: 15000 }).click({ force: true });
    cy.wait(1500);
  });

  it('Should display Add Program form fields', () => {
    cy.contains('Add New Program', { timeout: 10000 }).should('be.visible');
    cy.contains('Certificate Type').should('be.visible');
    cy.contains('Program Name').should('be.visible');
    cy.contains('Program Code').should('be.visible');
    cy.contains('Duration').should('be.visible');
  });

  it('Should not submit empty form', () => {
    cy.get('#submitCourse').click();
    cy.wait(500);
    cy.contains('Certificate Type is required', { timeout: 5000 }).should('be.visible');
  });

  it('Should not allow form submission without Program Code', () => {
    // Certificate Type
    cy.get('.MuiAutocomplete-endAdornment')
      .find('button[title="Open"]')
      .should('be.visible')
      .click();
    cy.wait(1000);

    cy.contains('li', 'Degree Certificates', { timeout: 5000 }).click();
    cy.wait(1000);

    // Program Name
    cy.contains('label', 'Program Name')
      .parent()
      .find('input')
      .type('Bachelor of Science');
    cy.wait(500);

    // Regional Language
    cy.contains('label', 'Program Name(Regional Language)')
      .parent()
      .find('input')
      .type('वाणिज्य स्नातक');
    cy.wait(500);

    // Skip Program Code

    // Duration
    cy.get('#duration').click();
    cy.wait(500);

    cy.contains('li', '3 YEARS').click();
    cy.wait(500);

    // Submit
    cy.get('#submitCourse').click();
    cy.wait(1000);

    // Assertions
    cy.contains('Program added successfully').should('not.exist');
    cy.contains('Program Code is required', { timeout: 5000 }).should('be.visible');
  });

  // ✅ Data-driven valid submissions
  const programs = [
    { name: 'Bachelor of Science', code: 'BCOM101', regional: 'वाणिज्य स्नातक' },
    { name: 'Master of Commerce', code: 'MCOM202', regional: 'वाणिज्य परास्नातक' },
    { name: 'Web Development Certificate', code: 'CERT303', regional: 'वेब विकास प्रमाणपत्र' },
    { name: 'Data Analytics Diploma', code: 'DIP404', regional: 'डेटा विश्लेषण डिप्लोमा' }
  ];

  programs.forEach((program) => {
    it(`Should submit form with valid data - ${program.name}`, () => {
      // Certificate Type
      cy.get('.MuiAutocomplete-endAdornment')
        .find('button[title="Open"]')
        .should('be.visible')
        .click();
      cy.wait(1000);

      cy.contains('li', 'Degree Certificates', { timeout: 5000 }).click();
      cy.wait(1000);

      // Program Name
      cy.contains('label', 'Program Name')
        .parent()
        .find('input')
        .clear()
        .type(program.name);
      cy.wait(500);

      // Regional Language
      cy.contains('label', 'Program Name(Regional Language)')
        .parent()
        .find('input')
        .clear()
        .type(program.regional);
      cy.wait(500);

      // Program Code
      cy.contains('label', 'Program Code')
        .parent()
        .find('input')
        .clear()
        .type(program.code);
      cy.wait(500);

      // Duration
      cy.get('#duration').click();
      cy.wait(500);

      cy.contains('li', '3 YEARS').click();
      cy.wait(500);

      // Submit
      cy.get('#submitCourse').click();
      cy.wait(1500);

      // Assertions
      cy.contains('Program Added Succesfully', { timeout: 10000 }).should('be.visible'); // adjust spelling if needed
    });
  });
});

export { };
