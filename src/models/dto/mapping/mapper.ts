import {TypedJSON} from 'typedjson';
import {InternalServerError, IDomainErrorClass, UnprocessableEntityError} from '../../../util/errors';

export type IMappedClass<T> = new(...args: Array<any>) => T;

export class Mapper {

  public static async mapInput<T>(json: any, clazz: IMappedClass<T>): Promise<T> {
    return this.map(json, clazz, UnprocessableEntityError);
  }

  public static async mapOutput<T>(json: any, clazz: IMappedClass<T>): Promise<T> {
    return this.map(json, clazz, InternalServerError);
  }

  public static async mapInputArray<T>(json: any, clazz: IMappedClass<T>): Promise<Array<T>> {
    return this.mapArray(json, clazz, UnprocessableEntityError);
  }

  public static async mapOutputArray<T>(json: any, clazz: IMappedClass<T>): Promise<Array<T>> {
    return this.mapArray(json, clazz, InternalServerError);
  }

  private static async map<T>(json: any, clazz: IMappedClass<T>, errorClass: IDomainErrorClass): Promise<T> {
    if (!json) {
      throw new errorClass('Failed to map null or undefined object');
    }
    const serializer = new TypedJSON(clazz as any, {errorHandler: (err: Error) => { throw err; }});
    try {
      if (json.toJSON) {
        // console.log('toJSON function found, calling it');
        json = json.toJSON();
      }
      // console.log('Mapping to ' + clazz + ': ' + JSON.stringify(json, null, 2));
      return serializer.parse(json) as T;
    } catch (err) {
      throw new errorClass('Failed to map: ' + this.buildMessage(err));
    }
  }

  private static async mapArray<T>(json: any, clazz: IMappedClass<T>, errorClass: IDomainErrorClass): Promise<Array<T>> {
    if (!json) {
      throw new errorClass('Failed to map null or undefined array');
    }
    if (json.constructor !== Array) {
      throw new errorClass('Expected array, found ' + json.constructor.name);
    }
    const serializer = new TypedJSON(clazz as any, {errorHandler: (err: Error) => { throw err; }});
    try {
      return json.map((item: any) => serializer.parse(item) as T);
    } catch (err) {
      console.error('Failed to map ' + JSON.stringify(json, null, 2));
      throw new errorClass('Failed to map: ' + this.buildMessage(err));
    }
  }

  private static buildMessage(err: any) {
    const localeString = err.toLocaleString ? err.toLocaleString() : {};
    if (localeString.constructor.name === 'String') {
      return localeString;
    } else {
      return JSON.stringify(err);
    }
  }
}
