import {isDate} from 'moment';
import moment = require('moment');
import {UnprocessableEntityError} from './errors';

export interface ICustomStringParams {
  minLength?: number
  required?: boolean
  trim?: boolean
  lowercase?: boolean
}

export class Deserializers {

  public static customString(params: ICustomStringParams) {
    return (value: string) => {
      if (!value) {
        if (params.required) {
          throw new UnprocessableEntityError('Expected a value');
        } else {
          return value;
        }
      } else {
        if (!value || value.constructor !== String) {
          console.log('expected string, got ', value);
          throw new UnprocessableEntityError('Expected string type');
        }
        if (params.minLength && value.length < params.minLength) {
          throw new UnprocessableEntityError('Value length ' + value.length + ' less than minimum length required: ' + params.minLength);
        }
        if (params.trim) {
          value = value.trim();
        }
        if (params.lowercase) {
          value = value.toLowerCase();
        }
        return value;
      }
    };
  }

  public static date(date: any): Date {
    if (!date) {
      return date;
    }
    if (isDate(date)) {
      return date;
    } else {
      return moment(date).toDate();
    }
  }

  public static float(decimals: number) {
    return (value: any) => {
      if (value) {
        return parseFloat(value.toFixed(2));
      } else {
        return value;
      }
    };
  }
}
