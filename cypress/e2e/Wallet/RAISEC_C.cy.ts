/// <reference types="cypress" />

// cypress/e2e/riasec_all_a_combinations.cy.ts
describe('RIASEC Assessment: All C-Starting Combinations with Google Sheets Logging', () => {
  const PAUSE = 600;
  const APP_URL = 'https://riasec-app-592805402248.asia-southeast1.run.app';
  const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzeg-0wLCtCsBIAoHg_NmsW76s12i-zhYdSXg77z3pGLP6bDu55K-iVXRcvkSAWQ0m-lw/exec';
//const SHEET_NAME = 'RIASEC_C';
  const QUESTION_MAP: Record<number, { A: string; B: string }> = {
    1: { A: 'R', B: 'I' }, 2: { A: 'I', B: 'R' }, 3: { A: 'R', B: 'A' }, 4: { A: 'A', B: 'R' },
    5: { A: 'R', B: 'S' }, 6: { A: 'S', B: 'R' }, 7: { A: 'R', B: 'E' }, 8: { A: 'E', B: 'R' },
    9: { A: 'R', B: 'C' }, 10: { A: 'C', B: 'R' }, 11: { A: 'I', B: 'A' }, 12: { A: 'A', B: 'I' },
    13: { A: 'I', B: 'S' }, 14: { A: 'S', B: 'I' }, 15: { A: 'I', B: 'E' }, 16: { A: 'E', B: 'I' },
    17: { A: 'I', B: 'C' }, 18: { A: 'C', B: 'I' }, 19: { A: 'A', B: 'S' }, 20: { A: 'S', B: 'A' },
    21: { A: 'A', B: 'E' }, 22: { A: 'E', B: 'A' }, 23: { A: 'A', B: 'C' }, 24: { A: 'C', B: 'A' },
    25: { A: 'S', B: 'E' }, 26: { A: 'E', B: 'S' }, 27: { A: 'S', B: 'C' }, 28: { A: 'C', B: 'S' },
    29: { A: 'E', B: 'C' }, 30: { A: 'C', B: 'E' }
  };

  const CURRENT_FIELDS = [
    'IT', 'Engineering', 'Healthcare', 'Finance', 'Education',
    'Marketing', 'Sales', 'Design', 'Research', 'Manufacturing',
    'Consulting', 'Media', 'Agriculture', 'Hospitality', 'Legal'
  ];
const C_COMBINATIONS = [
    'CAR', 'CAI', 'CAS', 'CAE',
    'CRA', 'CRI', 'CRS', 'CRE',
    'CIA', 'CIR', 'CIS', 'CIE',
    'CSA', 'CSI', 'CSR', 'CSE',
    'CEA', 'CEI', 'CER', 'CES'
  ];

  const pause = (ms = PAUSE) => cy.wait(ms);

  function logToGoogleSheets(data: any) {
    cy.log('📊 Logging to Google Sheets...');
    cy.log('📊 Data being sent:', JSON.stringify(data));
    return cy.request({
      method: 'POST',
      url: GOOGLE_SHEETS_WEB_APP_URL,
      body: data,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
      failOnStatusCode: false
    }).then(response => {
      cy.log(`📊 Response status: ${response.status}`);
      cy.log(`📊 Response body: ${JSON.stringify(response.body)}`);
      if (response.status === 200) {
        cy.log('✅ Successfully logged to Google Sheets!');
      } else {
        cy.log('❌ Failed to log to Google Sheets!');
      }
      cy.wait(2000);
    });
  }

  function selectInterestsForCode(targetCode: string): Cypress.Chainable<string[]> {
    const allInterests = [
      '#interest1', '#interest2', '#interest3', '#interest4',
      '#interest5', '#interest6', '#interest7', '#interest8', '#interest9'
    ];

    const numToSelect = Math.floor(Math.random() * 3) + 3;
    const selectedNames: string[] = [];

    return cy.get('body').then($body => {
      const present = allInterests.filter(id => $body.find(id).length > 0);
      const shuffled = Cypress._.shuffle(present);
      const chosen = shuffled.slice(0, Math.min(numToSelect, shuffled.length));
      cy.log(`Chosen interest ids: ${chosen.join(', ')}`);
      return cy.wrap(chosen);
    })
    .each((interestId: string) => {
      cy.get(interestId).check({ force: true }).should('be.checked');
      cy.get(`label[for="${interestId.substring(1)}"]`)
        .invoke('text')
        .then(txt => {
          selectedNames.push(txt.trim());
          cy.log(`✓ Selected: ${txt.trim()}`);
        });
    })
    .then(() => {
      cy.log(`📋 Total interests selected: ${selectedNames.length}`);
      cy.screenshot(`interests-${targetCode}`, { capture: 'fullPage' });
      return cy.wrap(selectedNames);
    });
  }

  function fillBasicInfo(testName: string, targetCode: string) {
    const testData: any = { targetCode, timestamp: new Date().toISOString(), testName };
    cy.visit(APP_URL);
    pause(800);
    cy.contains('Get Started', { timeout: 10000 }).click();
    pause();

    const email = `${testName.toLowerCase()}_${Date.now()}@example.com`;
    const randomField = CURRENT_FIELDS[Math.floor(Math.random() * CURRENT_FIELDS.length)];

    testData.name = testName;
    testData.email = email;
    testData.educationLevel = "Bachelor's Degree";
    testData.experienceYears = '2';
    testData.currentField = randomField;

    cy.log(`📝 Using random field: ${randomField}`);

    cy.get('input[name="name"]').clear().type(testName);
    cy.get('input[name="email"]').clear().type(email);
    cy.get('#education_level').select("Bachelor's Degree");
    cy.get('#experience_years').clear().type('2');
    cy.get('#current_field').clear().type(randomField);

    cy.screenshot(`basic-info-${targetCode}`, { capture: 'fullPage' });

    pause(500);
    cy.contains('Continue to Interests').click();
    pause();

    return selectInterestsForCode(targetCode).then(interests => {
      testData.selectedInterests = interests.join(', ');
      cy.contains('button.btn.btn-primary', 'Continue to RIASEC Assessment', { timeout: 10000 })
        .should('be.visible')
        .click();
      pause(800);
      Cypress.env('currentTestData', testData);
    });
  }

  function generateAnswers(targetCode: string): Record<number, string> {
    const answers: Record<number, string> = {};
    const [first, second, third] = targetCode.split('');

    cy.log('═══════════════════════════════════════');
    cy.log(`🎯 TARGET: ${targetCode}`);
    cy.log(`📊 Priority: ${first}(5pts) > ${second}(4pts) > ${third}(3pts)`);
    cy.log('═══════════════════════════════════════');

    const targetScores: Record<string, number> = { [first]: 5, [second]: 4, [third]: 3 };
    const currentScores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const answerLog: string[] = [];

    for (let q = 1; q <= 30; q++) {
      const optionA = QUESTION_MAP[q].A;
      const optionB = QUESTION_MAP[q].B;
      const scoreA = targetScores[optionA] || 0;
      const scoreB = targetScores[optionB] || 0;

      let answer: 'A' | 'B';
      if (scoreA > scoreB) {
        answer = 'A';
        currentScores[optionA]++;
      } else if (scoreB > scoreA) {
        answer = 'B';
        currentScores[optionB]++;
      } else {
        answer = 'A';
        currentScores[optionA]++;
      }

      answers[q] = answer;
      answerLog.push(`Q${q}:${answer}`);
      
      const marker = scoreA > 0 || scoreB > 0 ? '⭐' : '  ';
      cy.log(`${marker} Q${q.toString().padStart(2)}: A=${optionA} B=${optionB} → ${answer}`);
    }

    cy.log('───────────────────────────────────────');
    cy.log('📊 Expected scores:');
    Object.entries(currentScores)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .forEach(([letter, score]) => {
        const marker = [first, second, third].includes(letter) ? '🎯' : '  ';
        cy.log(`${marker} ${letter}: ${score}`);
      });
    cy.log('═══════════════════════════════════════');

    const testData = Cypress.env('currentTestData') || {};
    testData.answers = answerLog.join(', ');
    testData.expectedScores = JSON.stringify(currentScores);
    Cypress.env('currentTestData', testData);

    return answers;
  }

  function selectAnswer(choice: 'A' | 'B', questionNum: number) {
    cy.log(`  → Q${questionNum}: Selecting option ${choice}`);
    cy.get('input[type="radio"]', { timeout: 10000 }).should('have.length', 2);
    cy.get('input[type="radio"]').then($radios => {
      if (choice === 'A') {
        cy.wrap($radios[0]).click({ force: true }).should('be.checked');
      } else {
        cy.wrap($radios[1]).click({ force: true }).should('be.checked');
      }
    });
    pause(200);
  }

  function answerQuestions(answers: Record<number, string>) {
    for (let q = 1; q <= 30; q++) {
      cy.log(`📝 Question ${q}`);
      cy.contains(`Question ${q} of 30`, { timeout: 15000 }).should('be.visible');
      selectAnswer(answers[q] as 'A' | 'B', q);
      cy.contains('button', 'Next Question', { timeout: 10000 })
        .should('be.visible')
        .and('not.be.disabled')
        .click();
      pause(500);
    }
  }

  function handleSubmitAndVerify(targetCode: string) {
    cy.log('═══════════════════════════════════════');
    cy.log('📊 Waiting for final scores...');
    
    cy.get('body', { timeout: 5000 }).then($body => {
      if ($body.find('button:contains("Submit")').length > 0) {
        cy.log('✓ Submit button found');
        cy.contains('button', 'Submit').click();
      } else {
        cy.log('⚠️ No submit button found');
      }
    });

    pause(6000);
    cy.url({ timeout: 15000 }).should('include', '/result');
    cy.screenshot(`result-${targetCode}`, { capture: 'fullPage' });

    // Check if recommendations button needs clicking (only if visible)
    cy.log('🔍 Checking for recommendations button...');
    cy.get('body').then($body => {
      const $btn = $body.find('#generateRecommendations');
      if ($btn.length > 0 && $btn.is(':visible') && !$btn.hasClass('d-none')) {
        cy.log('🔘 Found visible Get Recommendations button - clicking it...');
        cy.get('#generateRecommendations').click({ force: true });
        pause(10000);
      } else {
        cy.log('ℹ️ Recommendations button hidden or not found - jobs already loaded');
        pause(3000);
      }
    });

    cy.log('⏳ Waiting for job recommendations to load...');
    pause(5000);

    // Extract and save results + jobs + aptitudes
    return cy.get('body').then($body => {
      const text = $body.text();
      const match = text.match(/Current Code:\s*([A-Z]{3})/i) || text.match(/\b([RIASEC]{3})\b/);
      const testData = Cypress.env('currentTestData') || {};
      testData.actualResult = match ? match[1] : 'NOT_FOUND';
      testData.testStatus = (match && match[1] === targetCode) ? 'PASS' : 'FAIL';

      cy.log(`📊 Expected: ${targetCode}, Actual: ${testData.actualResult}`);
      cy.log(`📊 Test Status: ${testData.testStatus}`);

      // Extract jobs with detailed logging
      const topJobs: string[] = [];
      const $jobCards = $body.find('.job-card');
      
      cy.log(`🔍 Searching for job cards...`);
      cy.log(`🔍 Found ${$jobCards.length} job cards with selector '.job-card'`);
      
      if ($jobCards.length === 0) {
        cy.log('⚠️ No .job-card elements found, trying alternative selectors...');
        
        const $altCards = $body.find('.card.h-100, .recommendation-card, [class*="job"]');
        cy.log(`🔍 Found ${$altCards.length} cards with alternative selectors`);
        
        if ($altCards.length > 0) {
          cy.log('✅ Using alternative card selector');
          $altCards.slice(0, 15).each((index, card) => {
            const $card = Cypress.$(card);
            let jobTitle = $card.find('.card-title').text().trim() ||
                          $card.find('h6, h5, h4').first().text().trim() ||
                          $card.find('[class*="title"]').text().trim();
            
            let matchPercent = $card.find('.match-percentage .fw-bold').text().trim() ||
                             $card.find('[class*="percent"]').text().trim() ||
                             $card.find('.fw-bold').first().text().trim();
            
            if (jobTitle) {
              const jobEntry = `${index + 1}. ${jobTitle}${matchPercent ? ` (${matchPercent})` : ''}`;
              topJobs.push(jobEntry);
              cy.log(`  📌 Job ${index + 1}: ${jobTitle} ${matchPercent}`);
            }
          });
        }
      } else {
        $jobCards.slice(0, 15).each((index, card) => {
          const $card = Cypress.$(card);
          const jobTitle = $card.find('.card-title').text().trim();
          const matchPercent = $card.find('.match-percentage .fw-bold').text().trim();
          
          if (jobTitle) {
            const jobEntry = `${index + 1}. ${jobTitle}${matchPercent ? ` (${matchPercent})` : ''}`;
            topJobs.push(jobEntry);
            cy.log(`  📌 Job ${index + 1}: ${jobTitle} ${matchPercent}`);
          }
        });
      }
      
      if (topJobs.length > 0) {
        testData.top3Jobs = topJobs.slice(0, 15).join(' | ');
        testData.top15Jobs = topJobs.join(' | ');
        testData.topJob1 = topJobs[0] || '';
        testData.topJob2 = topJobs[1] || '';
        testData.topJob3 = topJobs[2] || '';
        
        cy.log(`✅ Extracted ${topJobs.length} jobs`);
        cy.log(`📋 Top 3 Jobs: ${testData.top3Jobs}`);
      } else {
        cy.log('⚠️ No job cards found on page');
        
        const containerText = $body.find('#recommendationsContainer, [id*="recommend"], [class*="recommend"]').text();
        cy.log(`📄 Recommendations area text (first 300 chars): ${containerText.substring(0, 300)}`);
        
        const htmlSnippet = $body.find('#recommendationsContainer, [id*="recommend"]').html();
        cy.log(`📄 HTML structure snippet: ${(htmlSnippet || '').substring(0, 200)}`);
        
        testData.top3Jobs = 'No recommendations found';
        testData.top15Jobs = 'No recommendations found';
        testData.topJob1 = '';
        testData.topJob2 = '';
        testData.topJob3 = '';
      }

      // Extract aptitude scores
      const $apt = $body.find('#aptitudeScores');
      if ($apt.length > 0) {
        cy.log('📊 Extracting aptitude scores...');
        const aptitudeObj: Record<string, string> = {};
        $apt.find('.mb-2').each((_, el) => {
          const $block = Cypress.$(el);
          const label = $block.find('.d-flex small').first().text().trim();
          const percent = $block.find('.d-flex small.fw-bold').first().text().trim() || 
                         ($block.find('.progress-bar').attr('aria-valuenow') ? 
                          `${$block.find('.progress-bar').attr('aria-valuenow')}%` : '');
          if (label) {
            aptitudeObj[label] = percent;
            cy.log(`  📌 ${label}: ${percent}`);
          }
        });
        testData.aptitudeScores = aptitudeObj;
        testData.aptitudeScoresJson = JSON.stringify(aptitudeObj);
        cy.log(`✅ Aptitude scores extracted: ${Object.keys(aptitudeObj).length} items`);
      } else {
        cy.log('ℹ️ No aptitude scores found on page');
      }

      Cypress.env('currentTestData', testData);
      
      cy.screenshot(`recommendations-${targetCode}`, { capture: 'fullPage' });
      
      return null;
    }).then(() => {
      const finalTestData = Cypress.env('currentTestData') || {};
      finalTestData.completedAt = new Date().toISOString();
      finalTestData.runBy = finalTestData.runBy || Cypress.env('runBy') || 'cypress';
      
      cy.log('═══════════════════════════════════════');
      cy.log('📤 Sending to Google Sheets...');
      cy.log(`📋 Top 3 Jobs: ${finalTestData.top3Jobs}`);
      cy.log(`📋 Test Status: ${finalTestData.testStatus}`);
      cy.log('═══════════════════════════════════════');
      
      return logToGoogleSheets(finalTestData);
    });
  }

  // Run tests for all A combinations
  C_COMBINATIONS.slice(1).forEach(code => {
    it(`should produce ${code} result and log to Google Sheets`, () => {
      const targetCode = code;
      cy.intercept({ method: 'GET', url: '**/api/riasec/**' }).as('getRiasec');

      fillBasicInfo(`Test_${targetCode}`, targetCode).then(() => {
        const answers = generateAnswers(targetCode);
        answerQuestions(answers);
        handleSubmitAndVerify(targetCode).then(() => {
          cy.log('🎉 Test complete! Check your Google Sheet now!');
        });
        
    });
  });
});
})