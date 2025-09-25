// cypress/support/commands.d.ts
declare namespace Cypress {
  interface Chainable {
    visitLoginPage(): Chainable<void>;
    login(email: string, password: string): Chainable<void>;
    closeAnnouncements(): Chainable<void>;
    openMyCredentials(): Chainable<void>;
    copyVerificationLink(): Chainable<void>;
    downloadCredential(): Chainable<void>;
  }
}
