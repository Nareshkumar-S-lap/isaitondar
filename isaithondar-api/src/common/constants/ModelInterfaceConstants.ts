// Define RecordTracking for audit fields
export interface RecordTracking {
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy: number;
  updatedBy: number;
}
