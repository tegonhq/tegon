export interface CycleType {
  id: string;
  createdAt: string;
  updatedAt: string;

  name: string;
  description: string;
  teamId: string;

  startDate: string;
  endDate: string;

  preferences?: string;
}
