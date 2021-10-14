
// reflect-metadata needed for typeorm
import 'reflect-metadata';

import {createConnection} from 'typeorm';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {DomainObjectRegistry} from '../models/domain/registry';
import {Config} from '../util/config';

export class PostgresManager {

  public static ConnectionPoolSize = 10;

  public static async connect(connectionPoolSize: number) {

    this.ConnectionPoolSize = connectionPoolSize;

    await createConnection({
      type: 'postgres',
      url: Config.POSTGRES_URL,
      ssl: Config.POSTGRES_USE_SSL ? {
        rejectUnauthorized: false
      } : false,
      synchronize: false,
      entities: DomainObjectRegistry.allObjects(),
      logging: Config.POSTGRES_LOGGING,
      namingStrategy: new SnakeNamingStrategy(),
      extra: {
        connectionLimit: connectionPoolSize
      }
    });

  }
}
