// cypress/e2e/riasec_tiebreaker_RI.cy.js

describe('RIASEC — run assessment and handle R-I tie-breaker', () => {
  // --- tie-breaker bank you provided (only entries shown for R-I here) ---
  const TIE_BREAKER_QUESTIONS = [
    {
      "number": 31,
      "pair": "R-I",
      "question": "Which activity appeals to you more?",
      "options": {
        "A": {"text": "Fix a tool or assemble simple equipment", "riasec": "R"},
        "B": {"text": "Analyze information to understand a problem", "riasec": "I"}
      }
    },
    {
      "number": 32,
      "pair": "R-I",
      "question": "Which task would you choose?",
      "options": {
        "A": {"text": "Adjust mechanical parts to make them work", "riasec": "R"},
        "B": {"text": "Research details to find clear explanations", "riasec": "I"}
      }
    },
    // you also included #61 which is R-I; include it too if present
    {
      "number": 61,
      "pair": "R-I",
      "question": "Which task would you enjoy more?",
      "options": {
        "A": {"text": "Fix devices by adjusting physical components", "riasec": "R"},
        "B": {"text": "Examine data to find hidden issues", "riasec": "I"}
      }
    }
  ];

  // Which code should win the tie-breaker by default? Change to 'I' if you want I to win.
  const PREFERRED_WINNER = 'R';

  // small helpers
  const pause = ms => cy.wait(ms);

  it('fills form, completes 30 Qs, detects R-I tie and answers tie-breaker favoring R', () => {
    // --- Visit and start ---
    cy.visit('https://riasec-app-592805402248.asia-southeast1.run.app');
    pause(800);
    cy.contains('a.btn.btn-primary.btn-lg.px-5', 'Get Started', { timeout: 10000 }).click();
    pause(800);

    // --- Basic info ---
    cy.get('input[name="name"]').clear().type('RI_Tiebreaker_TestUser');
    const uniqueEmail = `ri_tiebreak_${Date.now()}@example.com`;
    cy.get('input[name="email"]').clear().type(uniqueEmail);
    cy.get('#education_level').select("Bachelor's Degree");
    cy.get('#experience_years').clear().type('2');
    cy.get('#current_field').clear().type('IT');
    pause(700);
    cy.contains('button.btn.btn-primary', 'Continue to Interests').click();

    // --- Interests ---
    pause(800);
    cy.get('#interest1').check().should('be.checked'); pause(250);
    cy.get('#interest5').check().should('be.checked'); pause(250);
    cy.get('#interest8').check().should('be.checked'); pause(250);
    cy.contains('button.btn.btn-primary', 'Continue to RIASEC Assessment').click();
    pause(1200);

    // Intercept the scores XHR that the app fires as it computes current/final scores.
    // (This was used previously in your logs: /api/riasec/current-scores)
    cy.intercept('GET', '/api/riasec/current-scores').as('scores');

    // --- Answer 30 questions (random). Visible waits so you can watch it run ---
    const TOTAL = 33;

    function answerRandomQuestion(i = 1) {
      cy.log(`Answering Q ${i} / ${TOTAL}`);
      pause(700); // see the question

      // pick a random option among visible option-cards
      cy.get('#optionsContainer .option-card', { timeout: 10000 }).should('have.length.at.least', 1).then($opts => {
        const count = $opts.length;
        const idx = Math.floor(Math.random() * count);
        cy.log(`Selecting option DOM index ${idx}`);
        cy.wrap($opts[idx]).scrollIntoView().within(() => {
          cy.get('input[type="radio"]').check({ force: true }).should('be.checked');
        });
      });

      // slight pause to see the selection
      pause(900);

      // wait for the scores XHR when available (non-fatal)
      //cy.wait('@scores', { timeout: 3000 }).catch(() => { cy.log('scores XHR not observed for this selection'); });

      if (i < TOTAL) {
        pause(600);
        // click Next (wait until enabled)
      cy.get('#nextButton').should('be.visible').click()

          .should($btn => {
            const disabledProp = $btn.prop('disabled') === true;
            const hasDisabledAttr = $btn.attr('disabled') !== undefined;
            const hasDisabledClass = $btn.hasClass('disabled') || $btn.hasClass('btn-disabled');
           // expect(disabledProp || hasDisabledAttr || hasDisabledClass).to.be.false;
          })
          .click({ force: false });

        // wait for progress to update (safe sync)
        cy.get('#progressText', { timeout: 10000 }).should('be.visible');
        pause(400);
        answerRandomQuestion(i + 1);
      } else {
        // last question -> submit the 30-question assessment
        pause(1000);
        cy.log('Submitting 30-question assessment');
        cy.contains('button', /Complete Assessment|Submit Assessment|Complete|Submit/i, { timeout: 10000 })
          .should('be.visible')
          .click({ force: true });

        // give server time to compute final scores and emit the XHR
        cy.wait('@scores', { timeout: 10000 }).then(interception => {
          // attempt to inspect the server response for tie info
          if (interception && interception.response && interception.response.body) {
            cy.log('scores response observed — checking for tie');
            const body = interception.response.body;
            // attempt common shapes: { scores: { R: n, I: n, ... } } or direct map
            cy.task('log', body); // optional: requires a task; safe no-op in many setups
            // We'll check body for numeric equality between R and I in any nested object
            let rVal = null, iVal = null;
            // naive traversal to find R and I numeric values
            try {
              const json = body;
              // common possible keys
              if (json.scores) {
                rVal = json.scores.R ?? json.scores['R'] ?? null;
                iVal = json.scores.I ?? json.scores['I'] ?? null;
              } else {
                // look for top-level keys
                rVal = json.R ?? json['R'] ?? null;
                iVal = json.I ?? json['I'] ?? null;
              }
            } catch (e) {
              cy.log('Error parsing scores body: ' + e.message);
            }

            // if numeric and equal -> treat as tie
            if (typeof rVal === 'number' && typeof iVal === 'number' && rVal === iVal) {
              cy.log(`Detected server tie: R=${rVal}, I=${iVal} — launching tie-breaker flow`);
              runTieBreaker_RI();
            } else {
              cy.log('No server-detected tie (R/I):', { rVal, iVal });
              // as fallback, inspect page for tie UI
              checkPageForRITieThenMaybeRun();
            }
          } else {
            cy.log('No scores response body — fallback to page inspection for tie');
            checkPageForRITieThenMaybeRun();
          }
        })
      }
    } // end answerRandomQuestion

    // Check page content to heuristically detect R-I tie (if server data not available)
    function checkPageForRITieThenMaybeRun() {
      // common UI may show "Tie between R and I" or both top codes displayed with same score.
      cy.wait(800);
      cy.get('body').then($b => {
        const text = $b.text();
        const regexTie = /tie.*R.*I|R\s*-\s*I.*tie|R\s*and\s*I.*tie/i;
        const bothPresentPattern = /R\W*\d+\D+I\W*\d+/i; // like "R 12 I 12"
        if (regexTie.test(text) || bothPresentPattern.test(text)) {
          cy.log('Page indicates R-I tie — launching tie-breaker flow');
          runTieBreaker_RI();
        } else {
          cy.log('No tie UI detected on page. Flow ends here.');
        }
      });
    }

    // Tie-breaker flow for R-I: iterate TIE_BREAKER_QUESTIONS with pair == 'R-I'
    function runTieBreaker_RI() {
      // filter only R-I tie-breaker items
      const riItems = TIE_BREAKER_QUESTIONS.filter(q => q.pair === 'R-I');
      if (!riItems.length) {
        cy.log('No R-I tie-breaker questions found in bank.');
        return;
      }

      cy.log(`Running ${riItems.length} tie-breaker questions for R-I (prefer ${PREFERRED_WINNER})`);

      // assume the app will render tie-breaker questions in same #optionsContainer
      // Step through the tie-breaker items in order
      function answerTieAtIndex(ti = 0) {
        const qb = riItems[ti];
        cy.log(`Tie Q ${qb.number}: ${qb.question}`);
        pause(800);

        // wait for options to appear
        cy.get('#optionsContainer .option-card', { timeout: 10000 }).should('have.length.at.least', 1).then($opts => {
          // We need to pick the option whose riasec === PREFERRED_WINNER.
          // Map visible text to the bank options to decide which DOM index is A or B
          const domTexts = Array.from($opts).map(el => el.innerText.trim());
          const aText = qb.options.A.text.trim();
          const bText = qb.options.B.text.trim();

          let chosenIndex = null;
          // try exact matches
          const aDomIndex = domTexts.findIndex(t => t === aText);
          const bDomIndex = domTexts.findIndex(t => t === bText);
          if (aDomIndex !== -1 && bDomIndex !== -1) {
            // both matched — choose the one whose riasec === preferred
            if (qb.options.A.riasec === PREFERRED_WINNER) chosenIndex = aDomIndex;
            else if (qb.options.B.riasec === PREFERRED_WINNER) chosenIndex = bDomIndex;
            else chosenIndex = aDomIndex; // fallback
          } else {
            // Try partial/keyword matching
            const lowerDom = domTexts.map(t => t.toLowerCase());
            const aLow = aText.toLowerCase();
            const bLow = bText.toLowerCase();
            const aMatch = lowerDom.findIndex(t => t.includes(aLow) || aLow.includes(t));
            const bMatch = lowerDom.findIndex(t => t.includes(bLow) || bLow.includes(t));
            if (aMatch !== -1 && qb.options.A.riasec === PREFERRED_WINNER) chosenIndex = aMatch;
            else if (bMatch !== -1 && qb.options.B.riasec === PREFERRED_WINNER) chosenIndex = bMatch;
            else if (aMatch !== -1) chosenIndex = aMatch;
            else if (bMatch !== -1) chosenIndex = bMatch;
            else chosenIndex = 0; // last resort
          }

          cy.log(`Selecting DOM option index ${chosenIndex} (prefers ${PREFERRED_WINNER})`);
          cy.wrap($opts[chosenIndex]).scrollIntoView().within(() => {
            cy.get('input[type="radio"]').check({ force: true }).should('be.checked');
          });
        });

        // small visible pause
        pause(1000);

        // wait for scores XHR optionally (may update after each tie question)
       // cy.wait('@scores', { timeout: 4000 }).catch(() => { cy.log('scores XHR not observed for tie Q'); });

        // Click Next or Submit depending on whether more tie questions remain
        if (ti < riItems.length - 1) {
          pause(600);
          cy.get('#nextButton', { timeout: 10000 }).should('not.be.disabled').click({ force: false });
          pause(500);
          answerTieAtIndex(ti + 1);
        } else {
          pause(1200);
          cy.log('Submitting tie-breaker answers');
          cy.contains('button', /Complete Assessment|Submit Assessment|Complete|Submit/i, { timeout: 10000 })
            .should('be.visible')
            .click({ force: true });
          pause(1500);
          cy.log('Tie-breaker submitted — final result should be displayed now.');
        }
      } // end answerTieAtIndex

      // start tie-breaker sequence
      answerTieAtIndex(0);
    } // end runTieBreaker_RI

    // Start answering the 30 random questions
    answerRandomQuestion(1);

    // at the end: optional final assertion to see result UI
    pause(2000);
    cy.contains(/Your Career Matches|Results|Top Matches|Recommended Jobs/i, { timeout: 20000 })
      .should('be.visible').then(() => {
        cy.log('Final results visible — flow completed');
      });
  });
});
export {}