describe('RIASEC Assessment: All C-Starting Combinations (with Google Sheets Logging)', () => {
  const PAUSE = 600;
  const APP_URL = 'https://job-recommendation-878524709646.asia-southeast1.run.app/';

  // 🔑 GOOGLE SHEETS CONFIG
  // Replace with your Web App URL from Google Apps Script deployment
  const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwTUK2EBJcVtlx7R8MbNxATylBM511yuJ86PamhTHjeQgvYh89__-81meKOz6NCWchKJg/exec';

  // ✅ CORRECT MAPPING based on your actual questions (same mapping used across files)
  const QUESTION_MAP: Record<number, { A: string; B: string }> = {
    1: { A: 'R', B: 'I' },
    2: { A: 'I', B: 'R' },
    3: { A: 'R', B: 'A' },
    4: { A: 'A', B: 'R' },
    5: { A: 'R', B: 'S' },
    6: { A: 'S', B: 'R' },
    7: { A: 'R', B: 'E' },
    8: { A: 'E', B: 'R' },
    9: { A: 'R', B: 'C' },
    10: { A: 'C', B: 'R' },
    11: { A: 'I', B: 'A' },
    12: { A: 'A', B: 'I' },
    13: { A: 'I', B: 'S' },
    14: { A: 'S', B: 'I' },
    15: { A: 'I', B: 'E' },
    16: { A: 'E', B: 'I' },
    17: { A: 'I', B: 'C' },
    18: { A: 'C', B: 'I' },
    19: { A: 'A', B: 'S' },
    20: { A: 'S', B: 'A' },
    21: { A: 'A', B: 'E' },
    22: { A: 'E', B: 'A' },
    23: { A: 'A', B: 'C' },
    24: { A: 'C', B: 'A' },
    25: { A: 'S', B: 'E' },
    26: { A: 'E', B: 'S' },
    27: { A: 'S', B: 'C' },
    28: { A: 'C', B: 'S' },
    29: { A: 'E', B: 'C' },
    30: { A: 'C', B: 'E' }
  };

  // List of current fields to randomly select from
  const CURRENT_FIELDS = [
    'IT', 'Engineering', 'Healthcare', 'Finance', 'Education',
    'Marketing', 'Sales', 'Design', 'Research', 'Manufacturing',
    'Consulting', 'Media', 'Agriculture', 'Hospitality', 'Legal'
  ];

  const C_COMBINATIONS = [
    'CRA','CRI','CRS','CRE',
    'CAR','CAI','CAS','CAE',
    'CIR','CIA','CIS','CIE',
    'CSR','CSA','CSI','CSE',
    'CER','CEA','CEI','CES'
  ];

  const pause = (ms = PAUSE) => cy.wait(ms);

  // 📊 Log data to Google Sheets - WITH WAIT
  function logToGoogleSheets(data: any) {
    cy.log('📊 Logging to Google Sheets...');
    cy.log('📊 Data being sent:', JSON.stringify(data));

    return cy.request({
      method: 'POST',
      url: GOOGLE_SHEETS_WEB_APP_URL,
      body: data,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000,
      failOnStatusCode: false
    }).then(response => {
      cy.log(`📊 Response status: ${response.status}`);
      cy.log(`📊 Response body: ${JSON.stringify(response.body)}`);

      if (response.status === 200) {
        cy.log('✅ Successfully logged to Google Sheets!');
        cy.log(`✅ Row added: ${response.body.row || 'unknown'}`);
      } else {
        cy.log('❌ Failed to log to Google Sheets!');
        cy.log(`❌ Status: ${response.status}`);
        cy.log(`❌ Body: ${JSON.stringify(response.body)}`);
      }

      // Wait 2 seconds after logging to ensure Sheet updates
      cy.wait(2000);
    });
  }

  function selectInterestsForCode(targetCode: string) {
    const allInterests = ['#interest1', '#interest2', '#interest3', '#interest4',
                         '#interest5', '#interest6', '#interest7', '#interest8', '#interest9'];

    const numToSelect = Math.floor(Math.random() * 3) + 3;
    const selectedInterests: string[] = [];
    const selectedInterestNames: string[] = [];

    const shuffled = [...allInterests].sort(() => Math.random() - 0.5);

    cy.get('body').then($body => {
      for (let i = 0; i < numToSelect && i < shuffled.length; i++) {
        const interestId = shuffled[i];
        if ($body.find(interestId).length) {
          cy.get(interestId).check().should('be.checked');
          selectedInterests.push(interestId);

          cy.get(`label[for="${interestId.substring(1)}"]`).invoke('text').then(text => {
            selectedInterestNames.push(text.trim());
            cy.log(`✓ Selected: ${text.trim()}`);
          });
        }
      }

      cy.log(`📋 Total interests selected: ${selectedInterests.length}`);
    });

    cy.screenshot(`interests-${targetCode}`, { capture: 'fullPage' });
    cy.wait(500);

    return cy.wrap(selectedInterestNames);
  }

  function fillBasicInfo(testName: string, targetCode: string) {
    const testData: any = {
      targetCode: targetCode,
      timestamp: new Date().toISOString(),
      testName: testName
    };

    cy.visit(APP_URL);
    pause(800);
    cy.contains('Get Started', { timeout: 10000 }).click();
    pause();

    const email = `${testName.toLowerCase()}_${Date.now()}@example.com`;

    const randomField = CURRENT_FIELDS[Math.floor(Math.random() * CURRENT_FIELDS.length)];

    // Store input data
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

    // selectInterestsForCode now returns selected interest NAMES for logging
    selectInterestsForCode(targetCode).then(interests => {
      testData.selectedInterests = interests.join(', ');

      cy.contains('button.btn.btn-primary', 'Continue to RIASEC Assessment', { timeout: 10000 })
        .should('be.visible')
        .click();
      pause(800);

      // Store test data in Cypress env for later use
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

    const targetScores: Record<string, number> = {
      [first]: 5,
      [second]: 4,
      [third]: 3
    };

    const currentScores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const answerLog: string[] = [];

    for (let q = 1; q <= 30; q++) {
      const optionA = QUESTION_MAP[q].A;
      const optionB = QUESTION_MAP[q].B;

      const scoreA = targetScores[optionA] || 0;
      const scoreB = targetScores[optionB] || 0;

      let answer: string;
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

    // Store answers and expected scores in Cypress env for logging later
    const testData = Cypress.env('currentTestData') || {};
    testData.answers = answerLog.join(', ');
    testData.expectedScores = JSON.stringify(currentScores);
    Cypress.env('currentTestData', testData);

    return answers;
  }

  function selectAnswer(choice: 'A' | 'B', questionNum: number) {
    cy.log(`  → Q${questionNum}: Selecting option ${choice}`);

    cy.get('input[type="radio"]', { timeout: 10000 })
      .should('have.length', 2);

    cy.get('input[type="radio"]').then($radios => {
      if (choice === 'A') {
        cy.wrap($radios[0]).click({ force: true });
        cy.wrap($radios[0]).should('be.checked');
      } else {
        cy.wrap($radios[1]).click({ force: true });
        cy.wrap($radios[1]).should('be.checked');
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
        cy.log('⚠️ No submit button, checking for auto-submit');
      }
    });

    pause(2000);

    cy.url({ timeout: 15000 }).should('include', '/result');

    cy.log('📊 Results page loaded');
    cy.screenshot(`result-${targetCode}`, { capture: 'fullPage' });

    // Extract and log result and then send to Google Sheets
    return cy.get('body').then($body => {
      const text = $body.text();
      cy.log(`Looking for ${targetCode} in results...`);

      const match = text.match(/Current Code:\s*([A-Z]{3})/i) || 
                   text.match(/\b([RIASEC]{3})\b/);

      const testData = Cypress.env('currentTestData') || {};
      testData.actualResult = match ? match[1] : 'NOT_FOUND';
      testData.testStatus = (match && match[1] === targetCode) ? 'PASS' : 'FAIL';
      testData.completedAt = new Date().toISOString();

      if (match) {
        const actualCode = match[1];
        cy.log(`📊 Expected: ${targetCode}`);
        cy.log(`📊 Actual: ${actualCode}`);

        if (actualCode === targetCode) {
          cy.log(`✅ SUCCESS! ${targetCode} matches!`);
        } else {
          cy.log(`❌ MISMATCH! Expected ${targetCode}, got ${actualCode}`);
        }
      } else {
        cy.log('⚠️ Could not parse result code from page');
      }

      // 🆕 Click "Get Recommendations" button (if present) and take screenshots
      cy.log('═══════════════════════════════════════');
      cy.log('🔍 Looking for Get Recommendations button...');

      cy.get('body').then($b => {
        if ($b.find('#generateRecommendations').length > 0) {
          cy.get('#generateRecommendations').should('be.visible').click();
          cy.log('✓ Clicked Get Recommendations');
          cy.log('⏳ Waiting for job recommendations to load...');
          pause(8000);
        } else {
          cy.log('⚠️ No Get Recommendations button found');
        }
      });

      pause(3000);
      cy.scrollTo('top');
      pause(1000);
      cy.screenshot(`recommendations-${targetCode}`, { capture: 'fullPage' });
      cy.log('📸 Screenshot taken: recommendations-' + targetCode);

      // 📊 LOG TO GOOGLE SHEETS AND WAIT FOR COMPLETION
      cy.log('═══════════════════════════════════════');
      cy.log('📊 Sending data to Google Sheets...');
      cy.log('═══════════════════════════════════════');

      return logToGoogleSheets(testData).then(() => {
        cy.log('═══════════════════════════════════════');
        cy.log('✅ Test completed and logged!');
        cy.log('═══════════════════════════════════════');
      });
    });
  }

  // Test CRA first
  it('should produce CRA result and log to Google Sheets', () => {
    const targetCode = 'CRA';

    cy.intercept({ method: 'GET', url: '**/api/riasec/**' }).as('getRiasec');

    cy.log('╔═══════════════════════════════════════╗');
    cy.log(`║  TESTING: ${targetCode}                      ║`);
    cy.log('╚═══════════════════════════════════════╝');

    fillBasicInfo(`Test_${targetCode}`, targetCode);
    const answers = generateAnswers(targetCode);
    answerQuestions(answers);
    handleSubmitAndVerify(targetCode).then(() => {
      cy.log('🎉 Test complete! Check your Google Sheet now!');
      cy.log(`📊 Open: https://sheets.google.com`);
    });
  });

  // Test all other C combinations
  C_COMBINATIONS.slice(1).forEach(code => {
    it(`should produce ${code} result and log to Google Sheets`, () => {
      const targetCode = code;

      cy.intercept({ method: 'GET', url: '**/api/riasec/**' }).as('getRiasec');

      fillBasicInfo(`Test_${code}`, code);
      const answers = generateAnswers(code);
      answerQuestions(answers);
      handleSubmitAndVerify(code).then(() => {
        cy.log('🎉 Test complete! Check your Google Sheet now!');
      });
    });
  });
});
