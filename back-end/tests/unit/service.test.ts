import { jest } from '@jest/globals';

import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { recommendationService } from '../../src/services/recommendationsService.js';
import { notFoundError, conflictError } from '../../src/utils/errorUtils.js';
import recommendationsFactory from '../factories/recommendationsFactory.js';

describe('recommendationService', () => {
    it("notFoundError should be thrown when recommendation not found on upvote", async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

        expect(async () => {
            await recommendationService.upvote(1);
        }).rejects.toEqual(notFoundError());
    })

    it("notFoundError should be thrown when recommendation not found on downvote", async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

        expect(async () => {
            await recommendationService.downvote(1);
        }).rejects.toEqual(notFoundError());
    });

    it("notFoundError when there are no recomendations on getRandom", async () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.6);
        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]);

        expect(async () => {
            await recommendationService.getRandom();
        }).rejects.toEqual(notFoundError());
    });

    it("conflict inserting existing recommendation", async () => {
        const recommendation = recommendationsFactory();
        jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce(recommendation[0]);

        expect(async () => {
            await recommendationService.insert(recommendation[0]);
        }).rejects.toEqual({
            message: "Recommendations names must be unique",
            type: "conflict",
          });
    });

    it("remove recomendation downvote", async () => {
        const recommendation = recommendationsFactory();
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendation[2]);
        jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce(recommendation[2]);
        jest.spyOn(recommendationRepository, 'remove').mockResolvedValueOnce(null);

        await recommendationService.downvote(recommendation[2].id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toHaveBeenCalledWith(recommendation[2].id, "decrement");
        expect(recommendationRepository.remove).toHaveBeenCalledWith(recommendation[2].id);
    });
})