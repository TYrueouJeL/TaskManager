describe('Page d\'accueil', () => {
    it('devrait afficher le titre', () => {
        cy.visit('/')
        cy.contains('Organisez vos projets').should('exist')
        cy.contains('Se connecter').click()
    })
})
