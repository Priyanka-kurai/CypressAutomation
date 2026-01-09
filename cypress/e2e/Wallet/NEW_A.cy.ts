/// <reference types="cypress" />

// cypress/e2e/riasec_all_a_combinations.cy.ts
describe('RIASEC Assessment: All A-Starting Combinations - Submit and Wait for Results', () => {
  const PAUSE = 600;
  const APP_URL = 'https://riasec-app-592805402248.asia-southeast1.run.app';
  const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzNYZYL7vB990Jmg7mYXwIFQbpeg7TkP6PDn1qMQAr1qdwle-Wu_PJDprpMHdZn4wOqfQ/exec';

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

  const A_COMBINATIONS = [
    'ARI', 'ARS', 'ARE', 'ARC',
    'AIR', 'AIS', 'AIE', 'AIC',
    'ASR', 'ASI', 'ASE', 'ASC',
    'AER', 'AEI', 'AES', 'AEC',
    'ACR', 'ACI', 'ACS', 'ACE'
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
    const testData: any = { 
      targetCode, 
      timestamp: new Date().toISOString(),
      testName,
      testStartTime: new Date().toISOString()
    };
    
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
      return cy.wrap(testData);
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
    testData.expectedRIASEC = targetCode;
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

  function extractAptitudeScores() {
    return cy.get('body').then($body => {
      const aptitudeScores: Record<string, string> = {};
      const $apt = $body.find('#aptitudeScores');
      
      if ($apt.length > 0) {
        $apt.find('.mb-2').each((_, el) => {
          const $block = Cypress.$(el);
          const label = $block.find('.d-flex small').first().text().trim();
          const percent = $block.find('.d-flex small.fw-bold').first().text().trim() || 
                         ($block.find('.progress-bar').attr('aria-valuenow') ? 
                          `${$block.find('.progress-bar').attr('aria-valuenow')}%` : '');
          if (label) {
            aptitudeScores[label] = percent;
          }
        });
      }
      
      return aptitudeScores;
    });
  }

  function extractJobsFromCluster() {
    return cy.get('body').then($body => {
      const jobs: string[] = [];
      const $jobCards = $body.find('.job-card, .card.h-100, .recommendation-card');
      
      if ($jobCards.length > 0) {
        $jobCards.slice(0, 20).each((index, card) => {
          const $card = Cypress.$(card);
          const jobTitle = $card.find('.card-title').text().trim() ||
                          $card.find('h6, h5, h4').first().text().trim() ||
                          $card.find('[class*="title"]').text().trim();
          
          let matchPercent = $card.find('.match-percentage .fw-bold').text().trim() ||
                           $card.find('[class*="percent"]').text().trim() ||
                           $card.find('.fw-bold').first().text().trim();
          
          if (jobTitle) {
            const jobEntry = `${index + 1}. ${jobTitle}${matchPercent ? ` (${matchPercent})` : ''}`;
            jobs.push(jobEntry);
          }
        });
      }
      
      return jobs;
    });
  }

 function clickAllJobClusters() {
  cy.log('🔍 Looking for job clusters to click...');
  
  return cy.get('.cluster-select-card').then(($clusters) => {
    const clusterCount = $clusters.length;
    cy.log(`Found ${clusterCount} cluster cards`);
    
    if (clusterCount === 0) {
      cy.log('ℹ️ No cluster cards found on this page');
      return {};
    }
    
    // Store cluster names
    const clusterNames: string[] = [];
    $clusters.each((index, cluster) => {
      const $cluster = Cypress.$(cluster);
      clusterNames[index] = $cluster.find('h5').text().trim();
    });
    
    const clusterJobsData: Record<string, string[]> = {};
    
    // Use a recursive function to handle async operations
    const processCluster = (index: number): Cypress.Chainable<any> => {
      if (index >= clusterCount) {
        cy.log('✅ All clusters clicked!');
        return cy.wrap(clusterJobsData);
      }
      
      const clusterName = clusterNames[index];
      cy.log(`🖱️ Cluster ${index + 1} of ${clusterCount}: ${clusterName}`);
      
      return cy.get('.cluster-select-card').eq(index).click({ force: true }).then(() => {
        pause(3000);
        
        // Extract jobs from this cluster
        return cy.get('body').then($body => {
          const jobs: string[] = [];
          const $jobCards = $body.find('.job-card, .card.h-100, .recommendation-card');
          
          if ($jobCards.length > 0) {
            $jobCards.slice(0, 20).each((jobIndex, card) => {
              const $card = Cypress.$(card);
              const jobTitle = $card.find('.card-title').text().trim() ||
                              $card.find('h6, h5, h4').first().text().trim() ||
                              $card.find('[class*="title"]').text().trim();
              
              let matchPercent = $card.find('.match-percentage .fw-bold').text().trim() ||
                               $card.find('[class*="percent"]').text().trim() ||
                               $card.find('.fw-bold').first().text().trim();
              
              if (jobTitle) {
                const jobEntry = `${jobIndex + 1}. ${jobTitle}${matchPercent ? ` (${matchPercent})` : ''}`;
                jobs.push(jobEntry);
              }
            });
          }
          
          clusterJobsData[clusterName] = jobs;
          cy.log(`  ✅ Found ${jobs.length} jobs in ${clusterName}`);
          
          // Click back to clusters
          return cy.get('body').then($body => {
            const $backBtn = $body.find('button:contains("Back to Clusters")');
            if ($backBtn.length > 0) {
              return cy.wrap($backBtn).click({ force: true }).then(() => {
                pause(2000);
                return cy.get('.cluster-select-card', { timeout: 15000 })
                  .should('exist')
                  .and('have.length.at.least', 1)
                  .then(() => {
                    return processCluster(index + 1);
                  });
              });
            } else {
              cy.log('⚠️ Back button not found, trying to reload or continue');
              return processCluster(index + 1);
            }
          });
        });
      });
    };
    
    return processCluster(0);
  });
}

function waitForResultGeneration(targetCode: string) {
  cy.log('═══════════════════════════════════════');
  cy.log('📊 Submitting assessment...');
  
  // Wait for submit button and click
  cy.contains('button', 'Submit', { timeout: 10000 })
    .should('be.visible')
    .and('not.be.disabled')
    .click();
  
  cy.log('✅ Assessment submitted! Waiting for results...');
  
  // Wait for URL to change to results page
  cy.url({ timeout: 30000 }).should('include', '/result');
  cy.log('✓ Results page loaded');
  
  // Take screenshot of initial results
  cy.screenshot(`result-initial-${targetCode}`, { capture: 'fullPage' });
  pause(20000);
  
  // Wait for result code to appear
  cy.get('body', { timeout: 45000 }).then(($body) => {
    const text = $body.text();
    const hasCode = text.match(/Current Code:\s*([A-Z]{3})/i) || text.match(/\b([RIASEC]{3})\b/);
    if (!hasCode) {
      throw new Error('Result code not found on page');
    }
    cy.log(`✓ Result code detected: ${hasCode[1]}`);
  });
  
  // Wait for recommendations container
  cy.log('⏳ Waiting for recommendations container...');
  cy.get('#recommendationsContainer', { timeout: 60000 }).should('be.visible');
  cy.log('✓ Recommendations container loaded');
  
  // Check if Get Recommendations button is visible and click it
  cy.get('body').then($body => {
    const $btn = $body.find('#generateRecommendations');
    if ($btn.length > 0 && $btn.is(':visible') && !$btn.hasClass('d-none')) {
      cy.log('🔘 Clicking Get Recommendations button...');
      cy.get('#generateRecommendations').click({ force: true });
      
      // Wait for job recommendations to start loading
      cy.log('⏳ Waiting for job recommendations to generate...');
      cy.get('#recommendationsContainer .spinner-border, .loading-spinner, [class*="loading"]', { timeout: 30000 })
        .should('exist')
        .then(() => {
          cy.log('✓ Job recommendations generation started...');
        });
    } else {
      cy.log('ℹ️ Recommendations button not visible or already clicked');
    }
  });
  
  // Wait for cluster cards to appear
  cy.log('⏳ Waiting for job clusters to load...');
  cy.get('#recommendationsContainer .cluster-select-card', { timeout: 90000 })
    .should('exist')
    .and('have.length.at.least', 1)
    .then(($clusters) => {
      cy.log(`✓ Job clusters loaded: ${$clusters.length} clusters found`);
      
      // Click on all job clusters and collect job data
      return clickAllJobClusters().then((clusterJobsData) => {
        // Store cluster jobs data
        const testData = Cypress.env('currentTestData') || {};
        testData.clusterJobsData = JSON.stringify(clusterJobsData);
        
        // Format cluster jobs for Google Sheets
        let clusterJobsText = '';
        Object.entries(clusterJobsData).forEach(([clusterName, jobs]) => {
          clusterJobsText += `${clusterName}: ${jobs.length} jobs\n`;
          jobs.forEach(job => {
            clusterJobsText += `  ${job}\n`;
          });
          clusterJobsText += '\n';
        });
        testData.clusterJobsSummary = clusterJobsText;
        Cypress.env('currentTestData', testData);
        
        return cy.wrap(clusterJobsData);
      });
    }).then(() => {
      // Continue with the rest of the function
      // Wait for aptitude scores to load
      cy.log('⏳ Waiting for aptitude scores...');
      cy.get('#aptitudeScores', { timeout: 45000 })
        .should('exist')
        .scrollIntoView({ easing: 'linear', duration: 800 });
      
      cy.get('#aptitudeScores')
        .should('be.visible');
      
      cy.get('#aptitudeScores .progress-bar', { timeout: 45000 })
        .should('have.length.at.least', 5);
      
      cy.log('✓ Aptitude scores loaded and visible');
      
      // Extract aptitude scores
      return cy.get('body').then($body => {
        const aptitudeScores: Record<string, string> = {};
        const $apt = $body.find('#aptitudeScores');
        
        if ($apt.length > 0) {
          $apt.find('.mb-2').each((_, el) => {
            const $block = Cypress.$(el);
            const label = $block.find('.d-flex small').first().text().trim();
            const percent = $block.find('.d-flex small.fw-bold').first().text().trim() || 
                           ($block.find('.progress-bar').attr('aria-valuenow') ? 
                            `${$block.find('.progress-bar').attr('aria-valuenow')}%` : '');
            if (label) {
              aptitudeScores[label] = percent;
            }
          });
        }
        
        return cy.wrap(aptitudeScores);
      });
    }).then((aptitudeScores) => {
      const testData = Cypress.env('currentTestData') || {};
      
      // Extract final result code
      return cy.get('body').then($body => {
        const text = $body.text();
        const match = text.match(/Current Code:\s*([A-Z]{3})/i) || text.match(/\b([RIASEC]{3})\b/);
        const actualCode = match ? match[1] : 'NOT_FOUND';
        
        // Update test data with all collected information
        testData.actualRIASEC = actualCode;
        testData.aptitudeScores = JSON.stringify(aptitudeScores);
        testData.testEndTime = new Date().toISOString();
        testData.totalTestDuration = `${Date.now() - new Date(testData.testStartTime).getTime()}ms`;
        testData.testStatus = (actualCode === targetCode) ? 'PASS' : 'FAIL';
        
        // Extract job counts
        const jobCount = $body.find('.job-card, .card, .recommendation-card').length;
        const clusterCount = $body.find('.cluster-select-card').length;
        const aptitudeCount = Object.keys(aptitudeScores).length;
        
        testData.jobCount = jobCount;
        testData.clusterCount = clusterCount;
        testData.aptitudeCount = aptitudeCount;
        
        cy.log('═══════════════════════════════════════');
        cy.log('🎉 RESULT GENERATION COMPLETE!');
        cy.log(`📊 Expected RIASEC: ${targetCode}`);
        cy.log(`📊 Actual RIASEC: ${actualCode}`);
        cy.log(`📊 Test Status: ${testData.testStatus}`);
        cy.log(`📊 Job Clusters: ${clusterCount}`);
        cy.log(`📊 Job Recommendations: ${jobCount}`);
        cy.log(`📊 Aptitude Scores: ${aptitudeCount}`);
        cy.log('═══════════════════════════════════════');
        
        // Take final screenshot
        cy.screenshot(`result-complete-${targetCode}`, { capture: 'fullPage' });
        
        // Log all data to Google Sheets
        return logToGoogleSheets(testData).then(() => {
          cy.log('✅ All data successfully collected!');
          pause(3000);
        });
      });
    });
}

  // Run tests for all A combinations
  A_COMBINATIONS.slice(1).forEach(code => {
    it(`should complete assessment, generate full results, click all job clusters, and log to Google Sheets for ${code}`, () => {
      const targetCode = code;
      cy.intercept({ method: 'GET', url: '**/api/riasec/**' }).as('getRiasec');

      fillBasicInfo(`Test_${targetCode}`, targetCode).then((basicInfo) => {
        const answers = generateAnswers(targetCode);
        answerQuestions(answers);
        waitForResultGeneration(targetCode);
      });
    });
  });
});
export {}