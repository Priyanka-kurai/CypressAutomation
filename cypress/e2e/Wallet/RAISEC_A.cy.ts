/// <reference types="cypress" />

// cypress/e2e/riasec_all_a_combinations.cy.ts
describe('RIASEC Assessment: All A-Starting Combinations - Submit and Wait for Results', () => {
  const PAUSE = 600;
  const APP_URL = 'https://riasec-app-592805402248.asia-southeast1.run.app';
  const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxk7QLIZGQ-wo7fgJ0qKgOXiybdYLGqHoQwBEqjLjaJgINP2Dbv4FYkUkVvfCy_Qreq/exec';

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

  function goBackToClusters(): Cypress.Chainable {
    return cy.get('body', { timeout: 5000 }).then($body => {
      // Strategy 1: Look for back buttons
      const backSelectors = [
        'button:contains("Back")',
        'button:contains("Back to Clusters")',
        'button.btn-secondary',
        'a:contains("Back")',
        '.btn-back',
        '[data-testid="back-button"]'
      ];
      
      for (const selector of backSelectors) {
        const $btn = $body.find(selector);
        if ($btn.length > 0 && $btn.is(':visible')) {
          cy.log(`  ↩️ Found back button with selector: ${selector}`);
          return cy.wrap($btn).first().click({ force: true }).then(() => {
            pause(2000);
            return cy.wrap(true);
          });
        }
      }
      
      // Strategy 2: Look for cluster navigation
      const navSelectors = [
        'a:contains("Clusters")',
        'button:contains("Clusters")',
        '.nav-link',
        '[href*="cluster"]',
        '[data-testid*="cluster"]'
      ];
      
      for (const selector of navSelectors) {
        const $nav = $body.find(selector);
        if ($nav.length > 0 && $nav.is(':visible')) {
          cy.log(`  🔗 Found nav with selector: ${selector}`);
          return cy.wrap($nav).first().click({ force: true }).then(() => {
            pause(2000);
            return cy.wrap(true);
          });
        }
      }
      
      // Strategy 3: If nothing found, reload the results page
      cy.log('  🔄 No navigation found, reloading results page');
      return cy.visit(`${APP_URL}/result`).then(() => {
        pause(3000);
        return cy.wrap(true);
      });
    });
  }

  function clickAllJobClusters() {
    cy.log('🔍 Looking for job clusters to click...');
    
    return cy.get('.cluster-select-card', { timeout: 60000 }).should('be.visible').then(($clusters) => {
      const clusterCount = $clusters.length;
      cy.log(`Found ${clusterCount} cluster cards`);
      
      if (clusterCount === 0) {
        cy.log('ℹ️ No cluster cards found on this page');
        cy.screenshot('no-clusters-found', { capture: 'fullPage' });
        return cy.wrap({});
      }
      
      // Take screenshot of all clusters before clicking
      cy.screenshot('all-clusters-before-clicking', { capture: 'viewport' });
      
      // Store cluster names
      const clusterNames: string[] = [];
      $clusters.each((index, cluster) => {
        const $cluster = Cypress.$(cluster);
        const name = $cluster.find('h5, h6, .card-title, .cluster-name').first().text().trim();
        clusterNames[index] = name || `Cluster ${index + 1}`;
        cy.log(`  Cluster ${index + 1}: ${clusterNames[index]}`);
      });
      
      const clusterJobsData: Record<string, string[]> = {};
      
      // Function to process each cluster
      const processCluster = (index: number): Cypress.Chainable<any> => {
        if (index >= clusterCount) {
          cy.log('✅ All clusters clicked!');
          return cy.wrap(clusterJobsData);
        }
        
        const clusterName = clusterNames[index];
        cy.log(`🖱️ Clicking Cluster ${index + 1} of ${clusterCount}: ${clusterName}`);
        
        // Get the cluster card element with better waiting
        return cy.get('.cluster-select-card').eq(index).should('be.visible').then(($clusterCard) => {
          // Scroll to the element
          cy.wrap($clusterCard).scrollIntoView({ duration: 1000 });
          pause(500);
          
          // Take screenshot before clicking
          cy.screenshot(`before-click-cluster-${index + 1}`, { capture: 'viewport' });
          
          // Try multiple click strategies
          return cy.wrap($clusterCard).click({ force: true, multiple: true }).then(() => {
            cy.log(`  ✅ Clicked cluster ${index + 1}`);
            pause(3000); // Wait for jobs to load
            
            // Take screenshot after clicking cluster
            cy.screenshot(`after-click-cluster-${index + 1}`, { capture: 'fullPage' });
            
            // Extract jobs from this cluster
            return cy.get('body', { timeout: 10000 }).then($body => {
              const jobs: string[] = [];
              
              // Try multiple selectors for job cards
              const selectors = ['.job-card', '.card.h-100', '.recommendation-card', '.card-body', '.job-item', '.card'];
              
              let $jobCards = Cypress.$();
              selectors.forEach(selector => {
                if ($body.find(selector).length > 0) {
                  $jobCards = $jobCards.add($body.find(selector));
                }
              });
              
              cy.log(`  🔍 Looking for job cards... Found: ${$jobCards.length}`);
              
              if ($jobCards.length > 0) {
                $jobCards.slice(0, 15).each((jobIndex, card) => {
                  const $card = Cypress.$(card);
                  const jobTitle = $card.find('.card-title, h5, h6, .job-title, .title, strong, [class*="job"]').first().text().trim() ||
                                  $card.text().split('\n')[0].trim();
                  
                  // Skip empty or invalid titles
                  if (!jobTitle || jobTitle.length < 3 || jobTitle.includes('undefined') || jobTitle === '') {
                    return;
                  }
                  
                  let matchPercent = $card.find('.match-percentage, .percentage, .fw-bold').first().text().trim() ||
                                   $card.find('[class*="percent"]').first().text().trim() ||
                                   $card.text().match(/\d+%/)?.[0] || '';
                  
                  const jobEntry = `${jobIndex + 1}. ${jobTitle}${matchPercent ? ` (${matchPercent})` : ''}`;
                  jobs.push(jobEntry);
                  cy.log(`    Job ${jobIndex + 1}: ${jobTitle.substring(0, 50)}...`);
                });
              }
              
              clusterJobsData[clusterName] = jobs;
              cy.log(`  ✅ Found ${jobs.length} jobs in ${clusterName}`);
              
              // Try multiple strategies to go back
              return goBackToClusters().then(() => {
                // Wait for clusters to be visible again
                return cy.get('.cluster-select-card', { timeout: 10000 })
                  .should('be.visible')
                  .and('have.length.at.least', 1)
                  .then(() => {
                    return processCluster(index + 1);
                  });
              });
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
    
    // Check for and click Get Recommendations button
    cy.get('body').then($body => {
      const $btn = $body.find('#generateRecommendations');
      if ($btn.length > 0 && $btn.is(':visible') && !$btn.prop('disabled')) {
        cy.log('🔘 Clicking Get Recommendations button...');
        cy.get('#generateRecommendations').click({ force: true });
        pause(5000);
      } else {
        cy.log('ℹ️ Recommendations button not found or already processed');
      }
    });
    
    // Wait for clusters with better visibility checks
    cy.log('⏳ Waiting for job clusters to load and be clickable...');
    
    // First, wait for clusters to exist
    cy.get('.cluster-select-card', { timeout: 120000 })
      .should('exist')
      .and('have.length.at.least', 1);
    
    // Then ensure they are visible and enabled
    cy.get('.cluster-select-card', { timeout: 30000 })
      .should('be.visible')
      .each(($cluster, index) => {
        cy.wrap($cluster).should('not.be.disabled');
      });
    
    cy.log('✓ Job clusters are loaded and clickable');
    
    // Take screenshot of clusters before clicking
    cy.screenshot('clusters-loaded', { capture: 'fullPage' });
    
    // Click on all job clusters and collect job data
    return clickAllJobClusters().then((clusterJobsData: Record<string, string[]>) => {
      
      // Store cluster jobs data
      const testData = Cypress.env('currentTestData') || {};
      testData.clusterJobsData = JSON.stringify(clusterJobsData);
      
      // Format cluster jobs for Google Sheets
      let clusterJobsText = '';
      Object.entries(clusterJobsData).forEach(([clusterName, jobs]) => {
        if (jobs.length > 0) {
          clusterJobsText += `${clusterName}: ${jobs.length} jobs\n`;
          jobs.forEach(job => {
            clusterJobsText += `  ${job}\n`;
          });
          clusterJobsText += '\n';
        }
      });
      testData.clusterJobsSummary = clusterJobsText || 'No jobs found in clusters';
      Cypress.env('currentTestData', testData);
      
      // Continue with aptitude scores
      cy.log('⏳ Waiting for aptitude scores...');
      return cy.get('#aptitudeScores', { timeout: 30000 });
    }).then(() => {
      cy.get('#aptitudeScores')
        .should('be.visible')
        .scrollIntoView({ duration: 1000 });
      
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
        
        // Extract final result code
        const text = $body.text();
        const match = text.match(/Current Code:\s*([A-Z]{3})/i) || text.match(/\b([RIASEC]{3})\b/);
        const actualCode = match ? match[1] : 'NOT_FOUND';
        
        const testData = Cypress.env('currentTestData') || {};
        const clusterJobsData = testData.clusterJobsData ? JSON.parse(testData.clusterJobsData) : {};
        
        // Calculate counts
        const clusterCount = Object.keys(clusterJobsData).length;
        const totalJobCount = Object.values(clusterJobsData).reduce((sum: number, jobs: string[]) => sum + jobs.length, 0);
        const aptitudeCount = Object.keys(aptitudeScores).length;
        
        // Update test data with all collected information
        testData.actualRIASEC = actualCode;
        testData.aptitudeScores = JSON.stringify(aptitudeScores);
        testData.jobCount = totalJobCount;
        testData.clusterCount = clusterCount;
        testData.aptitudeCount = aptitudeCount;
        testData.testEndTime = new Date().toISOString();
        testData.totalTestDuration = `${Date.now() - new Date(testData.testStartTime).getTime()}ms`;
        testData.testStatus = (actualCode === targetCode) ? 'PASS' : 'FAIL';
        
        cy.log('═══════════════════════════════════════');
        cy.log('🎉 RESULT GENERATION COMPLETE!');
        cy.log(`📊 Expected RIASEC: ${targetCode}`);
        cy.log(`📊 Actual RIASEC: ${actualCode}`);
        cy.log(`📊 Test Status: ${testData.testStatus}`);
        cy.log(`📊 Job Clusters: ${clusterCount}`);
        cy.log(`📊 Total Jobs Across Clusters: ${totalJobCount}`);
        cy.log(`📊 Aptitude Scores: ${aptitudeCount}`);
        cy.log('═══════════════════════════════════════');
        
        // Take final screenshot
        cy.screenshot(`result-complete-${targetCode}`, { capture: 'fullPage' });
        
        // Log all data to Google Sheets
        return logToGoogleSheets(testData);
      });
    }).then(() => {
      cy.log('✅ All data successfully collected!');
      pause(3000);
    });
  }

  // Run tests for all A combinations (starting from second to avoid first if needed)
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