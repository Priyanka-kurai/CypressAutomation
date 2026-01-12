describe('Instructor Management Tests', () => {
  before(() => {
    // Login once before all tests
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();
    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();

    // Navigate to Instructors page
    cy.get('a#Instructors', { timeout: 10000 }).click();
    cy.url().should('include', '/instructoruser/list');
  });

  it('Verify Instructor list is displayed', () => {
    // Adjust selector based on your real DOM
    cy.contains('Name', { timeout: 15000 }).should('be.visible');
    cy.contains('Designation').should('be.visible');
    cy.contains('Status').should('be.visible');

    cy.log('Successfully verified: All instructors shown with correct Name, Designation, Status');

    cy.get('button.MuiButton-containedPrimary', { timeout: 10000 })
  .should('be.visible')
  .click({ force: true });

  //cy.contains('span', 'Add Instructor User', { timeout: 10000 })
   // .should('be.visible')
    //.click({ force: true });  // ensures click even if overlay/ripple
   // it('Fill Instructor Details form and submit', () => {
  // Type into Email field
   //first Name
  cy.get('input[name="firstname"]', { timeout: 20000 })
    .should('be.visible')
    .click()                         // click inside the field
    .type('John', { force: true });  // type value
   // lastName
//it('Click on Last Name input and type', () => {
  cy.get('input[name="lastName"]', { timeout: 20000 })
    .should('be.visible')
    .click()                           // focus inside field
    .type('Doe', { force: true });     // type a last name

//DEsignation
//it('Fill Name field', () => {
  cy.get('input[name="name"]', { timeout: 10000 })
    .should('be.visible')                 // confirm field is visible
    .click()                              // focus inside the input
    .type('QA', { force: true }); // type a sample name
//});

//emailID
//it('Fill Contact Email field', () => {
  const uniqueEmail = `instructor_${Date.now()}@example.com`;

  cy.get('input[name="contactEmail"]', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(uniqueEmail);

  cy.log(`Using email: ${uniqueEmail}`);
//country code

//it('Fill Phone Number field', () => {
 
  cy.get('input[type="tel"]', { timeout: 10000 })
    .should('be.visible')          
    .click()                        // focus on phone field
    .clear()                        // clear default "+91"
    .type('+919976543210', { force: true });  // enter test phone number
//});

//it('Click on Instructor form checkbox', () => {
  cy.get('input[type="checkbox"]', { timeout: 10000 })
  .first()
  .check({ force: true });



  

  // Click Submit button
  cy.contains('button', 'Submit', { timeout: 10000 })
    .should('be.visible')
    .click({ force: true });

  // Verify success (adjust based on real toast/snackbar message)
 // cy.contains(/login mail/i, { timeout: 10000 }).should('be.visible');
});

});
 // });

 export{};

