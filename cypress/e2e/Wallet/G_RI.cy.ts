// cypress/e2e/ri_final_getonly_tiebreak_submit_if_solved.cy.ts

describe('RIASEC Assessment: 30 Questions + Tie-break Flow', () => {
  const PAUSE = 600;
  const APP_URL = 'https://job-recommendation-878524709646.asia-southeast1.run.app/';
  
  // Helper to pause execution
  const pause = (ms = PAUSE) => cy.wait(ms);

  // Helper to wait for GET requests with riasec_scores
  function waitForScores() {
    return cy.wait('@getRiasec', { timeout: 20000 }).then(inter => {
      const body = inter.response?.body;
      cy.log(`GET: ${inter.request.url}`);
      
      if (!body?.riasec_scores) {
        cy.log('No scores yet, retrying...');
        return waitForScores();
      }
      
      cy.log(`Scores received: ${JSON.stringify(body.riasec_scores)}`);
      return cy.wrap(body);
    });
  }

  // Helper to click button if visible
  function clickIfVisible(selector: string, label: string) {
    cy.get('body').then($body => {
      const $btn = $body.find(`${selector}:visible`);
      if ($btn.length) {
        cy.get(selector).click({ force: true });
        cy.log(`✓ Clicked ${label}`);
      } else {
        cy.log(`⊘ ${label} not visible`);
      }
    });
  }

  // Helper to select an answer
  function selectAnswer(value: string) {
    cy.get('#optionsContainer input.option-input')
      .filter(`[value="${value}"]`)
      .first()
      .closest('.option-card')
      .click({ force: true });
    
    cy.get('#optionsContainer input.option-input')
      .filter(`[value="${value}"]`)
      .should('be.checked');
  }

  it('completes assessment with R winning after tie-break', () => {
    // Setup: Intercept GET requests
    cy.intercept({ method: 'GET', url: '**/api/riasec/**' }).as('getRiasec');

    // Step 1: Start assessment
    cy.visit(APP_URL);
    pause(800);
    cy.contains('Get Started', { timeout: 10000 }).click();
    pause();

    // Step 2: Fill basic info
    const email = `ri_test_${Date.now()}@example.com`;
    cy.get('input[name="name"]').clear().type('Test User');
    cy.get('input[name="email"]').clear().type(email);
    cy.get('#education_level').select("Bachelor's Degree");
    cy.get('#experience_years').clear().type('2');
    cy.get('#current_field').clear().type('IT');
    pause(500);
    cy.contains('Continue to Interests').click();
    pause();

    // Step 3: Select interests (optional)
    cy.get('body').then($body => {
      ['#interest1', '#interest5', '#interest8'].forEach(id => {
        if ($body.find(id).length) {
          cy.get(id).check({ force: true });
        }
      });
    });
    cy.contains('Continue to RIASEC Assessment').click();
    pause(800);

    // Step 4: Answer 30 questions (designed to create R/I tie)
    const answers: Record<number, string> = {
      1: 'A', 2: 'B', 3: 'A', 4: 'B', 5: 'A', 6: 'B', 7: 'A', 8: 'B',
      9: 'B', 10: 'A', 11: 'A', 12: 'B', 13: 'A', 14: 'B', 15: 'A', 16: 'B',
      17: 'A', 18: 'B', 19: 'A', 20: 'A', 21: 'A', 22: 'B', 23: 'A', 24: 'B',
      25: 'A', 26: 'B', 27: 'A', 28: 'A', 29: 'A', 30: 'B'
    };

    for (let q = 1; q <= 30; q++) {
      cy.get('#progressText', { timeout: 10000 })
        .should('contain', `Question ${q}`);
      
      selectAnswer(answers[q]);
      
      cy.get('#nextButton', { timeout: 8000 })
        .should('not.be.disabled')
        .click({ force: true });
      
      pause(200);
    }

    // Step 5: Try to submit after Q30 (may or may not be needed)
    clickIfVisible('#submitButton', 'Submit after Q30');

    // Step 6: Check scores and handle tie-break if needed
    waitForScores().then(body => {
      const r = Number(body.riasec_scores.R || 0);
      const i = Number(body.riasec_scores.I || 0);
      
      cy.log(`📊 Initial scores: R=${r}, I=${i}`);

      // Case 1: R already wins
      if (r > i) {
        cy.log('✓ R wins immediately!');
        cy.contains(/Realistic|Top match.*Realistic/i, { timeout: 10000 })
          .should('exist');
        return;
      }

      // Case 2: Tie - need tie-break
      if (r === i) {
        cy.log('⚖️  Tie detected - starting tie-break');

        // Wait for tie-break question
        cy.get('#progressText', { timeout: 20000 })
          .should('satisfy', ($el) => {
            return /31|tie break|round\s*1/i.test($el.text());
          });

        cy.get('#optionsContainer input.option-input', { timeout: 20000 })
          .should('have.length.at.least', 1)
          .and('be.enabled');
        
        pause();

        // Select R-favoring option
        selectAnswer('A');
        
        // Click Next after tie-break
        cy.get('#nextButton').click({ force: true });
        cy.log('→ Clicked Next after tie-break');

        // Check updated scores
        waitForScores().then(bodyAfterTB => {
          const r2 = Number(bodyAfterTB.riasec_scores.R || 0);
          const i2 = Number(bodyAfterTB.riasec_scores.I || 0);
          
          cy.log(`📊 After tie-break: R=${r2}, I=${i2}`);

          if (r2 > i2) {
            cy.log('✓ Tie-break resolved - R wins!');
            clickIfVisible('#submitButton', 'Submit after tie-break');
            
            // Final submission
            cy.get('#submitButton')
              .should('be.visible')
              .and('contain', 'Submit Assessment')
              .click();
          }
        });
      }
    });
  });
});
export {}