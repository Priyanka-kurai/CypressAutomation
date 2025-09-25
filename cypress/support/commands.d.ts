declare namespace Cypress {
  interface Chainable {
    /**
     * Navigate to the login page
     */
    visitLoginPage(): Chainable<void>;

    /**
     * Perform login with given email and password
     */
    login(email: string, password: string): Chainable<void>;

    /**
     * Close announcements on dashboard
     */
    closeAnnouncements(): Chainable<void>;

    /**
     * Open "My Credentials" page
     */
    openMyCredentials(): Chainable<void>;

    /**
     * Copy verification link
     */
    copyVerificationLink(): Chainable<void>;

    /**
     * Download credential
     */
    downloadCredential(): Chainable<void>;
  }
}
