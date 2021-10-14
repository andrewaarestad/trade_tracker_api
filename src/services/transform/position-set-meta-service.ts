// import {PositionSet} from '../../models/domain/persisted/position-set';
// import {PositionSetMeta} from '../../models/domain/transient/position-set-meta';
// import {PositionSetType} from '../../models/enums/position-set-type';
// import {InternalServerError} from '../../util/errors';
//
// export class PositionSetMetaService {
//   public static async populateMetaForPositionSets(positionSets: Array<PositionSet>) {
//     return Promise.all(positionSets.map(async s => s.meta = await this.computeMetaForPositionSet(s)));
//   }
//
//   private static async computeMetaForPositionSet(positionSet: PositionSet) {
//     console.log('populating meta: ', positionSet);
//     switch (positionSet.type) {
//       case PositionSetType.Unpaired:
//         return this.computeMetaForUnpairedPosition(positionSet);
//       case PositionSetType.CoveredCall:
//         return this.computeMetaForCoveredCall(positionSet);
//       case PositionSetType.BullPut:
//         return this.computeMetaForBullPut(positionSet);
//       case PositionSetType.BullCall:
//         return this.computeMetaForBullCall(positionSet);
//       case PositionSetType.Wheel:
//         return this.computeMetaForWheel(positionSet);
//       default:
//         throw new InternalServerError('Invalid position set: ' + positionSet.type);
//     }
//   }
//
//   private static computeMetaForUnpairedPosition(positionSet: PositionSet) {
//     const meta = new PositionSetMeta();
//     if (!positionSet.positions) {
//       throw new InternalServerError('positionSet.positions must be loaded to compute meta');
//     }
//     let averageEntry = 0;
//     positionSet.positions.forEach(position => {
//       meta.totalQuantity += position.quantity;
//       meta.entryValue += position.quantity * position.entryPrice;
//       averageEntry += position.entryPrice;
//     });
//     if (meta.totalQuantity > 0) {
//       meta.netBasis = meta.entryValue / meta.totalQuantity;
//     } else {
//       meta.netBasis = averageEntry / (positionSet.positions.length || 1);
//     }
//     return meta;
//   }
//
//   // private static computeMetaForCoveredCall(positionSet: PositionSet) {
//   //   const meta = new PositionSetMeta();
//   //   meta.totalQuantity = 1;
//   //   meta.netBasis = 123;
//   //   meta.entryValue = 30;
//   //   return meta;
//   // }
//   //
//   // private static computeMetaForBullPut(positionSet: PositionSet) {
//   //   const meta = new PositionSetMeta();
//   //   meta.totalQuantity = 1;
//   //   meta.netBasis = 123;
//   //   meta.entryValue = 30;
//   //   return meta;
//   // }
//   //
//   // private static computeMetaForBullCall(positionSet: PositionSet) {
//   //   const meta = new PositionSetMeta();
//   //   meta.totalQuantity = 1;
//   //   meta.netBasis = 123;
//   //   meta.entryValue = 30;
//   //   return meta;
//   // }
//   //
//   // private static computeMetaForWheel(positionSet: PositionSet) {
//   //   const meta = new PositionSetMeta();
//   //   meta.totalQuantity = 1;
//   //   meta.netBasis = 123;
//   //   meta.entryValue = 30;
//   //   return meta;
//   // }
// }
