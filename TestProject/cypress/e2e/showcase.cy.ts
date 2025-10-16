describe('EvoValueManager Automated Showcase', () => {
    before(() => {
        cy.request('POST', 'http://localhost:5163/api/debug/reset-database').then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Walks through all major features of the application', () => {
        // --- INTRO & DASHBOARD ---
        cy.visit('https://localhost:7090/');
        cy.contains('h1', 'EvoValueManager').should('be.visible');
        cy.pause();

        cy.get('[data-cy=nav-dashboard]').click();
        cy.contains('h1', 'Dashboard').should('be.visible');
        cy.contains('h3', 'Team Values Radar').should('be.visible');
        cy.pause();

        // --- EXPLORE A CHARACTER ---
        cy.get('[data-cy=nav-team]').click();
        cy.contains('h1', 'Team Members').should('be.visible');

        cy.get('[data-cy=character-card-1]').click();
        cy.contains('h2', 'Bátor Sándor').should('be.visible');
        cy.pause();

        // --- FEATURE 1: TOOL MANAGEMENT ---
        cy.contains('h2', 'Tool Management').should('be.visible');
        cy.get('[data-cy=assign-tool-2-btn]').click();
        cy.contains('Tool assigned successfully!').should('be.visible');
        cy.get('[data-cy=assigned-tool-2]').should('be.visible');
        cy.pause();

        // --- FEATURE 2: CHALLENGE MANAGEMENT ---
        cy.contains('h2', 'Challenge Management').scrollIntoView();
        cy.get('[data-cy=available-challenge-selector]').select('2');
        cy.pause();

        cy.get('[data-cy=assign-challenge-btn]').click();
        cy.contains('Challenge assigned successfully!').should('be.visible');
        cy.get('[data-cy=assigned-challenge-selector]').should('contain', 'Ügyféllátogatás');
        cy.pause();

        // --- FEATURE 3: COMPLETING A CHALLENGE AND GAINING STATS/ACHIEVEMENTS ---
        cy.get('[data-cy=assigned-challenge-selector]').select('2');

        cy.get('[data-cy=challenge-state-selector]').select('3');
        cy.get('[data-cy=update-progress-btn]').click();
        cy.contains('Management details updated.').should('be.visible');
        cy.pause();

        cy.get('[data-cy=close-challenge-btn]').click();
        cy.contains('Challenge closed successfully!').should('be.visible');
        cy.contains('Achievement Unlocked!').should('be.visible').and('contain', 'Team Pillar');
        cy.pause();

        // --- FEATURE 4: RESOURCE LIBRARY MANAGEMENT ---
        cy.get('[data-cy=nav-library]').click();
        cy.contains('h1', 'Resource Library').should('be.visible');
        cy.pause();

        // Add a new Challenge
        cy.get('[data-cy=add-new-challenge-btn]').click();
        cy.get('[data-cy=challenge-form-modal]').should('be.visible');
        cy.get('[data-cy=title-input]').type('Cypress Demo Challenge');
        cy.get('[data-cy=gainableBravery-input]').type('25');
        cy.get('[data-cy=save-challenge-btn]').click();
        cy.contains('Challenge created successfully!').should('be.visible');
        cy.contains('td', 'Cypress Demo Challenge').should('be.visible');
        cy.pause()
    });
});