// cypress/e2e/riasec_e2e.cy.js

describe('TruScholar Wallet — AI Career Test navigation (full flow)', () => {
  it('should fill form, choose interests, complete 30-question RIASEC with random options and submit', () => {
    // --- Visit app ---
    cy.visit('https://job-recommendation-878524709646.asia-southeast1.run.app/');
    cy.wait(500);

    // --- Start / Landing ---
    cy.contains('a.btn.btn-primary.btn-lg.px-5', 'Get Started', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.wait(500);

    // --- Basic user details ---
    cy.get('input[name="name"]', { timeout: 10000 })
      .clear()
      .type('Priyanka');

    // unique email per run
    const uniqueEmail = `priyakurai_${Date.now()}_${Math.floor(Math.random() * 10000)}@gmail.com`;
    cy.log('Using email: ' + uniqueEmail);

    cy.get('input[name="email"]')
      .clear()
      .type(uniqueEmail);

    // education
    cy.get('#education_level').select("Bachelor's Degree").should('have.value', 'Bachelor');

    // experience
    cy.get('#experience_years')
      .clear()
      .type('2')
      .should('have.value', '2');

    // current field
    cy.get('#current_field')
      .clear()
      .type('IT')
      .should('have.value', 'IT');

    // continue to interests
    cy.contains('button.btn.btn-primary', 'Continue to Interests').click();
    cy.wait(1000);

    // --- Select interests (3 chosen) ---
    cy.get('#interest1').check().should('be.checked'); // Engineering and Technical Skills
    cy.get('#interest5').check().should('be.checked'); // Science and Research
    cy.get('#interest8').check().should('be.checked'); // Technology and Innovation
    cy.wait(500);

    // continue to assessment
    cy.contains('button.btn.btn-primary', 'Continue to RIASEC Assessment', { timeout: 10000 })
      .should('be.visible')
      .click();

    // --- Prepare to answer questions ---
    // Intercept scores XHR if the app calls it (non-fatal if not observed)
    cy.intercept('GET', '/api/riasec/current-scores').as('scores');

    const TOTAL_QUESTIONS = 30;

    // Helper: parse the progress text "Question X of Y"
    function getCurrentQuestionNumber() {
      return cy.get('#progressText', { timeout: 10000 }).invoke('text').then(text => {
        const m = text && text.match(/Question\s+(\d+)\s+of\s+(\d+)/i);
        return m ? Number(m[1]) : null;
      });
    }

    // Main recursive function that answers random option per question
    function answerQuestionRandom(i = 1) {
      cy.log(`--- Answering ${i} / ${TOTAL_QUESTIONS} ---`);

      // ensure options exist
      cy.get('#optionsContainer', { timeout: 10000 }).should('be.visible');

      // pick a random option among available option-cards
      cy.get('#optionsContainer .option-card').then($opts => {
        const count = $opts.length;
        if (count === 0) {
          throw new Error('No option cards found in #optionsContainer');
        }
        const idx = Math.floor(Math.random() * count);
        cy.log(`Choosing option index ${idx} of ${count}`);

        // ensure we trigger native change by checking the radio
        cy.wrap($opts[idx]).scrollIntoView().within(() => {
          cy.get('input[type="radio"]', { timeout: 5000 }).check({ force: true }).should('be.checked');
        });
      });

      // slight breathing time
      cy.wait(1000);

      // wait for scores XHR if it happens (safe to ignore timeout)
      

      // Grab current question number to ensure progress advances after clicking Next
      getCurrentQuestionNumber().then(beforeNum => {
        if (i < TOTAL_QUESTIONS) {
          // Wait until Next is enabled then click it
          cy.get('#nextButton', { timeout: 10000 }).should($btn => {
            const disabledProp = $btn.prop('disabled') === true;
            const hasDisabledAttr = $btn.attr('disabled') !== undefined;
            const hasDisabledClass = $btn.hasClass('disabled') || $btn.hasClass('btn-disabled');
            expect(disabledProp || hasDisabledAttr || hasDisabledClass).to.be.false;
          }).click({ force: false });

          // Wait until progressText increments (robust sync)
          cy.get('#progressText', { timeout: 10000 }).should($el => {
            const txt = $el.text();
            const m = txt && txt.match(/Question\s+(\d+)\s+of\s+(\d+)/i);
            expect(m, 'progressText matched').to.not.be.null;
            const num = Number(m ? m[1] : 0);
            // Expect progress to move forward
            expect(num).to.be.greaterThan(beforeNum || (i - 1));
          });

          // small wait then recurse to next question
          cy.wait(1000);
          answerQuestionRandom(i + 1);
        } else {
          // Last question -> click submit / complete
          cy.log('Clicking submit / complete button');
          cy.get('button#submitButton').then($b => {
            if ($b && $b.length) {
              cy.wrap($b).click({ force: true });
            } else {
              // fallback to likely button texts
              cy.contains('button', /Complete Assessment|Submit Assessment|Complete|Submit/i, { timeout: 10000 })
                .should('be.visible')
                .click({ force: true });
            }
          });

          // optional: wait for final scores XHR and log response
          cy.wait('@scores', { timeout: 10000 }).then(interception => {
            if (interception && interception.response) {
              cy.log('Final scores response:', JSON.stringify(interception.response.body));
            } else {
              cy.log('No final scores XHR observed.');
            }
          })
        }
      });
    }

    // Start answering questions
    answerQuestionRandom(1);

    // Optional: assert result page / summary visible
    cy.contains(/Your Career Matches|Results|Recommended Jobs|Top Matches/i, { timeout: 20000 })
      .should('be.visible')
      .then(() => cy.log('Result/summary is visible - flow complete'));
  });
});
export {}