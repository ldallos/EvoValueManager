describe('evoValueMananger', () => {
  // EVMVAL001
  // EVMCHAR002
  it('AddCharacterTest', () => {
    // Step 01: Elindítom az Evo Értékeink oldalt.
    cy.visit('https://localhost:7090/');

    // Expr 01: Látom az Evo Értékeink oldal Főoldalát.
    cy.contains('Evo Értékeink').should('be.visible');

    // Step 02: Rákattintok a Csapattagok tabra.
	  cy.contains('a', 'Csapattagok').click();

    // Expr 02: Látom a Csapat kezelő oldalt a csapattag választó dropdownnal és a + csapattag hozzáadás gombot.
    cy.get('#toggleAddCharacter').should('be.visible');
    cy.contains('Válassz egy csapattagot').should('be.visible');

    // Step 03: Rákattintok a + csapattag hozzáadás gombra.
    cy.get('#toggleAddCharacter').click();

    // Expr 03: Látom a csapattag felvételéhez szükséges beviteli mezőket:
    //          Név, Fejlődés, Gondoskodás, Jelenlét, Megbízhatóság, Merészség. Valamint egy Mentés gombot.
    cy.contains('Név').should('be.visible');
    cy.contains('Fejlődés').should('be.visible');
    cy.contains('Gondoskodás').should('be.visible');
    cy.contains('Jelenlét').should('be.visible');
    cy.contains('Megbízhatóság').should('be.visible');
    cy.contains('Merészség').should('be.visible');
    cy.contains('Mentés').should('be.visible');

    // Step 04: Kitöltöm a mezőket a következő értékekkel, majd megnyomom a Mentés gombot:
    //          Név: Teszt Csapattag
    //          Fejlődés: 1
    //          Gondoskodás: 2
    //          Jelenlét: 3
    //          Megbízhatóság: 4 
    //          Merészség: 5
    cy.get('#NewCharacter_Name').type('Teszt Csapattag');
    cy.get('#NewCharacter_Growth').clear().type('1');
    cy.get('#NewCharacter_Care').clear().type('2');
    cy.get('#NewCharacter_Presence').clear().type('3');
    cy.get('#NewCharacter_Trust').clear().type('4');
    cy.get('#NewCharacter_Bravery').clear().type('5');
    cy.contains('Mentés').click();

    // Expr 04: Látom a Csapat kezelő oldalt a csapattag választó dropdownnal és a + csapattag hozzáadás gombot.
    cy.get('#toggleAddCharacter').should('be.visible');
    cy.contains('Válassz egy csapattagot').should('be.visible');

    // Step 05: Rákattintok a csapattag választó dropdownra.
    // Expr 05: A legördülő listában ott látom Teszt Csapattag nevét.
    cy.get('#SelectedCharacterId').find('option').should('contain', 'Teszt Csapattag'); 
  })
})