describe('TruScholar Wallet Flow', () => {
  it('complete end-to-end flow', () => {
    
    describe('HomePage', () => {
      cy.visit('https://wallet.truscholar.io/signin')
      cy.get("h3").contains("Welcome")
    })

    describe('Login Flow', () => {
      cy.visit('https://wallet.truscholar.io/signin')
      cy.viewport(1040,660);
      cy.get('#email',{ timeout: 10000 }).type('starishita9900@gmail.com');
      cy.get('input[name=password]').type('Sushil@23');
      cy.get('button[type=submit]').click();
      cy.wait(3000);

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

      cy.get('svg.lucide-x.size-6', { timeout: 20000 })
        .should('be.visible')
        .click({ force: true });
    })

    describe('Credentials Section', () => {
      cy.contains('a', 'My Credentials', { timeout: 20000 })
        .should('be.visible')
        .click();

      cy.contains('a', 'View', { timeout: 30000 })
        .should('be.visible')
        .click();
       // cy.wait("5000")
      cy.contains('button', 'Copy Verification Link', { timeout: 10000 })
        .should('be.visible')
        .click();

      cy.wait(2000);
      cy.url().should('include', '/credentials/certificates/');

      cy.contains('button', 'Download', { timeout: 30000 })
        .should('be.visible')
        .click();

      cy.wait(5000);
    })

    describe('TruResume Flow', () => {
      cy.contains('a', 'TruResume', { timeout: 10000 })
        .should('be.visible')
        .click();
cy.wait(2000);
      cy.contains('h3', 'Create Resume', { timeout: 10000 })
        .should('be.visible')
        .click();
cy.wait(2000);
      cy.contains('button', 'Start Building', { timeout: 10000 })
        .click();
cy.wait(2000);
      cy.contains('h3', 'AI Powered Resume', { timeout: 10000 })
        .should('be.visible')
        .click();
    })

    describe('Resume Form Filling', () => {

        cy.get('input[name="title"]', { timeout: 30000 }).as('roleInput');
      cy.get('@roleInput')//.scrollIntoView()
      .click({ force: true });
      cy.get('@roleInput').type('QA', { force: true });
      cy.wait(5000);

      cy.get('input[name="fname"]', { timeout: 20000 }).as('firstName');
      cy.get('@firstName').click({ force: true });
      cy.get('@firstName').type('priya', { force: true });
      cy.wait(5000);

      

      cy.get('input[name="lname"]', { timeout: 10000 }).as('lastName');
      cy.get('@lastName').scrollIntoView()
      .click({ force: true });
      cy.get('@lastName').type('Kurai', { force: true });
      cy.get('@lastName').should('have.value', 'Kurai');
cy.wait(5000);
      cy.get('input[name="email"]', { timeout: 10000 }).as('emailInput');
      cy.get('@emailInput')//.scrollIntoView()
      .click({ force: true });
      cy.get('@emailInput').type('Priyakurai22@gmail.com', { force: true });
      cy.get('@emailInput').should('have.value', 'Priyakurai22@gmail.com');
cy.wait(5000);
      cy.get('input[name="phone"]', { timeout: 10000 }).as('phoneInput');
      cy.get('@phoneInput')//.scrollIntoView()
      .click({ force: true });
      cy.get('@phoneInput').type('9359668065', { force: true });
      cy.get('@phoneInput').should('have.value', '93596 68065');
cy.wait(5000);
      cy.get('input[name="city"]', { timeout: 10000 })
        .should('exist')
       // .scrollIntoView({ offset: { top: -120, left: 0 } })
        .should('be.visible')
      
        .type('Mumbai', { force: true });
      cy.get('input[name="city"]').should('have.value', 'Mumbai');
cy.wait(5000);
      cy.get('input[name="country"]', { timeout: 10000 })
        .should('exist')
       .scrollIntoView({ offset: { top: -120, left: 0 } })
        .should('be.visible')
        .clear({ force: true })
        .type('India', { force: true });
      cy.get('input[name="country"]').should('have.value', 'India');
cy.wait(5000);

      //click on Generate with AI
      //cy.contains('button', 'Generate with AI', { timeout: 10000 })
       // .scrollIntoView()
       // .click({ force: true });
       // cy.wait(5000);

    // Focus the editor
//cy.get('.tiptap.ProseMirror[contenteditable="true"]')
  //cy.get('.save-btn').first().click(); 
   // .type('Hello, this is a test message!')
// Focus the editor first (if needed)


// Wait for the Save button to appear and click it
// Click only the first editor (likely Summary)
// Click into the first visible ProseMirror editor and type text
cy.get('div.tiptap.ProseMirror[contenteditable="true"]')
  .filter(':visible')
  .first()
  .type('A QA (Quality Assurance) professional ensures a product, especially software, meets quality standards by identifying defects through rigorous testing, documenting findings, and collaborating with development teams to implement fixes. Key responsibilities include creating and executing test plans and cases, performing both manual and automated testing, tracking defects, and providing feedback to ensure the product is stable, functional, and meets user expectations before release. ', { force: true })
.scrollIntoView()
// Assert text was entered
cy.get('div.tiptap.ProseMirror[contenteditable="true"]')
  .filter(':visible')
  .first()
  .should('contain.text', 'A QA (Quality Assurance) professional ensures a product, especially software, meets quality standards by identifying defects through rigorous testing, documenting findings, and collaborating with development teams to implement fixes. Key responsibilities include creating and executing test plans and cases, performing both manual and automated testing, tracking defects, and providing feedback to ensure the product is stable, functional, and meets user expectations before release. ')

//education section
// Target the Program input and type "Bachelors"
cy.get('input[name="0.program"]')
  .scrollIntoView()
  .click({ force: true })   // force the click if still overlapped
  .clear({ force: true })
  .type('Bachelors', { force: true })
  .should('have.value', 'Bachelors')
//add specialization
cy.get('input[name="0.specialization"]')
  .scrollIntoView()
  .click({ force: true })           // click even if covered
  .clear({ force: true })           // clear existing value
  .type('Computer Science', { force: true })  // type new value
  .should('have.value', 'Computer Science')   // assertion
//add institute name 
  cy.get('input[name="0.institution"]')
 // .scrollIntoView()
  .click({ force: true })                     // focus input even if covered
  .clear({ force: true })                     // clear existing value
  .type('Amravati University', { force: true }) // type value
  .should('have.value', 'Amravati University')  // assert it was typed
 //add verifiable credential
  cy.get('button[role="combobox"]')
  .contains('Select Credential')
  .click({ force: true })
// Open the combobox
cy.contains('[role="option"]', 'SEMESTER I').click()
cy.wait(1000);
//add city
// Ensure the value is correctly set
cy.get('input[name="0.city"]')
  .first()
 // .scrollIntoView({ block: 'center' }) // scroll to center of viewport
  .click({ force: true })              // click even if sticky header overlaps
  .clear({ force: true })              // clear existing text
  .type('Mumbai', { force: true })     // type the value
  .should('have.value', 'Mumbai');     // optional: assert value

//add country
cy.get('input[name="0.country"]')
  .first()
 // .scrollIntoView({ block: 'center' }) 
  .click({ force: true })
  .clear() //.scrollIntoView()
  .type('India')
  .should('have.value', 'India');
//add date 
// Open the datepicker input
// Click the input to open the calendar
cy.get('div.react-datepicker-wrapper input[placeholder*="Sep"]')
  .first()
  .scrollIntoView()
  .click({ force: true });

// 2️⃣ Wait for the calendar popup
   //cy.get('body')
  //.find('.react-datepicker', { timeout: 15000 }) // increased timeout
  //.should('be.visible');
// Using aria-label

// Example: Select September 2025 (monthIndex = 8)





    })

  }) 
})
