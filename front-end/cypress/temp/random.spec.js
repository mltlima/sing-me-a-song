import recommendationFactory from './factories/recommendationFactory.js';

describe('Random /random', () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it('random video recommendation', () => {
    cy.visit('localhost:3000');
    
    const recommendation = recommendationFactory();

    cy.intercept('POST', '/recommendations').as('getRecommendations');
    cy.insertRecommendation(recommendation);
    cy.contains(recommendation.name);
    cy.intercept('GET', '/random').as('getRandom');
    cy.visit('localhost:3000/random');
    cy.wait('@getRandom');
    cy.contains(recommendation.name);
    cy.end();
  });
});