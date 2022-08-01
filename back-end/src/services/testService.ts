import { recommendationRepository } from '../repositories/recommendationRepository.js';

async function resetDatabase() {
  await recommendationRepository.truncate();
}

export { resetDatabase };