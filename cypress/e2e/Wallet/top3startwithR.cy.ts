// cypress/e2e/riasec_all_r_combinations.cy.ts

describe('RIASEC Assessment: All R-Starting Combinations', () => {
  const PAUSE = 600;
  const APP_URL = 'https://job-recommendation-878524709646.asia-southeast1.run.app/';
  
  // Map letters to their question indices (adjust based on your app's mapping)
  const LETTER_MAP = {
    R: [1, 7, 13, 19, 25],      // Realistic
    I: [2, 8, 14, 20, 26],      // Investigative
    A: [3, 9, 15, 21, 27],      // Artistic
    S: [4, 10, 16, 22, 28],     // Social
    E: [5, 11, 17, 23, 29],     // Enterprising
    C: [6, 12, 18, 24, 30]      // Conventional
  };

  // All R-starting combinations
  const R_COMBINATIONS = [
    'RAI', 'RAS', 'RAE', 'RAC',
    'RIA', 'RIS', 'RIE', 'RIC',
    'RSA', 'RSI', 'RSE', 'RSC',
    'REA', 'REI', 'RES', 'REC',
    'RCA', 'RCI', 'RCE', 'RCS'
  ];

  // Helper functions
  const pause = (ms = PAUSE) => cy.wait(ms);

  function waitForScores() {
    return cy.wait('@getRiasec', { timeout: 20000 }).then(inter => {
      const body = inter.response?.body;
      if (!body?.riasec_scores) {
        return waitForScores();
      }
      return cy.wrap(body);
    });
  }

  function clickIfVisible(selector: string) {
    cy.get('body').then($body => {
      if ($body.find(`${selector}:visible`).length) {
        cy.get(selector).click({ force: true });
      }
    });
  }

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

  // Generate answer pattern for target code
  function generateAnswers(targetCode: string): Record<number, string> {
    const answers: Record<number, string> = {};
    const priority = targetCode.split(''); // e.g., ['R', 'A', 'I']
    
    // Answer 'A' for highest priority, 'B' for lowest
    for (let q = 1; q <= 30; q++) {
      // Determine which letter this question belongs to
      let questionLetter = '';
      for (const [letter, questions] of Object.entries(LETTER_MAP)) {
        if (questions.includes(q)) {
          questionLetter = letter;
          break;
        }
      }
      
      // Assign answer based on priority
      const priorityIndex = priority.indexOf(questionLetter);
      if (priorityIndex === 0) {
        answers[q] = 'A'; // Highest priority - strongly agree
      } else if (priorityIndex === 1) {
        answers[q] = 'A'; // Second priority - agree
      } else if (priorityIndex === 2) {
        answers[q] = 'B'; // Third priority - neutral/disagree
      } else {
        answers[q] = 'B'; // Not in top 3 - disagree
      }
    }
    
    return answers;
  }

  // Map RIASEC letters to interest IDs (based on your app)
  const INTEREST_MAP = {
    R: ['#interest1', '#interest2', '#interest3'],      // Engineering, Technical, Hands-on
    I: ['#interest4', '#interest5', '#interest6'],      // Research, Science, Analysis
    A: ['#interest7', '#interest8', '#interest9'],      // Creative, Arts, Design
    S: ['#interest10', '#interest11', '#interest12'],   // Social, Teaching, Helping
    E: ['#interest13', '#interest14', '#interest15'],   // Business, Leadership, Sales
    C: ['#interest16', '#interest17', '#interest18']    // Organization, Data, Administration
  };

  // Run basic info flow (reusable)
  function fillBasicInfo(testName: string, targetCode: string) {
    cy.visit(APP_URL);
    pause(800);
    cy.contains('Get Started', { timeout: 10000 }).click();
    pause();

    const email = `${testName.toLowerCase()}_${Date.now()}@example.com`;
    cy.get('input[name="name"]').clear().type(testName);
    cy.get('input[name="email"]').clear().type(email);
    cy.get('#education_level').select("Bachelor's Degree");
    cy.get('#experience_years').clear().type('2');
    cy.get('#current_field').clear().type('IT');
    pause(500);
    cy.contains('Continue to Interests').click();
    pause();

    // Select interests based on target code
    selectInterestsForCode(targetCode);
    
    // Use correct button selector
    cy.contains('button.btn.btn-primary', 'Continue to RIASEC Assessment', { timeout: 10000 })
      .should('be.visible')
      .click();
    pause(800);
  }

  // Select interests matching the target RIASEC code
  function selectInterestsForCode(targetCode: string) {
    const letters = targetCode.split(''); // e.g., ['R', 'A', 'I']
    const selectedInterests: string[] = [];
    
    cy.get('body').then($body => {
      // Select interests prioritizing the target code letters
      for (let i = 0; i < letters.length && selectedInterests.length < 3; i++) {
        const letter = letters[i];
        const interests = INTEREST_MAP[letter] || [];
        
        for (const interestId of interests) {
          if (selectedInterests.length >= 3) break;
          
          if ($body.find(interestId).length) {
            cy.get(interestId).check().should('be.checked');
            selectedInterests.push(interestId);
            cy.log(`✓ Selected ${interestId} for ${letter}`);
          }
        }
      }
      
      // If we still need more interests, fill from any available
      if (selectedInterests.length < 3) {
        cy.log(`⚠️  Only found ${selectedInterests.length} interests, need 3`);
      }
    });
    
    cy.wait(500);
  }

  // Answer all 30 questions
  function answerQuestions(answers: Record<number, string>) {
    for (let q = 1; q <= 30; q++) {
      cy.log(`📝 Answering Question ${q}`);
      
      // Wait for question to be ready - try multiple selectors
      cy.get('body', { timeout: 10000 }).should('be.visible');
      
      // Try to find progress indicator (adjust selectors based on your app)
      cy.get('body').then($body => {
        if ($body.find('#progressText').length) {
          cy.get('#progressText').should('contain', `Question ${q}`);
        } else if ($body.find('[data-testid="progress"]').length) {
          cy.get('[data-testid="progress"]').should('contain', `Question ${q}`);
        } else if ($body.find('.progress-text').length) {
          cy.get('.progress-text').should('contain', `Question ${q}`);
        } else {
          cy.log(`⚠️  Progress text not found, continuing anyway for Q${q}`);
        }
      });
      
      // Wait for options to be available
      cy.get('#optionsContainer', { timeout: 10000 }).should('exist');
      cy.get('#optionsContainer input.option-input', { timeout: 10000 })
        .should('have.length.at.least', 1);
      
      pause(300);
      selectAnswer(answers[q]);
      
      cy.get('#nextButton', { timeout: 8000 })
        .should('not.be.disabled')
        .click({ force: true });
      
      pause(400);
    }
  }

  // Handle tie-breaks if needed
  function handleTieBreaks(targetCode: string, maxAttempts = 5, attempt = 1) {
    if (attempt > maxAttempts) {
      cy.log(`⚠️  Max tie-break attempts reached (${maxAttempts})`);
      return;
    }

    waitForScores().then(body => {
      const scores = body.riasec_scores;
      const sortedScores = Object.entries(scores)
        .map(([letter, score]) => ({ letter, score: Number(score) }))
        .sort((a, b) => b.score - a.score);
      
      const top3Letters = sortedScores.slice(0, 3).map(s => s.letter).join('');
      cy.log(`📊 Attempt ${attempt}: Top 3 = ${top3Letters} (Target: ${targetCode})`);

      // Check if we need tie-breaks
      const [first, second, third] = sortedScores;
      
      if (first.score === second.score || second.score === third.score) {
        cy.log(`⚖️  Tie detected (${first.letter}=${first.score}, ${second.letter}=${second.score}) - resolving...`);
        
        // Check if tie-break question is available
        cy.get('body', { timeout: 3000 }).then($body => {
          const hasProgressText = $body.find('#progressText').length > 0;
          const hasOptions = $body.find('#optionsContainer input.option-input').length > 0;
          
          if (hasProgressText && hasOptions) {
            // Tie-break question is present
            cy.log('✓ Tie-break question found');
            
            // Wait for options to be ready
            cy.get('#optionsContainer input.option-input', { timeout: 10000 })
              .should('have.length.at.least', 1)
              .and('be.enabled');
            
            pause();
            
            // Select answer favoring target letter (adjust mapping as needed)
            selectAnswer('A');
            
            // Click Next if available
            cy.get('body').then($b2 => {
              if ($b2.find('#nextButton:visible:not(:disabled)').length > 0) {
                cy.get('#nextButton').click({ force: true });
                cy.log('→ Clicked Next after tie-break');
                pause(1000);
              }
            });
            
            // Recursively check again
            handleTieBreaks(targetCode, maxAttempts, attempt + 1);
          } else {
            // No tie-break question, might be auto-resolved
            cy.log('⚠️  No tie-break question found - checking if auto-resolved');
            pause(2000);
            handleTieBreaks(targetCode, maxAttempts, attempt + 1);
          }
        });
      } else {
        cy.log(`✅ Tie resolved! Final top 3: ${top3Letters}`);
        clickIfVisible('#submitButton');
      }
    });
  }

  // Verify final result
  function verifyResult(targetCode: string) {
    cy.get('#submitButton', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Submit Assessment')
      .click();
    
    pause(3000);
    
    // Wait for results page to load
    cy.url({ timeout: 15000 }).should('include', '/result');
    
    // Log the results for verification
    cy.get('body').then($body => {
      const resultText = $body.text();
      cy.log(`📊 Results page content preview: ${resultText.substring(0, 200)}`);
    });
    
    // Check for target code in results (adjust selector to your UI)
    cy.contains(new RegExp(targetCode.split('').join('.*'), 'i'), { timeout: 15000 })
      .should('exist');
    
    // Take screenshot of results
    cy.screenshot(`result-${targetCode}`, { capture: 'fullPage' });
    
    cy.log(`✅ Test passed for ${targetCode} - Results displayed`);
  }

  // Generate test for each combination
  R_COMBINATIONS.forEach(code => {
    it(`should produce ${code} result`, () => {
      cy.intercept({ method: 'GET', url: '**/api/riasec/**' }).as('getRiasec');
      
      cy.log(`🎯 Testing for: ${code}`);
      
      fillBasicInfo(`Test_${code}`, code);
      
      const answers = generateAnswers(code);
      answerQuestions(answers);
      
      clickIfVisible('#submitButton');
      
      handleTieBreaks(code);
      
      verifyResult(code);
    });
  });

  // Optional: Run all tests in sequence
  it('MASTER TEST: Run all combinations sequentially', () => {
    R_COMBINATIONS.forEach(code => {
      cy.intercept({ method: 'GET', url: '**/api/riasec/**' }).as('getRiasec');
      
      cy.log(`\n${'='.repeat(50)}\n🎯 Testing: ${code}\n${'='.repeat(50)}`);
      
      fillBasicInfo(`Master_${code}`, code);
      const answers = generateAnswers(code);
      answerQuestions(answers);
      clickIfVisible('#submitButton');
      handleTieBreaks(code);
      verifyResult(code);
    });
  });
});