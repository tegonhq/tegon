import type { UpdateCycleDto, Cycle } from '@tegonhq/types';

import axios from 'axios';

interface UpdateCycleDtoWithCycleId extends UpdateCycleDto {
  cycleId: string;
}

export async function updateCycle({
  cycleId,
  ...updateCycleDto
}: UpdateCycleDtoWithCycleId): Promise<Cycle> {
  const response = await axios.post(
    `/api/v1/cycles/${cycleId}`,
    updateCycleDto,
  );

  return response.data;
}
