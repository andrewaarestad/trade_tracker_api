export class Calculations {
  public static computeAnnualizedReturn(returnDollars: number, timeInTradeMs: number) {

    // this is a shitty calculation, should be an exponential calc

    const msInYear = 365 * 24 * 3600 * 1000;
    const ratio = timeInTradeMs / msInYear;
    return returnDollars / ratio;
  }

  public static computeRealizedGainPercent(realizedGainUsd: number, entryValue: number) {
    return 100 * realizedGainUsd / Math.abs(entryValue);
  }
}
