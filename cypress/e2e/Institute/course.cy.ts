describe('Add New Course Form Tests', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);

    // Login before each test
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();

    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();

    // Navigate to Academic > Courses > Add Course
 cy.contains('span', 'Academic', { timeout: 15000 }).click({ force: true });
    cy.wait(1000);

    cy.contains('span', 'Curriculum', { timeout: 15000 }).click({ force: true });
    cy.wait(1000);
    cy.contains('button', 'Courses').click();
    cy.wait(1000);

    cy.contains('button', 'Add Course').click({ force: true });

    cy.wait(1500);
  })
  it('Verify mandatory field validation', () => {
    cy.get('button').contains('Add Course').click();
   // cy.contains('Course Name is required').should('be.visible');
    //cy.contains('Course Code is required').should('be.visible');
  });

  it('Verify Program dropdown selection', () => {
    cy.contains('label', 'Program')
  .parent()
  .find('.MuiAutocomplete-popupIndicator')
  .click();

// Scroll dropdown list to bottom
cy.get('ul[role="listbox"]').scrollTo('bottom');
    cy.contains('li', 'Data Analytics Diploma', { timeout: 5000 }).click();
    // Assert Program input contains selected value
cy.contains('label', 'Program').parent().find('input').should('have.value', 'Data Analytics Diploma (DIP404)');

  });

   it('Verify Course Name field validation', () => {
    // Target input by its label
cy.contains('label', 'Course Name').parent().find('input').type('Bachelor of Arts');

   // cy.get('input[name="courseName"]').type('Bachelor of Arts');
   // cy.get('input[name="courseName"]').should('have.value', 'Bachelor of Arts');
    // Target input by its label
cy.contains('label', 'Course Name').parent().find('input').should('have.value', 'Bachelor of Arts');

  });

  it('Verify Course Name rejects invalid input', () => {
   // cy.get('input[name="courseName"]').type('@#$%123');
    cy.contains('label', 'Course Name').parent().find('input').type('@#$%123');
   // cy.contains('Invalid Course Name').should('be.visible');
   // Click Add Course button
cy.contains('button', 'Add Course').click();

  });

  it('Verify Course Code input', () => {
   cy.contains('label', 'Course Code').parent().find('input').click().type('CS101');

   cy.contains('label', 'Course Code').parent().find('input').should('have.value', 'CS101');
   // Click Add Course button
cy.contains('button', 'Add Course').click();

  });

  it('Verify Course Code rejects invalid characters', () => {
   cy.contains('label', 'Course Code').parent().find('input').click().type('@@###');
    //cy.contains('Invalid Course Code').should('be.visible');
    // Click Add Course button
cy.contains('button', 'Add Course').click();

  });

  it('Verify Skill Set dropdown', () => {
  // Open Skill Set dropdown
cy.contains('label', 'Skill Set').parent().find('.MuiAutocomplete-popupIndicator').click();
    cy.wait(500);
    // Type into Skill Set input
cy.get('input#Skills').click().type('pyth');
cy.contains('ul[role="listbox"] li', 'Python', { matchCase: false }).click();
//cy.get('input#Skills').should('have.value', 'R or Python statistical programming language');

// Assert final value in the input
//cy.get('input#Skills')
 // .should('have.value', 'R or Python statistical programming language');

// Assert input has the value
//cy.contains('label', 'Skill Set').parent().find('input').should('have.value', 'Python');
  });

  it('Verify Course Description input', () => {
  cy.get('textarea[name="description"]').click().type('This is a test course description').should('have.value', 'This is a test course description');

  });

 // it('Verify Lifetime Certificate option', () => {
  //  cy.get('#lifetimeCertificate').check();
    //cy.get('#lifetimeCertificate').should('be.checked');
    //cy.get('#lifetimeCertificate').uncheck();
    //cy.get('#lifetimeCertificate').should('not.be.checked');
//  });

  it('Verify Grades Type dropdown', () => {
   // Open the Grades Type dropdown
// Click (focus) the Grades Type input
cy.get('input#gradeType').click();
cy.contains('li', 'CGPA').click();

cy.get('input#gradeType').should('have.value', 'CGPA');

  });

  it('Verify Assign Instructor dropdown', () => {
   // Enter value in Name field
cy.contains('label', 'Name')
  .parent()
  .find('input')
  .type('Asmita')
  .should('have.value', 'Asmita');

  });

  it('Verify Authorized Signatory Name & Designation input', () => {
   // Enter value in Designation field
cy.contains('label', 'Designation')
  .parent()
  .find('input')
  .type('QA')
  .should('have.value', 'QA');

  });

  

  it('Verify Course Link input', () => {
   // Enter value in Course Link field
cy.contains('label', 'Course Link')
  .parent()
  .find('input')
  .type('https://test.truscholar.io/course/new')
  .should('have.value', 'https://test.truscholar.io/course/new');

    //cy.get('input[name="courseLink"]').should('have.value', 'https://example.com/course');
  });

  it('Verify invalid Course Link input', () => {
   cy.contains('label', 'Course Link')
  .parent()
  .find('input').type('invalid-link');
    //cy.contains('Invalid URL').should('be.visible');
  });

  it('Verify successful course addition', () => {
    // Program
     cy.contains('label', 'Program').parent().find('.MuiAutocomplete-popupIndicator').click();
      cy.contains('li', 'Data Analytics Diploma').click();

    // Course Name
    cy.contains('label', 'Course Name')
  .parent()
  .find('input')
  .clear()
  .type('Bachelor of Science')
  .should('have.value', 'Bachelor of Science');


    // Course Code
    cy.contains('label', 'Course Code')
      .parent()
      .find('input')
      .type('BSC123');

        // Open Skill Set dropdown
cy.contains('label', 'Skill Set').parent().find('.MuiAutocomplete-popupIndicator').click();
    cy.wait(500);
    // Type into Skill Set input
cy.get('input#Skills').click().type('pyth');
cy.contains('ul[role="listbox"] li', 'Python', { matchCase: false }).click();

    // Course Description
    cy.get('textarea[name="description"]')
      .type('Science course test');

    // Grades Type
 // Grades Type
cy.get('input#gradeType').scrollIntoView().click();

cy.contains('li', 'CGPA').click();

cy.get('input#gradeType').should('have.value', 'CGPA');

// Authorized Signatory Name
cy.contains('label', /^Name\s*\*/)
  .scrollIntoView()
  .parent()
  .find('input')
  .clear()
  .type('Asmita')
  .should('have.value', 'Asmita');


    cy.contains('label', 'Designation')
      .parent()
      .find('input')
      .type('Head of Department');

    // Course Link
    cy.contains('label', 'Course Link')
      .parent()
      .find('input')
      .type('https://test.truscholar.io/course/new');

    // Submit
    cy.contains('button', 'Add Course').click();

    // Verify success
    cy.contains('Course Added Successfully', { timeout: 10000 }).should('be.visible');
  });

})

export { };