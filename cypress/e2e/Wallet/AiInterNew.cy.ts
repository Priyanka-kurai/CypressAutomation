describe('AI Interview – Full Multi-Step Flow', () => {

  before(() => {
    Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: {
        permissions: ['videoCapture', 'audioCapture'],
        origin: 'https://frontend-v2-712919537046.asia-southeast1.run.app',
      },
    });
  });

  it('should complete interview setup and answer questions successfully', () => {

    // ---------------- VISIT ----------------
    cy.visit('https://frontend-v2-712919537046.asia-southeast1.run.app', {
      onBeforeLoad(win) {
        cy.stub(win.navigator.mediaDevices, 'getUserMedia').resolves({
          getTracks: () => [],
          getVideoTracks: () => [],
          getAudioTracks: () => [],
        });
      },
    });

    // ================= STEP 1 =================
    cy.get('form').should('be.visible');

    const companies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta'];
    cy.get('input[placeholder="Enter company or your name"]')
      .type(companies[Math.floor(Math.random() * companies.length)]);

    cy.get('select').eq(0).select('domain-specific');
    cy.get('select').eq(1).select('en');

    cy.contains('button', 'Next')
      .should('not.be.disabled')
      .click();

    // ================= STEP 2 (DOMAIN → ROLE) =================
// ================= STEP 2 (RANDOM DOMAIN → RANDOM ROLE) =================

const domainRoleMap = {
  engineering: {
    domainValue: '6874b488e8d5483ad607a069',
    roles: [
      'Software Engineer',
      'Backend Developer',
      'Frontend Developer'
    ]
  },
  finance: {
    domainValue: '6874b488e8d5483ad607a06a',
    roles: [
      'Accountant',
      'Financial Analyst',
      'Auditor'
    ]
  },
  healthcare: {
    domainValue: '6874b488e8d5483ad607a06b',
    roles: [
      'Doctor',
      'Healthcare Assistant',
      'Medical Officer'
    ]
  },
  customer: {
    domainValue: '6874b488e8d5483ad607a067',
    roles: [
      'Customer Support Executive',
      'Support Analyst',
      'Customer Success Manager'
    ]
  }
};

// Pick random domain
const domainKeys = Object.keys(domainRoleMap);
const selectedDomainKey =
  domainKeys[Math.floor(Math.random() * domainKeys.length)];

const selectedDomain = domainRoleMap[selectedDomainKey];

// Save for later (answers)
cy.wrap({ key: selectedDomainKey }).as('selectedDomain');

// Select domain
cy.get('select').eq(0).select(selectedDomain.domainValue);

// Wait for roles API
cy.intercept('GET', '**/roles/**').as('getRoles');
cy.wait('@getRoles');

// Pick random role for that domain
const randomRole =
  selectedDomain.roles[Math.floor(Math.random() * selectedDomain.roles.length)];

cy.get('select').eq(1)
  .should('not.be.disabled')
  .select(randomRole)
  .should('have.value', randomRole);

cy.contains('button', 'Next')
  .should('not.be.disabled')
  .click();


    // ================= STEP 3 =================
    cy.contains('How should we generate your interview questions?')
      .should('be.visible');

    cy.get('input[value="skills-based"]').check();

    cy.get('div.flex.flex-wrap.gap-2 button', { timeout: 10000 })
      .should('have.length.greaterThan', 2)
      .then($btns => {
        cy.wrap($btns[0]).click();
        cy.wrap($btns[1]).click();
        cy.wrap($btns[2]).click();
      });

    cy.contains('3/5 skills selected').should('be.visible');

    cy.contains('button', 'Start Interview')
      .should('not.be.disabled')
      .click();

    // ================= STEP 4 =================
    cy.wait(3000);

    // ================= STEP 5 =================
    cy.get('@selectedDomain').then(({ key }) => {

      const used = new Set();

const answers = {
  engineering: [
    `I am a backend software engineer with experience in building APIs.
I have worked with microservices and cloud platforms.
I focus on writing clean, scalable, and maintainable code.`,

    `I have implemented CI/CD pipelines to automate deployments.
This reduced manual errors and improved release speed.
I worked closely with QA and DevOps teams.`,

    `I have optimized database queries to improve performance.
I analyzed slow queries and indexing strategies.
This helped reduce response time significantly.`,

    `I debug production issues using logs and monitoring tools.
Root cause analysis is an important part of my work.
I always aim for permanent fixes.`,

    `I follow best coding practices and write unit tests.
Code reviews help maintain quality and consistency.
Documentation is part of my development process.`
  ],

  finance: [
    `I have handled financial reporting and reconciliations.
My role involved preparing accurate financial statements.
I ensured compliance with accounting standards.`,

    `I worked on budgeting and forecasting activities.
I analyzed expenses and revenue trends.
This supported management decision-making.`,

    `I have experience in financial data analysis.
I identified trends and potential risks.
Accuracy and attention to detail were critical.`,

    `I collaborated with internal teams on financial planning.
Clear communication helped align financial goals.
Timely reporting was always maintained.`,

    `I ensured regulatory compliance in all financial processes.
I followed internal controls and audit guidelines.
This reduced financial risks for the organization.`
  ],

  healthcare: [
    `I supported patient care by following strict medical protocols.
I worked closely with doctors and nursing staff.
Patient safety was my top priority.`,

    `I have experience working with electronic health records.
I ensured accurate and timely patient data entry.
Confidentiality was always maintained.`,

    `I assisted in daily clinical operations and patient monitoring.
Clear communication with medical teams was essential.
I handled responsibilities with care and empathy.`,

    `I followed healthcare compliance and safety guidelines.
I helped maintain hygiene and infection control standards.
This ensured a safe environment for patients.`,

    `I provided compassionate support to patients and families.
I addressed concerns calmly and professionally.
Empathy guided my approach to care.`
  ],

  customer: [
    `I handled high-volume customer queries across multiple channels.
I focused on understanding customer issues clearly.
Providing timely solutions was my priority.`,

    `I resolved customer complaints professionally and calmly.
Active listening helped de-escalate situations.
Customer satisfaction was always the goal.`,

    `I collaborated with internal teams to resolve complex issues.
Clear documentation improved resolution time.
This enhanced overall customer experience.`,

    `I tracked customer feedback and support metrics.
This helped identify areas for improvement.
Service quality improved as a result.`,

    `I maintained clear and polite communication with customers.
Building trust was an important part of my role.
Consistency helped improve retention rates.`
  ]
};


      const pool = answers[key];

      const answerQuestion = (qNo) => {
        cy.contains(`Question ${qNo} of`, { timeout: 20000 })
          .should('be.visible');
cy.wait(5000);  // Wait before typing
        const answer = pool.find(a => !used.has(a));
        used.add(answer);
cy.wait(2000);  // Wait before typing

        cy.get('textarea')
          .should('be.visible').wait(1000)  
          .type(answer, { delay: 20 });
cy.wait(2000);// Wait after typing
        cy.contains('button', 'Post Answer').click();

        if (qNo < 5) {
          cy.contains('Answer Submitted', { timeout: 30000 }).should('be.visible');
          cy.contains('button', 'Next Question').click();
        } else {
          cy.contains('Interview Finalized!', { timeout: 40000 }).should('be.visible');
        }
      };

      cy.wrap([1, 2, 3, 4, 5]).each(qNo => {
        answerQuestion(qNo);
      });

      // ================= STEP 6 =================
      cy.contains('button', 'Get Assessment!', { timeout: 20000 })
        .click();
cy.wait(10000);
      cy.contains('Performance Review', { timeout: 30000 })
        //.should('be.visible');
cy.wait(4000);
      // Scroll slowly to load all lazy sections
cy.scrollTo('top');

cy.scrollTo('center', { duration: 1000 });
cy.wait(1000);

cy.scrollTo('bottom', { duration: 1500 });
cy.wait(2000);


      cy.contains('button', 'PDF Report')
        .scrollIntoView()
        .should('be.visible')
        .click();
    });
  });
});
