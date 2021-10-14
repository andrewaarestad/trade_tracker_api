import {jsonMember, jsonObject} from 'typedjson';

@jsonObject
export class PositionPerformanceOpenDto {
  @jsonMember public unrealizedGainTodayUsd!: number;
  @jsonMember public unrealizedGainTodayPercent!: number;
  @jsonMember public unrealizedGainUsd!: number;
  @jsonMember public unrealizedGainPercent!: number;
  @jsonMember public unrealizedGainPercentAnnualized!: number;

  @jsonMember public totalQuantity!: number;
  @jsonMember public netBasis!: number;
  @jsonMember public entryValue!: number;
}
