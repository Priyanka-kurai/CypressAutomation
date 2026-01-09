describe('TruScholar Wallet — AI Career Test navigation', () => {
  it('should complete all 30 questions with random options', () => {

    cy.visit('https://job-recommendation-878524709646.asia-southeast1.run.app/');
 cy.wait(500);
 cy.contains('a.btn.btn-primary.btn-lg.px-5', 'Get Started').click();
cy.wait(500);
cy.get('input[name="name"]')
  .clear()            // optional – clears existing text
  .type('Priyanka');  // enters Priyanka
cy.wait(500);
const uniqueEmail = `test_${Math.floor(Math.random() * 1000000)}@gmail.com`;

cy.get('input[name="email"]')
  .clear()
  .type(uniqueEmail);

 // .should('have.value', 'priyakurai2552@gmail.com');
cy.get('#education_level')
  .select("Bachelor's Degree")
  .should('have.value', 'Bachelor');
cy.wait(500);
cy.get('#experience_years')
  .clear()
  .type('2')
  .should('have.value', '2');
cy.wait(500);
cy.get('#current_field')
  .clear()
  .type('IT')
  .should('have.value', 'IT');



cy.contains('button.btn.btn-primary', 'Continue to Interests')
  .click();
cy.wait(2000);

cy.get('#interest1').check().should('be.checked'); // Engineering and Technical Skills
cy.get('#interest5').check().should('be.checked'); // Science and Research
cy.get('#interest8').check().should('be.checked'); // Technology and Innovation
cy.wait(500);
cy.contains('button.btn.btn-primary', 'Continue to RIASEC Assessment')
  .click();
cy.wait(500);
// Click first option (A)
// Loop through all 30 questions
// Optional: intercept scores if app calls it on each selection
cy.intercept('GET', '/api/riasec/current-scores').as('scores');

// Robust version to answer all 30 questions reliably

// Optional: intercept network update if your app calls this after each selection
// (uncomment if applicable)
// cy.intercept('GET', '/api/riasec/current-scores').as('scores');

const TOTAL_QUESTIONS = 35;

function answerQuestion(i = 1) {
  cy.log(`Answering question ${i} / ${TOTAL_QUESTIONS}`);

  // 1) Select the first option's radio input (use .check() to fire native change event)
  cy.get('#optionsContainer .option-card').eq(1)
    .find('input[type="radio"]')
    .check({ force: true }) // keep force if styling/overlay blocks direct click
    .should('be.checked');

  // 2) small breathing time for the app to react (prefer short waits + retryable checks)
  cy.wait(300);

  // 3) Wait for any async update (either network or DOM) that enables the Next button.
  //    Priority: wait for network if you intercepted it, otherwise wait for button enabled state.
  // Uncomment the next line if you used the intercept above:
  // cy.wait('@scores', { timeout: 10000 });

  // 4) Click Next (or Complete on the last question)
  if (i < TOTAL_QUESTIONS) {
    cy.get('#nextButton', { timeout: 10000 })
      .should($btn => {
        // handle both attribute-based and class-based disabling
        const disabledProp = $btn.prop('disabled') === true;
        const hasDisabledAttr = $btn.attr('disabled') !== undefined;
        const hasDisabledClass = $btn.hasClass('disabled') || $btn.hasClass('btn-disabled');
        expect(disabledProp || hasDisabledAttr || hasDisabledClass).to.be.false;
      })
      .click({ force: true }) // force only if necessary
      .then(() => {
        // small wait to let new question render, then recurse
        cy.wait(200);
        answerQuestion(i + 1);
      });
  } else {
    // last question -> click the submit/complete button (cover multiple label variants)
    // prefer the actual #submitButton if available
    cy.get('button#submitButton').then($b => {
      if ($b.length) {
        cy.wrap($b).click({ force: true });
      } else {
        // fallback to text-based labels
        cy.contains('button', /Complete Assessment|Submit Assessment|Complete|Submit/i, { matchCase: false })
          .should('be.visible')
          .click({ force: true });
      }
    });
  }
}

// Kick off the flow
answerQuestion(1);

  })
  })