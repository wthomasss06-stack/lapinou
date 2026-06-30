
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Rabbit
 * 
 */
export type Rabbit = $Result.DefaultSelection<Prisma.$RabbitPayload>
/**
 * Model RabbitPhoto
 * 
 */
export type RabbitPhoto = $Result.DefaultSelection<Prisma.$RabbitPhotoPayload>
/**
 * Model Reservation
 * 
 */
export type Reservation = $Result.DefaultSelection<Prisma.$ReservationPayload>
/**
 * Model VisitStats
 * 
 */
export type VisitStats = $Result.DefaultSelection<Prisma.$VisitStatsPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Rabbits
 * const rabbits = await prisma.rabbit.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Rabbits
   * const rabbits = await prisma.rabbit.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.rabbit`: Exposes CRUD operations for the **Rabbit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rabbits
    * const rabbits = await prisma.rabbit.findMany()
    * ```
    */
  get rabbit(): Prisma.RabbitDelegate<ExtArgs>;

  /**
   * `prisma.rabbitPhoto`: Exposes CRUD operations for the **RabbitPhoto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RabbitPhotos
    * const rabbitPhotos = await prisma.rabbitPhoto.findMany()
    * ```
    */
  get rabbitPhoto(): Prisma.RabbitPhotoDelegate<ExtArgs>;

  /**
   * `prisma.reservation`: Exposes CRUD operations for the **Reservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reservations
    * const reservations = await prisma.reservation.findMany()
    * ```
    */
  get reservation(): Prisma.ReservationDelegate<ExtArgs>;

  /**
   * `prisma.visitStats`: Exposes CRUD operations for the **VisitStats** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VisitStats
    * const visitStats = await prisma.visitStats.findMany()
    * ```
    */
  get visitStats(): Prisma.VisitStatsDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Rabbit: 'Rabbit',
    RabbitPhoto: 'RabbitPhoto',
    Reservation: 'Reservation',
    VisitStats: 'VisitStats'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "rabbit" | "rabbitPhoto" | "reservation" | "visitStats"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Rabbit: {
        payload: Prisma.$RabbitPayload<ExtArgs>
        fields: Prisma.RabbitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RabbitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RabbitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPayload>
          }
          findFirst: {
            args: Prisma.RabbitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RabbitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPayload>
          }
          findMany: {
            args: Prisma.RabbitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPayload>[]
          }
          create: {
            args: Prisma.RabbitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPayload>
          }
          createMany: {
            args: Prisma.RabbitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RabbitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPayload>[]
          }
          delete: {
            args: Prisma.RabbitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPayload>
          }
          update: {
            args: Prisma.RabbitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPayload>
          }
          deleteMany: {
            args: Prisma.RabbitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RabbitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RabbitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPayload>
          }
          aggregate: {
            args: Prisma.RabbitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRabbit>
          }
          groupBy: {
            args: Prisma.RabbitGroupByArgs<ExtArgs>
            result: $Utils.Optional<RabbitGroupByOutputType>[]
          }
          count: {
            args: Prisma.RabbitCountArgs<ExtArgs>
            result: $Utils.Optional<RabbitCountAggregateOutputType> | number
          }
        }
      }
      RabbitPhoto: {
        payload: Prisma.$RabbitPhotoPayload<ExtArgs>
        fields: Prisma.RabbitPhotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RabbitPhotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RabbitPhotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPhotoPayload>
          }
          findFirst: {
            args: Prisma.RabbitPhotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RabbitPhotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPhotoPayload>
          }
          findMany: {
            args: Prisma.RabbitPhotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPhotoPayload>[]
          }
          create: {
            args: Prisma.RabbitPhotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPhotoPayload>
          }
          createMany: {
            args: Prisma.RabbitPhotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RabbitPhotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPhotoPayload>[]
          }
          delete: {
            args: Prisma.RabbitPhotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPhotoPayload>
          }
          update: {
            args: Prisma.RabbitPhotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPhotoPayload>
          }
          deleteMany: {
            args: Prisma.RabbitPhotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RabbitPhotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RabbitPhotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RabbitPhotoPayload>
          }
          aggregate: {
            args: Prisma.RabbitPhotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRabbitPhoto>
          }
          groupBy: {
            args: Prisma.RabbitPhotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<RabbitPhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.RabbitPhotoCountArgs<ExtArgs>
            result: $Utils.Optional<RabbitPhotoCountAggregateOutputType> | number
          }
        }
      }
      Reservation: {
        payload: Prisma.$ReservationPayload<ExtArgs>
        fields: Prisma.ReservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          findFirst: {
            args: Prisma.ReservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          findMany: {
            args: Prisma.ReservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          create: {
            args: Prisma.ReservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          createMany: {
            args: Prisma.ReservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          delete: {
            args: Prisma.ReservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          update: {
            args: Prisma.ReservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          deleteMany: {
            args: Prisma.ReservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          aggregate: {
            args: Prisma.ReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReservation>
          }
          groupBy: {
            args: Prisma.ReservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservationCountArgs<ExtArgs>
            result: $Utils.Optional<ReservationCountAggregateOutputType> | number
          }
        }
      }
      VisitStats: {
        payload: Prisma.$VisitStatsPayload<ExtArgs>
        fields: Prisma.VisitStatsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VisitStatsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitStatsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VisitStatsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitStatsPayload>
          }
          findFirst: {
            args: Prisma.VisitStatsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitStatsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VisitStatsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitStatsPayload>
          }
          findMany: {
            args: Prisma.VisitStatsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitStatsPayload>[]
          }
          create: {
            args: Prisma.VisitStatsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitStatsPayload>
          }
          createMany: {
            args: Prisma.VisitStatsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VisitStatsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitStatsPayload>[]
          }
          delete: {
            args: Prisma.VisitStatsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitStatsPayload>
          }
          update: {
            args: Prisma.VisitStatsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitStatsPayload>
          }
          deleteMany: {
            args: Prisma.VisitStatsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VisitStatsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VisitStatsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitStatsPayload>
          }
          aggregate: {
            args: Prisma.VisitStatsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVisitStats>
          }
          groupBy: {
            args: Prisma.VisitStatsGroupByArgs<ExtArgs>
            result: $Utils.Optional<VisitStatsGroupByOutputType>[]
          }
          count: {
            args: Prisma.VisitStatsCountArgs<ExtArgs>
            result: $Utils.Optional<VisitStatsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type RabbitCountOutputType
   */

  export type RabbitCountOutputType = {
    photos: number
    reservations: number
  }

  export type RabbitCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | RabbitCountOutputTypeCountPhotosArgs
    reservations?: boolean | RabbitCountOutputTypeCountReservationsArgs
  }

  // Custom InputTypes
  /**
   * RabbitCountOutputType without action
   */
  export type RabbitCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitCountOutputType
     */
    select?: RabbitCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RabbitCountOutputType without action
   */
  export type RabbitCountOutputTypeCountPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RabbitPhotoWhereInput
  }

  /**
   * RabbitCountOutputType without action
   */
  export type RabbitCountOutputTypeCountReservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Rabbit
   */

  export type AggregateRabbit = {
    _count: RabbitCountAggregateOutputType | null
    _avg: RabbitAvgAggregateOutputType | null
    _sum: RabbitSumAggregateOutputType | null
    _min: RabbitMinAggregateOutputType | null
    _max: RabbitMaxAggregateOutputType | null
  }

  export type RabbitAvgAggregateOutputType = {
    weight: number | null
    price: number | null
    stock: number | null
  }

  export type RabbitSumAggregateOutputType = {
    weight: number | null
    price: number | null
    stock: number | null
  }

  export type RabbitMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    breed: string | null
    color: string | null
    gender: string | null
    birthDate: Date | null
    weight: number | null
    description: string | null
    price: number | null
    priceNote: string | null
    stock: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RabbitMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    breed: string | null
    color: string | null
    gender: string | null
    birthDate: Date | null
    weight: number | null
    description: string | null
    price: number | null
    priceNote: string | null
    stock: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RabbitCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    breed: number
    color: number
    gender: number
    birthDate: number
    weight: number
    description: number
    price: number
    priceNote: number
    stock: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RabbitAvgAggregateInputType = {
    weight?: true
    price?: true
    stock?: true
  }

  export type RabbitSumAggregateInputType = {
    weight?: true
    price?: true
    stock?: true
  }

  export type RabbitMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    breed?: true
    color?: true
    gender?: true
    birthDate?: true
    weight?: true
    description?: true
    price?: true
    priceNote?: true
    stock?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RabbitMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    breed?: true
    color?: true
    gender?: true
    birthDate?: true
    weight?: true
    description?: true
    price?: true
    priceNote?: true
    stock?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RabbitCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    breed?: true
    color?: true
    gender?: true
    birthDate?: true
    weight?: true
    description?: true
    price?: true
    priceNote?: true
    stock?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RabbitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rabbit to aggregate.
     */
    where?: RabbitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rabbits to fetch.
     */
    orderBy?: RabbitOrderByWithRelationInput | RabbitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RabbitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rabbits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rabbits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rabbits
    **/
    _count?: true | RabbitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RabbitAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RabbitSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RabbitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RabbitMaxAggregateInputType
  }

  export type GetRabbitAggregateType<T extends RabbitAggregateArgs> = {
        [P in keyof T & keyof AggregateRabbit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRabbit[P]>
      : GetScalarType<T[P], AggregateRabbit[P]>
  }




  export type RabbitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RabbitWhereInput
    orderBy?: RabbitOrderByWithAggregationInput | RabbitOrderByWithAggregationInput[]
    by: RabbitScalarFieldEnum[] | RabbitScalarFieldEnum
    having?: RabbitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RabbitCountAggregateInputType | true
    _avg?: RabbitAvgAggregateInputType
    _sum?: RabbitSumAggregateInputType
    _min?: RabbitMinAggregateInputType
    _max?: RabbitMaxAggregateInputType
  }

  export type RabbitGroupByOutputType = {
    id: string
    slug: string
    name: string
    breed: string
    color: string
    gender: string
    birthDate: Date | null
    weight: number | null
    description: string | null
    price: number
    priceNote: string | null
    stock: number
    status: string
    createdAt: Date
    updatedAt: Date
    _count: RabbitCountAggregateOutputType | null
    _avg: RabbitAvgAggregateOutputType | null
    _sum: RabbitSumAggregateOutputType | null
    _min: RabbitMinAggregateOutputType | null
    _max: RabbitMaxAggregateOutputType | null
  }

  type GetRabbitGroupByPayload<T extends RabbitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RabbitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RabbitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RabbitGroupByOutputType[P]>
            : GetScalarType<T[P], RabbitGroupByOutputType[P]>
        }
      >
    >


  export type RabbitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    breed?: boolean
    color?: boolean
    gender?: boolean
    birthDate?: boolean
    weight?: boolean
    description?: boolean
    price?: boolean
    priceNote?: boolean
    stock?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    photos?: boolean | Rabbit$photosArgs<ExtArgs>
    reservations?: boolean | Rabbit$reservationsArgs<ExtArgs>
    _count?: boolean | RabbitCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rabbit"]>

  export type RabbitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    breed?: boolean
    color?: boolean
    gender?: boolean
    birthDate?: boolean
    weight?: boolean
    description?: boolean
    price?: boolean
    priceNote?: boolean
    stock?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["rabbit"]>

  export type RabbitSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    breed?: boolean
    color?: boolean
    gender?: boolean
    birthDate?: boolean
    weight?: boolean
    description?: boolean
    price?: boolean
    priceNote?: boolean
    stock?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RabbitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | Rabbit$photosArgs<ExtArgs>
    reservations?: boolean | Rabbit$reservationsArgs<ExtArgs>
    _count?: boolean | RabbitCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RabbitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RabbitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rabbit"
    objects: {
      photos: Prisma.$RabbitPhotoPayload<ExtArgs>[]
      reservations: Prisma.$ReservationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      breed: string
      color: string
      gender: string
      birthDate: Date | null
      weight: number | null
      description: string | null
      price: number
      priceNote: string | null
      stock: number
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["rabbit"]>
    composites: {}
  }

  type RabbitGetPayload<S extends boolean | null | undefined | RabbitDefaultArgs> = $Result.GetResult<Prisma.$RabbitPayload, S>

  type RabbitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RabbitFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RabbitCountAggregateInputType | true
    }

  export interface RabbitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rabbit'], meta: { name: 'Rabbit' } }
    /**
     * Find zero or one Rabbit that matches the filter.
     * @param {RabbitFindUniqueArgs} args - Arguments to find a Rabbit
     * @example
     * // Get one Rabbit
     * const rabbit = await prisma.rabbit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RabbitFindUniqueArgs>(args: SelectSubset<T, RabbitFindUniqueArgs<ExtArgs>>): Prisma__RabbitClient<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Rabbit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RabbitFindUniqueOrThrowArgs} args - Arguments to find a Rabbit
     * @example
     * // Get one Rabbit
     * const rabbit = await prisma.rabbit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RabbitFindUniqueOrThrowArgs>(args: SelectSubset<T, RabbitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RabbitClient<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Rabbit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitFindFirstArgs} args - Arguments to find a Rabbit
     * @example
     * // Get one Rabbit
     * const rabbit = await prisma.rabbit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RabbitFindFirstArgs>(args?: SelectSubset<T, RabbitFindFirstArgs<ExtArgs>>): Prisma__RabbitClient<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Rabbit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitFindFirstOrThrowArgs} args - Arguments to find a Rabbit
     * @example
     * // Get one Rabbit
     * const rabbit = await prisma.rabbit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RabbitFindFirstOrThrowArgs>(args?: SelectSubset<T, RabbitFindFirstOrThrowArgs<ExtArgs>>): Prisma__RabbitClient<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Rabbits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rabbits
     * const rabbits = await prisma.rabbit.findMany()
     * 
     * // Get first 10 Rabbits
     * const rabbits = await prisma.rabbit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rabbitWithIdOnly = await prisma.rabbit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RabbitFindManyArgs>(args?: SelectSubset<T, RabbitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Rabbit.
     * @param {RabbitCreateArgs} args - Arguments to create a Rabbit.
     * @example
     * // Create one Rabbit
     * const Rabbit = await prisma.rabbit.create({
     *   data: {
     *     // ... data to create a Rabbit
     *   }
     * })
     * 
     */
    create<T extends RabbitCreateArgs>(args: SelectSubset<T, RabbitCreateArgs<ExtArgs>>): Prisma__RabbitClient<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Rabbits.
     * @param {RabbitCreateManyArgs} args - Arguments to create many Rabbits.
     * @example
     * // Create many Rabbits
     * const rabbit = await prisma.rabbit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RabbitCreateManyArgs>(args?: SelectSubset<T, RabbitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rabbits and returns the data saved in the database.
     * @param {RabbitCreateManyAndReturnArgs} args - Arguments to create many Rabbits.
     * @example
     * // Create many Rabbits
     * const rabbit = await prisma.rabbit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rabbits and only return the `id`
     * const rabbitWithIdOnly = await prisma.rabbit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RabbitCreateManyAndReturnArgs>(args?: SelectSubset<T, RabbitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Rabbit.
     * @param {RabbitDeleteArgs} args - Arguments to delete one Rabbit.
     * @example
     * // Delete one Rabbit
     * const Rabbit = await prisma.rabbit.delete({
     *   where: {
     *     // ... filter to delete one Rabbit
     *   }
     * })
     * 
     */
    delete<T extends RabbitDeleteArgs>(args: SelectSubset<T, RabbitDeleteArgs<ExtArgs>>): Prisma__RabbitClient<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Rabbit.
     * @param {RabbitUpdateArgs} args - Arguments to update one Rabbit.
     * @example
     * // Update one Rabbit
     * const rabbit = await prisma.rabbit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RabbitUpdateArgs>(args: SelectSubset<T, RabbitUpdateArgs<ExtArgs>>): Prisma__RabbitClient<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Rabbits.
     * @param {RabbitDeleteManyArgs} args - Arguments to filter Rabbits to delete.
     * @example
     * // Delete a few Rabbits
     * const { count } = await prisma.rabbit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RabbitDeleteManyArgs>(args?: SelectSubset<T, RabbitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rabbits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rabbits
     * const rabbit = await prisma.rabbit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RabbitUpdateManyArgs>(args: SelectSubset<T, RabbitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Rabbit.
     * @param {RabbitUpsertArgs} args - Arguments to update or create a Rabbit.
     * @example
     * // Update or create a Rabbit
     * const rabbit = await prisma.rabbit.upsert({
     *   create: {
     *     // ... data to create a Rabbit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rabbit we want to update
     *   }
     * })
     */
    upsert<T extends RabbitUpsertArgs>(args: SelectSubset<T, RabbitUpsertArgs<ExtArgs>>): Prisma__RabbitClient<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Rabbits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitCountArgs} args - Arguments to filter Rabbits to count.
     * @example
     * // Count the number of Rabbits
     * const count = await prisma.rabbit.count({
     *   where: {
     *     // ... the filter for the Rabbits we want to count
     *   }
     * })
    **/
    count<T extends RabbitCountArgs>(
      args?: Subset<T, RabbitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RabbitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rabbit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RabbitAggregateArgs>(args: Subset<T, RabbitAggregateArgs>): Prisma.PrismaPromise<GetRabbitAggregateType<T>>

    /**
     * Group by Rabbit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RabbitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RabbitGroupByArgs['orderBy'] }
        : { orderBy?: RabbitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RabbitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRabbitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rabbit model
   */
  readonly fields: RabbitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rabbit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RabbitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    photos<T extends Rabbit$photosArgs<ExtArgs> = {}>(args?: Subset<T, Rabbit$photosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "findMany"> | Null>
    reservations<T extends Rabbit$reservationsArgs<ExtArgs> = {}>(args?: Subset<T, Rabbit$reservationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rabbit model
   */ 
  interface RabbitFieldRefs {
    readonly id: FieldRef<"Rabbit", 'String'>
    readonly slug: FieldRef<"Rabbit", 'String'>
    readonly name: FieldRef<"Rabbit", 'String'>
    readonly breed: FieldRef<"Rabbit", 'String'>
    readonly color: FieldRef<"Rabbit", 'String'>
    readonly gender: FieldRef<"Rabbit", 'String'>
    readonly birthDate: FieldRef<"Rabbit", 'DateTime'>
    readonly weight: FieldRef<"Rabbit", 'Float'>
    readonly description: FieldRef<"Rabbit", 'String'>
    readonly price: FieldRef<"Rabbit", 'Float'>
    readonly priceNote: FieldRef<"Rabbit", 'String'>
    readonly stock: FieldRef<"Rabbit", 'Int'>
    readonly status: FieldRef<"Rabbit", 'String'>
    readonly createdAt: FieldRef<"Rabbit", 'DateTime'>
    readonly updatedAt: FieldRef<"Rabbit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Rabbit findUnique
   */
  export type RabbitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitInclude<ExtArgs> | null
    /**
     * Filter, which Rabbit to fetch.
     */
    where: RabbitWhereUniqueInput
  }

  /**
   * Rabbit findUniqueOrThrow
   */
  export type RabbitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitInclude<ExtArgs> | null
    /**
     * Filter, which Rabbit to fetch.
     */
    where: RabbitWhereUniqueInput
  }

  /**
   * Rabbit findFirst
   */
  export type RabbitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitInclude<ExtArgs> | null
    /**
     * Filter, which Rabbit to fetch.
     */
    where?: RabbitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rabbits to fetch.
     */
    orderBy?: RabbitOrderByWithRelationInput | RabbitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rabbits.
     */
    cursor?: RabbitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rabbits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rabbits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rabbits.
     */
    distinct?: RabbitScalarFieldEnum | RabbitScalarFieldEnum[]
  }

  /**
   * Rabbit findFirstOrThrow
   */
  export type RabbitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitInclude<ExtArgs> | null
    /**
     * Filter, which Rabbit to fetch.
     */
    where?: RabbitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rabbits to fetch.
     */
    orderBy?: RabbitOrderByWithRelationInput | RabbitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rabbits.
     */
    cursor?: RabbitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rabbits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rabbits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rabbits.
     */
    distinct?: RabbitScalarFieldEnum | RabbitScalarFieldEnum[]
  }

  /**
   * Rabbit findMany
   */
  export type RabbitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitInclude<ExtArgs> | null
    /**
     * Filter, which Rabbits to fetch.
     */
    where?: RabbitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rabbits to fetch.
     */
    orderBy?: RabbitOrderByWithRelationInput | RabbitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rabbits.
     */
    cursor?: RabbitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rabbits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rabbits.
     */
    skip?: number
    distinct?: RabbitScalarFieldEnum | RabbitScalarFieldEnum[]
  }

  /**
   * Rabbit create
   */
  export type RabbitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitInclude<ExtArgs> | null
    /**
     * The data needed to create a Rabbit.
     */
    data: XOR<RabbitCreateInput, RabbitUncheckedCreateInput>
  }

  /**
   * Rabbit createMany
   */
  export type RabbitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rabbits.
     */
    data: RabbitCreateManyInput | RabbitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rabbit createManyAndReturn
   */
  export type RabbitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Rabbits.
     */
    data: RabbitCreateManyInput | RabbitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rabbit update
   */
  export type RabbitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitInclude<ExtArgs> | null
    /**
     * The data needed to update a Rabbit.
     */
    data: XOR<RabbitUpdateInput, RabbitUncheckedUpdateInput>
    /**
     * Choose, which Rabbit to update.
     */
    where: RabbitWhereUniqueInput
  }

  /**
   * Rabbit updateMany
   */
  export type RabbitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rabbits.
     */
    data: XOR<RabbitUpdateManyMutationInput, RabbitUncheckedUpdateManyInput>
    /**
     * Filter which Rabbits to update
     */
    where?: RabbitWhereInput
  }

  /**
   * Rabbit upsert
   */
  export type RabbitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitInclude<ExtArgs> | null
    /**
     * The filter to search for the Rabbit to update in case it exists.
     */
    where: RabbitWhereUniqueInput
    /**
     * In case the Rabbit found by the `where` argument doesn't exist, create a new Rabbit with this data.
     */
    create: XOR<RabbitCreateInput, RabbitUncheckedCreateInput>
    /**
     * In case the Rabbit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RabbitUpdateInput, RabbitUncheckedUpdateInput>
  }

  /**
   * Rabbit delete
   */
  export type RabbitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitInclude<ExtArgs> | null
    /**
     * Filter which Rabbit to delete.
     */
    where: RabbitWhereUniqueInput
  }

  /**
   * Rabbit deleteMany
   */
  export type RabbitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rabbits to delete
     */
    where?: RabbitWhereInput
  }

  /**
   * Rabbit.photos
   */
  export type Rabbit$photosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
    where?: RabbitPhotoWhereInput
    orderBy?: RabbitPhotoOrderByWithRelationInput | RabbitPhotoOrderByWithRelationInput[]
    cursor?: RabbitPhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RabbitPhotoScalarFieldEnum | RabbitPhotoScalarFieldEnum[]
  }

  /**
   * Rabbit.reservations
   */
  export type Rabbit$reservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    cursor?: ReservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Rabbit without action
   */
  export type RabbitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rabbit
     */
    select?: RabbitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitInclude<ExtArgs> | null
  }


  /**
   * Model RabbitPhoto
   */

  export type AggregateRabbitPhoto = {
    _count: RabbitPhotoCountAggregateOutputType | null
    _avg: RabbitPhotoAvgAggregateOutputType | null
    _sum: RabbitPhotoSumAggregateOutputType | null
    _min: RabbitPhotoMinAggregateOutputType | null
    _max: RabbitPhotoMaxAggregateOutputType | null
  }

  export type RabbitPhotoAvgAggregateOutputType = {
    id: number | null
    position: number | null
  }

  export type RabbitPhotoSumAggregateOutputType = {
    id: number | null
    position: number | null
  }

  export type RabbitPhotoMinAggregateOutputType = {
    id: number | null
    rabbitId: string | null
    url: string | null
    publicId: string | null
    position: number | null
    isMain: boolean | null
  }

  export type RabbitPhotoMaxAggregateOutputType = {
    id: number | null
    rabbitId: string | null
    url: string | null
    publicId: string | null
    position: number | null
    isMain: boolean | null
  }

  export type RabbitPhotoCountAggregateOutputType = {
    id: number
    rabbitId: number
    url: number
    publicId: number
    position: number
    isMain: number
    _all: number
  }


  export type RabbitPhotoAvgAggregateInputType = {
    id?: true
    position?: true
  }

  export type RabbitPhotoSumAggregateInputType = {
    id?: true
    position?: true
  }

  export type RabbitPhotoMinAggregateInputType = {
    id?: true
    rabbitId?: true
    url?: true
    publicId?: true
    position?: true
    isMain?: true
  }

  export type RabbitPhotoMaxAggregateInputType = {
    id?: true
    rabbitId?: true
    url?: true
    publicId?: true
    position?: true
    isMain?: true
  }

  export type RabbitPhotoCountAggregateInputType = {
    id?: true
    rabbitId?: true
    url?: true
    publicId?: true
    position?: true
    isMain?: true
    _all?: true
  }

  export type RabbitPhotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RabbitPhoto to aggregate.
     */
    where?: RabbitPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RabbitPhotos to fetch.
     */
    orderBy?: RabbitPhotoOrderByWithRelationInput | RabbitPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RabbitPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RabbitPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RabbitPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RabbitPhotos
    **/
    _count?: true | RabbitPhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RabbitPhotoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RabbitPhotoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RabbitPhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RabbitPhotoMaxAggregateInputType
  }

  export type GetRabbitPhotoAggregateType<T extends RabbitPhotoAggregateArgs> = {
        [P in keyof T & keyof AggregateRabbitPhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRabbitPhoto[P]>
      : GetScalarType<T[P], AggregateRabbitPhoto[P]>
  }




  export type RabbitPhotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RabbitPhotoWhereInput
    orderBy?: RabbitPhotoOrderByWithAggregationInput | RabbitPhotoOrderByWithAggregationInput[]
    by: RabbitPhotoScalarFieldEnum[] | RabbitPhotoScalarFieldEnum
    having?: RabbitPhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RabbitPhotoCountAggregateInputType | true
    _avg?: RabbitPhotoAvgAggregateInputType
    _sum?: RabbitPhotoSumAggregateInputType
    _min?: RabbitPhotoMinAggregateInputType
    _max?: RabbitPhotoMaxAggregateInputType
  }

  export type RabbitPhotoGroupByOutputType = {
    id: number
    rabbitId: string
    url: string
    publicId: string | null
    position: number
    isMain: boolean
    _count: RabbitPhotoCountAggregateOutputType | null
    _avg: RabbitPhotoAvgAggregateOutputType | null
    _sum: RabbitPhotoSumAggregateOutputType | null
    _min: RabbitPhotoMinAggregateOutputType | null
    _max: RabbitPhotoMaxAggregateOutputType | null
  }

  type GetRabbitPhotoGroupByPayload<T extends RabbitPhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RabbitPhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RabbitPhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RabbitPhotoGroupByOutputType[P]>
            : GetScalarType<T[P], RabbitPhotoGroupByOutputType[P]>
        }
      >
    >


  export type RabbitPhotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rabbitId?: boolean
    url?: boolean
    publicId?: boolean
    position?: boolean
    isMain?: boolean
    rabbit?: boolean | RabbitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rabbitPhoto"]>

  export type RabbitPhotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rabbitId?: boolean
    url?: boolean
    publicId?: boolean
    position?: boolean
    isMain?: boolean
    rabbit?: boolean | RabbitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rabbitPhoto"]>

  export type RabbitPhotoSelectScalar = {
    id?: boolean
    rabbitId?: boolean
    url?: boolean
    publicId?: boolean
    position?: boolean
    isMain?: boolean
  }

  export type RabbitPhotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rabbit?: boolean | RabbitDefaultArgs<ExtArgs>
  }
  export type RabbitPhotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rabbit?: boolean | RabbitDefaultArgs<ExtArgs>
  }

  export type $RabbitPhotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RabbitPhoto"
    objects: {
      rabbit: Prisma.$RabbitPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      rabbitId: string
      url: string
      publicId: string | null
      position: number
      isMain: boolean
    }, ExtArgs["result"]["rabbitPhoto"]>
    composites: {}
  }

  type RabbitPhotoGetPayload<S extends boolean | null | undefined | RabbitPhotoDefaultArgs> = $Result.GetResult<Prisma.$RabbitPhotoPayload, S>

  type RabbitPhotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RabbitPhotoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RabbitPhotoCountAggregateInputType | true
    }

  export interface RabbitPhotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RabbitPhoto'], meta: { name: 'RabbitPhoto' } }
    /**
     * Find zero or one RabbitPhoto that matches the filter.
     * @param {RabbitPhotoFindUniqueArgs} args - Arguments to find a RabbitPhoto
     * @example
     * // Get one RabbitPhoto
     * const rabbitPhoto = await prisma.rabbitPhoto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RabbitPhotoFindUniqueArgs>(args: SelectSubset<T, RabbitPhotoFindUniqueArgs<ExtArgs>>): Prisma__RabbitPhotoClient<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RabbitPhoto that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RabbitPhotoFindUniqueOrThrowArgs} args - Arguments to find a RabbitPhoto
     * @example
     * // Get one RabbitPhoto
     * const rabbitPhoto = await prisma.rabbitPhoto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RabbitPhotoFindUniqueOrThrowArgs>(args: SelectSubset<T, RabbitPhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RabbitPhotoClient<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RabbitPhoto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitPhotoFindFirstArgs} args - Arguments to find a RabbitPhoto
     * @example
     * // Get one RabbitPhoto
     * const rabbitPhoto = await prisma.rabbitPhoto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RabbitPhotoFindFirstArgs>(args?: SelectSubset<T, RabbitPhotoFindFirstArgs<ExtArgs>>): Prisma__RabbitPhotoClient<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RabbitPhoto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitPhotoFindFirstOrThrowArgs} args - Arguments to find a RabbitPhoto
     * @example
     * // Get one RabbitPhoto
     * const rabbitPhoto = await prisma.rabbitPhoto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RabbitPhotoFindFirstOrThrowArgs>(args?: SelectSubset<T, RabbitPhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__RabbitPhotoClient<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RabbitPhotos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitPhotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RabbitPhotos
     * const rabbitPhotos = await prisma.rabbitPhoto.findMany()
     * 
     * // Get first 10 RabbitPhotos
     * const rabbitPhotos = await prisma.rabbitPhoto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rabbitPhotoWithIdOnly = await prisma.rabbitPhoto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RabbitPhotoFindManyArgs>(args?: SelectSubset<T, RabbitPhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RabbitPhoto.
     * @param {RabbitPhotoCreateArgs} args - Arguments to create a RabbitPhoto.
     * @example
     * // Create one RabbitPhoto
     * const RabbitPhoto = await prisma.rabbitPhoto.create({
     *   data: {
     *     // ... data to create a RabbitPhoto
     *   }
     * })
     * 
     */
    create<T extends RabbitPhotoCreateArgs>(args: SelectSubset<T, RabbitPhotoCreateArgs<ExtArgs>>): Prisma__RabbitPhotoClient<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RabbitPhotos.
     * @param {RabbitPhotoCreateManyArgs} args - Arguments to create many RabbitPhotos.
     * @example
     * // Create many RabbitPhotos
     * const rabbitPhoto = await prisma.rabbitPhoto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RabbitPhotoCreateManyArgs>(args?: SelectSubset<T, RabbitPhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RabbitPhotos and returns the data saved in the database.
     * @param {RabbitPhotoCreateManyAndReturnArgs} args - Arguments to create many RabbitPhotos.
     * @example
     * // Create many RabbitPhotos
     * const rabbitPhoto = await prisma.rabbitPhoto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RabbitPhotos and only return the `id`
     * const rabbitPhotoWithIdOnly = await prisma.rabbitPhoto.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RabbitPhotoCreateManyAndReturnArgs>(args?: SelectSubset<T, RabbitPhotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RabbitPhoto.
     * @param {RabbitPhotoDeleteArgs} args - Arguments to delete one RabbitPhoto.
     * @example
     * // Delete one RabbitPhoto
     * const RabbitPhoto = await prisma.rabbitPhoto.delete({
     *   where: {
     *     // ... filter to delete one RabbitPhoto
     *   }
     * })
     * 
     */
    delete<T extends RabbitPhotoDeleteArgs>(args: SelectSubset<T, RabbitPhotoDeleteArgs<ExtArgs>>): Prisma__RabbitPhotoClient<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RabbitPhoto.
     * @param {RabbitPhotoUpdateArgs} args - Arguments to update one RabbitPhoto.
     * @example
     * // Update one RabbitPhoto
     * const rabbitPhoto = await prisma.rabbitPhoto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RabbitPhotoUpdateArgs>(args: SelectSubset<T, RabbitPhotoUpdateArgs<ExtArgs>>): Prisma__RabbitPhotoClient<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RabbitPhotos.
     * @param {RabbitPhotoDeleteManyArgs} args - Arguments to filter RabbitPhotos to delete.
     * @example
     * // Delete a few RabbitPhotos
     * const { count } = await prisma.rabbitPhoto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RabbitPhotoDeleteManyArgs>(args?: SelectSubset<T, RabbitPhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RabbitPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitPhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RabbitPhotos
     * const rabbitPhoto = await prisma.rabbitPhoto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RabbitPhotoUpdateManyArgs>(args: SelectSubset<T, RabbitPhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RabbitPhoto.
     * @param {RabbitPhotoUpsertArgs} args - Arguments to update or create a RabbitPhoto.
     * @example
     * // Update or create a RabbitPhoto
     * const rabbitPhoto = await prisma.rabbitPhoto.upsert({
     *   create: {
     *     // ... data to create a RabbitPhoto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RabbitPhoto we want to update
     *   }
     * })
     */
    upsert<T extends RabbitPhotoUpsertArgs>(args: SelectSubset<T, RabbitPhotoUpsertArgs<ExtArgs>>): Prisma__RabbitPhotoClient<$Result.GetResult<Prisma.$RabbitPhotoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RabbitPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitPhotoCountArgs} args - Arguments to filter RabbitPhotos to count.
     * @example
     * // Count the number of RabbitPhotos
     * const count = await prisma.rabbitPhoto.count({
     *   where: {
     *     // ... the filter for the RabbitPhotos we want to count
     *   }
     * })
    **/
    count<T extends RabbitPhotoCountArgs>(
      args?: Subset<T, RabbitPhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RabbitPhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RabbitPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitPhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RabbitPhotoAggregateArgs>(args: Subset<T, RabbitPhotoAggregateArgs>): Prisma.PrismaPromise<GetRabbitPhotoAggregateType<T>>

    /**
     * Group by RabbitPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RabbitPhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RabbitPhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RabbitPhotoGroupByArgs['orderBy'] }
        : { orderBy?: RabbitPhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RabbitPhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRabbitPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RabbitPhoto model
   */
  readonly fields: RabbitPhotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RabbitPhoto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RabbitPhotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rabbit<T extends RabbitDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RabbitDefaultArgs<ExtArgs>>): Prisma__RabbitClient<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RabbitPhoto model
   */ 
  interface RabbitPhotoFieldRefs {
    readonly id: FieldRef<"RabbitPhoto", 'Int'>
    readonly rabbitId: FieldRef<"RabbitPhoto", 'String'>
    readonly url: FieldRef<"RabbitPhoto", 'String'>
    readonly publicId: FieldRef<"RabbitPhoto", 'String'>
    readonly position: FieldRef<"RabbitPhoto", 'Int'>
    readonly isMain: FieldRef<"RabbitPhoto", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * RabbitPhoto findUnique
   */
  export type RabbitPhotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
    /**
     * Filter, which RabbitPhoto to fetch.
     */
    where: RabbitPhotoWhereUniqueInput
  }

  /**
   * RabbitPhoto findUniqueOrThrow
   */
  export type RabbitPhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
    /**
     * Filter, which RabbitPhoto to fetch.
     */
    where: RabbitPhotoWhereUniqueInput
  }

  /**
   * RabbitPhoto findFirst
   */
  export type RabbitPhotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
    /**
     * Filter, which RabbitPhoto to fetch.
     */
    where?: RabbitPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RabbitPhotos to fetch.
     */
    orderBy?: RabbitPhotoOrderByWithRelationInput | RabbitPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RabbitPhotos.
     */
    cursor?: RabbitPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RabbitPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RabbitPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RabbitPhotos.
     */
    distinct?: RabbitPhotoScalarFieldEnum | RabbitPhotoScalarFieldEnum[]
  }

  /**
   * RabbitPhoto findFirstOrThrow
   */
  export type RabbitPhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
    /**
     * Filter, which RabbitPhoto to fetch.
     */
    where?: RabbitPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RabbitPhotos to fetch.
     */
    orderBy?: RabbitPhotoOrderByWithRelationInput | RabbitPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RabbitPhotos.
     */
    cursor?: RabbitPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RabbitPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RabbitPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RabbitPhotos.
     */
    distinct?: RabbitPhotoScalarFieldEnum | RabbitPhotoScalarFieldEnum[]
  }

  /**
   * RabbitPhoto findMany
   */
  export type RabbitPhotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
    /**
     * Filter, which RabbitPhotos to fetch.
     */
    where?: RabbitPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RabbitPhotos to fetch.
     */
    orderBy?: RabbitPhotoOrderByWithRelationInput | RabbitPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RabbitPhotos.
     */
    cursor?: RabbitPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RabbitPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RabbitPhotos.
     */
    skip?: number
    distinct?: RabbitPhotoScalarFieldEnum | RabbitPhotoScalarFieldEnum[]
  }

  /**
   * RabbitPhoto create
   */
  export type RabbitPhotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a RabbitPhoto.
     */
    data: XOR<RabbitPhotoCreateInput, RabbitPhotoUncheckedCreateInput>
  }

  /**
   * RabbitPhoto createMany
   */
  export type RabbitPhotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RabbitPhotos.
     */
    data: RabbitPhotoCreateManyInput | RabbitPhotoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RabbitPhoto createManyAndReturn
   */
  export type RabbitPhotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RabbitPhotos.
     */
    data: RabbitPhotoCreateManyInput | RabbitPhotoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RabbitPhoto update
   */
  export type RabbitPhotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a RabbitPhoto.
     */
    data: XOR<RabbitPhotoUpdateInput, RabbitPhotoUncheckedUpdateInput>
    /**
     * Choose, which RabbitPhoto to update.
     */
    where: RabbitPhotoWhereUniqueInput
  }

  /**
   * RabbitPhoto updateMany
   */
  export type RabbitPhotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RabbitPhotos.
     */
    data: XOR<RabbitPhotoUpdateManyMutationInput, RabbitPhotoUncheckedUpdateManyInput>
    /**
     * Filter which RabbitPhotos to update
     */
    where?: RabbitPhotoWhereInput
  }

  /**
   * RabbitPhoto upsert
   */
  export type RabbitPhotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the RabbitPhoto to update in case it exists.
     */
    where: RabbitPhotoWhereUniqueInput
    /**
     * In case the RabbitPhoto found by the `where` argument doesn't exist, create a new RabbitPhoto with this data.
     */
    create: XOR<RabbitPhotoCreateInput, RabbitPhotoUncheckedCreateInput>
    /**
     * In case the RabbitPhoto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RabbitPhotoUpdateInput, RabbitPhotoUncheckedUpdateInput>
  }

  /**
   * RabbitPhoto delete
   */
  export type RabbitPhotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
    /**
     * Filter which RabbitPhoto to delete.
     */
    where: RabbitPhotoWhereUniqueInput
  }

  /**
   * RabbitPhoto deleteMany
   */
  export type RabbitPhotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RabbitPhotos to delete
     */
    where?: RabbitPhotoWhereInput
  }

  /**
   * RabbitPhoto without action
   */
  export type RabbitPhotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RabbitPhoto
     */
    select?: RabbitPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RabbitPhotoInclude<ExtArgs> | null
  }


  /**
   * Model Reservation
   */

  export type AggregateReservation = {
    _count: ReservationCountAggregateOutputType | null
    _avg: ReservationAvgAggregateOutputType | null
    _sum: ReservationSumAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  export type ReservationAvgAggregateOutputType = {
    quantity: number | null
    latitude: number | null
    longitude: number | null
    deliveryFee: number | null
  }

  export type ReservationSumAggregateOutputType = {
    quantity: number | null
    latitude: number | null
    longitude: number | null
    deliveryFee: number | null
  }

  export type ReservationMinAggregateOutputType = {
    id: string | null
    rabbitId: string | null
    quantity: number | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    message: string | null
    status: string | null
    latitude: number | null
    longitude: number | null
    deliveryZone: string | null
    deliveryFee: number | null
    confirmedAt: Date | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReservationMaxAggregateOutputType = {
    id: string | null
    rabbitId: string | null
    quantity: number | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    message: string | null
    status: string | null
    latitude: number | null
    longitude: number | null
    deliveryZone: string | null
    deliveryFee: number | null
    confirmedAt: Date | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReservationCountAggregateOutputType = {
    id: number
    rabbitId: number
    quantity: number
    firstName: number
    lastName: number
    email: number
    phone: number
    message: number
    status: number
    latitude: number
    longitude: number
    deliveryZone: number
    deliveryFee: number
    confirmedAt: number
    note: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReservationAvgAggregateInputType = {
    quantity?: true
    latitude?: true
    longitude?: true
    deliveryFee?: true
  }

  export type ReservationSumAggregateInputType = {
    quantity?: true
    latitude?: true
    longitude?: true
    deliveryFee?: true
  }

  export type ReservationMinAggregateInputType = {
    id?: true
    rabbitId?: true
    quantity?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    message?: true
    status?: true
    latitude?: true
    longitude?: true
    deliveryZone?: true
    deliveryFee?: true
    confirmedAt?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReservationMaxAggregateInputType = {
    id?: true
    rabbitId?: true
    quantity?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    message?: true
    status?: true
    latitude?: true
    longitude?: true
    deliveryZone?: true
    deliveryFee?: true
    confirmedAt?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReservationCountAggregateInputType = {
    id?: true
    rabbitId?: true
    quantity?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    message?: true
    status?: true
    latitude?: true
    longitude?: true
    deliveryZone?: true
    deliveryFee?: true
    confirmedAt?: true
    note?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservation to aggregate.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reservations
    **/
    _count?: true | ReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReservationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReservationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservationMaxAggregateInputType
  }

  export type GetReservationAggregateType<T extends ReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReservation[P]>
      : GetScalarType<T[P], AggregateReservation[P]>
  }




  export type ReservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithAggregationInput | ReservationOrderByWithAggregationInput[]
    by: ReservationScalarFieldEnum[] | ReservationScalarFieldEnum
    having?: ReservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservationCountAggregateInputType | true
    _avg?: ReservationAvgAggregateInputType
    _sum?: ReservationSumAggregateInputType
    _min?: ReservationMinAggregateInputType
    _max?: ReservationMaxAggregateInputType
  }

  export type ReservationGroupByOutputType = {
    id: string
    rabbitId: string
    quantity: number
    firstName: string
    lastName: string
    email: string
    phone: string
    message: string | null
    status: string
    latitude: number | null
    longitude: number | null
    deliveryZone: string | null
    deliveryFee: number | null
    confirmedAt: Date | null
    note: string | null
    createdAt: Date
    updatedAt: Date
    _count: ReservationCountAggregateOutputType | null
    _avg: ReservationAvgAggregateOutputType | null
    _sum: ReservationSumAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  type GetReservationGroupByPayload<T extends ReservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservationGroupByOutputType[P]>
            : GetScalarType<T[P], ReservationGroupByOutputType[P]>
        }
      >
    >


  export type ReservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rabbitId?: boolean
    quantity?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    message?: boolean
    status?: boolean
    latitude?: boolean
    longitude?: boolean
    deliveryZone?: boolean
    deliveryFee?: boolean
    confirmedAt?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rabbit?: boolean | RabbitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rabbitId?: boolean
    quantity?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    message?: boolean
    status?: boolean
    latitude?: boolean
    longitude?: boolean
    deliveryZone?: boolean
    deliveryFee?: boolean
    confirmedAt?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rabbit?: boolean | RabbitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectScalar = {
    id?: boolean
    rabbitId?: boolean
    quantity?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    message?: boolean
    status?: boolean
    latitude?: boolean
    longitude?: boolean
    deliveryZone?: boolean
    deliveryFee?: boolean
    confirmedAt?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rabbit?: boolean | RabbitDefaultArgs<ExtArgs>
  }
  export type ReservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rabbit?: boolean | RabbitDefaultArgs<ExtArgs>
  }

  export type $ReservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reservation"
    objects: {
      rabbit: Prisma.$RabbitPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rabbitId: string
      quantity: number
      firstName: string
      lastName: string
      email: string
      phone: string
      message: string | null
      status: string
      latitude: number | null
      longitude: number | null
      deliveryZone: string | null
      deliveryFee: number | null
      confirmedAt: Date | null
      note: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["reservation"]>
    composites: {}
  }

  type ReservationGetPayload<S extends boolean | null | undefined | ReservationDefaultArgs> = $Result.GetResult<Prisma.$ReservationPayload, S>

  type ReservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReservationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReservationCountAggregateInputType | true
    }

  export interface ReservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reservation'], meta: { name: 'Reservation' } }
    /**
     * Find zero or one Reservation that matches the filter.
     * @param {ReservationFindUniqueArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservationFindUniqueArgs>(args: SelectSubset<T, ReservationFindUniqueArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Reservation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReservationFindUniqueOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservationFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Reservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindFirstArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservationFindFirstArgs>(args?: SelectSubset<T, ReservationFindFirstArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Reservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindFirstOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservationFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Reservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reservations
     * const reservations = await prisma.reservation.findMany()
     * 
     * // Get first 10 Reservations
     * const reservations = await prisma.reservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reservationWithIdOnly = await prisma.reservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReservationFindManyArgs>(args?: SelectSubset<T, ReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Reservation.
     * @param {ReservationCreateArgs} args - Arguments to create a Reservation.
     * @example
     * // Create one Reservation
     * const Reservation = await prisma.reservation.create({
     *   data: {
     *     // ... data to create a Reservation
     *   }
     * })
     * 
     */
    create<T extends ReservationCreateArgs>(args: SelectSubset<T, ReservationCreateArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Reservations.
     * @param {ReservationCreateManyArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservationCreateManyArgs>(args?: SelectSubset<T, ReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reservations and returns the data saved in the database.
     * @param {ReservationCreateManyAndReturnArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reservations and only return the `id`
     * const reservationWithIdOnly = await prisma.reservation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReservationCreateManyAndReturnArgs>(args?: SelectSubset<T, ReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Reservation.
     * @param {ReservationDeleteArgs} args - Arguments to delete one Reservation.
     * @example
     * // Delete one Reservation
     * const Reservation = await prisma.reservation.delete({
     *   where: {
     *     // ... filter to delete one Reservation
     *   }
     * })
     * 
     */
    delete<T extends ReservationDeleteArgs>(args: SelectSubset<T, ReservationDeleteArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Reservation.
     * @param {ReservationUpdateArgs} args - Arguments to update one Reservation.
     * @example
     * // Update one Reservation
     * const reservation = await prisma.reservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservationUpdateArgs>(args: SelectSubset<T, ReservationUpdateArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Reservations.
     * @param {ReservationDeleteManyArgs} args - Arguments to filter Reservations to delete.
     * @example
     * // Delete a few Reservations
     * const { count } = await prisma.reservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservationDeleteManyArgs>(args?: SelectSubset<T, ReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reservations
     * const reservation = await prisma.reservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservationUpdateManyArgs>(args: SelectSubset<T, ReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Reservation.
     * @param {ReservationUpsertArgs} args - Arguments to update or create a Reservation.
     * @example
     * // Update or create a Reservation
     * const reservation = await prisma.reservation.upsert({
     *   create: {
     *     // ... data to create a Reservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reservation we want to update
     *   }
     * })
     */
    upsert<T extends ReservationUpsertArgs>(args: SelectSubset<T, ReservationUpsertArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationCountArgs} args - Arguments to filter Reservations to count.
     * @example
     * // Count the number of Reservations
     * const count = await prisma.reservation.count({
     *   where: {
     *     // ... the filter for the Reservations we want to count
     *   }
     * })
    **/
    count<T extends ReservationCountArgs>(
      args?: Subset<T, ReservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReservationAggregateArgs>(args: Subset<T, ReservationAggregateArgs>): Prisma.PrismaPromise<GetReservationAggregateType<T>>

    /**
     * Group by Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservationGroupByArgs['orderBy'] }
        : { orderBy?: ReservationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reservation model
   */
  readonly fields: ReservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rabbit<T extends RabbitDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RabbitDefaultArgs<ExtArgs>>): Prisma__RabbitClient<$Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reservation model
   */ 
  interface ReservationFieldRefs {
    readonly id: FieldRef<"Reservation", 'String'>
    readonly rabbitId: FieldRef<"Reservation", 'String'>
    readonly quantity: FieldRef<"Reservation", 'Int'>
    readonly firstName: FieldRef<"Reservation", 'String'>
    readonly lastName: FieldRef<"Reservation", 'String'>
    readonly email: FieldRef<"Reservation", 'String'>
    readonly phone: FieldRef<"Reservation", 'String'>
    readonly message: FieldRef<"Reservation", 'String'>
    readonly status: FieldRef<"Reservation", 'String'>
    readonly latitude: FieldRef<"Reservation", 'Float'>
    readonly longitude: FieldRef<"Reservation", 'Float'>
    readonly deliveryZone: FieldRef<"Reservation", 'String'>
    readonly deliveryFee: FieldRef<"Reservation", 'Float'>
    readonly confirmedAt: FieldRef<"Reservation", 'DateTime'>
    readonly note: FieldRef<"Reservation", 'String'>
    readonly createdAt: FieldRef<"Reservation", 'DateTime'>
    readonly updatedAt: FieldRef<"Reservation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Reservation findUnique
   */
  export type ReservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation findUniqueOrThrow
   */
  export type ReservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation findFirst
   */
  export type ReservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation findFirstOrThrow
   */
  export type ReservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation findMany
   */
  export type ReservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservations to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation create
   */
  export type ReservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The data needed to create a Reservation.
     */
    data: XOR<ReservationCreateInput, ReservationUncheckedCreateInput>
  }

  /**
   * Reservation createMany
   */
  export type ReservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reservations.
     */
    data: ReservationCreateManyInput | ReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reservation createManyAndReturn
   */
  export type ReservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Reservations.
     */
    data: ReservationCreateManyInput | ReservationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reservation update
   */
  export type ReservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The data needed to update a Reservation.
     */
    data: XOR<ReservationUpdateInput, ReservationUncheckedUpdateInput>
    /**
     * Choose, which Reservation to update.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation updateMany
   */
  export type ReservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reservations.
     */
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyInput>
    /**
     * Filter which Reservations to update
     */
    where?: ReservationWhereInput
  }

  /**
   * Reservation upsert
   */
  export type ReservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The filter to search for the Reservation to update in case it exists.
     */
    where: ReservationWhereUniqueInput
    /**
     * In case the Reservation found by the `where` argument doesn't exist, create a new Reservation with this data.
     */
    create: XOR<ReservationCreateInput, ReservationUncheckedCreateInput>
    /**
     * In case the Reservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservationUpdateInput, ReservationUncheckedUpdateInput>
  }

  /**
   * Reservation delete
   */
  export type ReservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter which Reservation to delete.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation deleteMany
   */
  export type ReservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservations to delete
     */
    where?: ReservationWhereInput
  }

  /**
   * Reservation without action
   */
  export type ReservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
  }


  /**
   * Model VisitStats
   */

  export type AggregateVisitStats = {
    _count: VisitStatsCountAggregateOutputType | null
    _avg: VisitStatsAvgAggregateOutputType | null
    _sum: VisitStatsSumAggregateOutputType | null
    _min: VisitStatsMinAggregateOutputType | null
    _max: VisitStatsMaxAggregateOutputType | null
  }

  export type VisitStatsAvgAggregateOutputType = {
    accepted: number | null
    declined: number | null
    total: number | null
  }

  export type VisitStatsSumAggregateOutputType = {
    accepted: number | null
    declined: number | null
    total: number | null
  }

  export type VisitStatsMinAggregateOutputType = {
    id: string | null
    accepted: number | null
    declined: number | null
    total: number | null
  }

  export type VisitStatsMaxAggregateOutputType = {
    id: string | null
    accepted: number | null
    declined: number | null
    total: number | null
  }

  export type VisitStatsCountAggregateOutputType = {
    id: number
    accepted: number
    declined: number
    total: number
    _all: number
  }


  export type VisitStatsAvgAggregateInputType = {
    accepted?: true
    declined?: true
    total?: true
  }

  export type VisitStatsSumAggregateInputType = {
    accepted?: true
    declined?: true
    total?: true
  }

  export type VisitStatsMinAggregateInputType = {
    id?: true
    accepted?: true
    declined?: true
    total?: true
  }

  export type VisitStatsMaxAggregateInputType = {
    id?: true
    accepted?: true
    declined?: true
    total?: true
  }

  export type VisitStatsCountAggregateInputType = {
    id?: true
    accepted?: true
    declined?: true
    total?: true
    _all?: true
  }

  export type VisitStatsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisitStats to aggregate.
     */
    where?: VisitStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitStats to fetch.
     */
    orderBy?: VisitStatsOrderByWithRelationInput | VisitStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VisitStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VisitStats
    **/
    _count?: true | VisitStatsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VisitStatsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VisitStatsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VisitStatsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VisitStatsMaxAggregateInputType
  }

  export type GetVisitStatsAggregateType<T extends VisitStatsAggregateArgs> = {
        [P in keyof T & keyof AggregateVisitStats]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisitStats[P]>
      : GetScalarType<T[P], AggregateVisitStats[P]>
  }




  export type VisitStatsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisitStatsWhereInput
    orderBy?: VisitStatsOrderByWithAggregationInput | VisitStatsOrderByWithAggregationInput[]
    by: VisitStatsScalarFieldEnum[] | VisitStatsScalarFieldEnum
    having?: VisitStatsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VisitStatsCountAggregateInputType | true
    _avg?: VisitStatsAvgAggregateInputType
    _sum?: VisitStatsSumAggregateInputType
    _min?: VisitStatsMinAggregateInputType
    _max?: VisitStatsMaxAggregateInputType
  }

  export type VisitStatsGroupByOutputType = {
    id: string
    accepted: number
    declined: number
    total: number
    _count: VisitStatsCountAggregateOutputType | null
    _avg: VisitStatsAvgAggregateOutputType | null
    _sum: VisitStatsSumAggregateOutputType | null
    _min: VisitStatsMinAggregateOutputType | null
    _max: VisitStatsMaxAggregateOutputType | null
  }

  type GetVisitStatsGroupByPayload<T extends VisitStatsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VisitStatsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VisitStatsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisitStatsGroupByOutputType[P]>
            : GetScalarType<T[P], VisitStatsGroupByOutputType[P]>
        }
      >
    >


  export type VisitStatsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accepted?: boolean
    declined?: boolean
    total?: boolean
  }, ExtArgs["result"]["visitStats"]>

  export type VisitStatsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accepted?: boolean
    declined?: boolean
    total?: boolean
  }, ExtArgs["result"]["visitStats"]>

  export type VisitStatsSelectScalar = {
    id?: boolean
    accepted?: boolean
    declined?: boolean
    total?: boolean
  }


  export type $VisitStatsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VisitStats"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accepted: number
      declined: number
      total: number
    }, ExtArgs["result"]["visitStats"]>
    composites: {}
  }

  type VisitStatsGetPayload<S extends boolean | null | undefined | VisitStatsDefaultArgs> = $Result.GetResult<Prisma.$VisitStatsPayload, S>

  type VisitStatsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VisitStatsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VisitStatsCountAggregateInputType | true
    }

  export interface VisitStatsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VisitStats'], meta: { name: 'VisitStats' } }
    /**
     * Find zero or one VisitStats that matches the filter.
     * @param {VisitStatsFindUniqueArgs} args - Arguments to find a VisitStats
     * @example
     * // Get one VisitStats
     * const visitStats = await prisma.visitStats.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VisitStatsFindUniqueArgs>(args: SelectSubset<T, VisitStatsFindUniqueArgs<ExtArgs>>): Prisma__VisitStatsClient<$Result.GetResult<Prisma.$VisitStatsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VisitStats that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VisitStatsFindUniqueOrThrowArgs} args - Arguments to find a VisitStats
     * @example
     * // Get one VisitStats
     * const visitStats = await prisma.visitStats.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VisitStatsFindUniqueOrThrowArgs>(args: SelectSubset<T, VisitStatsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VisitStatsClient<$Result.GetResult<Prisma.$VisitStatsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VisitStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitStatsFindFirstArgs} args - Arguments to find a VisitStats
     * @example
     * // Get one VisitStats
     * const visitStats = await prisma.visitStats.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VisitStatsFindFirstArgs>(args?: SelectSubset<T, VisitStatsFindFirstArgs<ExtArgs>>): Prisma__VisitStatsClient<$Result.GetResult<Prisma.$VisitStatsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VisitStats that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitStatsFindFirstOrThrowArgs} args - Arguments to find a VisitStats
     * @example
     * // Get one VisitStats
     * const visitStats = await prisma.visitStats.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VisitStatsFindFirstOrThrowArgs>(args?: SelectSubset<T, VisitStatsFindFirstOrThrowArgs<ExtArgs>>): Prisma__VisitStatsClient<$Result.GetResult<Prisma.$VisitStatsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VisitStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitStatsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VisitStats
     * const visitStats = await prisma.visitStats.findMany()
     * 
     * // Get first 10 VisitStats
     * const visitStats = await prisma.visitStats.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const visitStatsWithIdOnly = await prisma.visitStats.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VisitStatsFindManyArgs>(args?: SelectSubset<T, VisitStatsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitStatsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VisitStats.
     * @param {VisitStatsCreateArgs} args - Arguments to create a VisitStats.
     * @example
     * // Create one VisitStats
     * const VisitStats = await prisma.visitStats.create({
     *   data: {
     *     // ... data to create a VisitStats
     *   }
     * })
     * 
     */
    create<T extends VisitStatsCreateArgs>(args: SelectSubset<T, VisitStatsCreateArgs<ExtArgs>>): Prisma__VisitStatsClient<$Result.GetResult<Prisma.$VisitStatsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VisitStats.
     * @param {VisitStatsCreateManyArgs} args - Arguments to create many VisitStats.
     * @example
     * // Create many VisitStats
     * const visitStats = await prisma.visitStats.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VisitStatsCreateManyArgs>(args?: SelectSubset<T, VisitStatsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VisitStats and returns the data saved in the database.
     * @param {VisitStatsCreateManyAndReturnArgs} args - Arguments to create many VisitStats.
     * @example
     * // Create many VisitStats
     * const visitStats = await prisma.visitStats.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VisitStats and only return the `id`
     * const visitStatsWithIdOnly = await prisma.visitStats.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VisitStatsCreateManyAndReturnArgs>(args?: SelectSubset<T, VisitStatsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitStatsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a VisitStats.
     * @param {VisitStatsDeleteArgs} args - Arguments to delete one VisitStats.
     * @example
     * // Delete one VisitStats
     * const VisitStats = await prisma.visitStats.delete({
     *   where: {
     *     // ... filter to delete one VisitStats
     *   }
     * })
     * 
     */
    delete<T extends VisitStatsDeleteArgs>(args: SelectSubset<T, VisitStatsDeleteArgs<ExtArgs>>): Prisma__VisitStatsClient<$Result.GetResult<Prisma.$VisitStatsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VisitStats.
     * @param {VisitStatsUpdateArgs} args - Arguments to update one VisitStats.
     * @example
     * // Update one VisitStats
     * const visitStats = await prisma.visitStats.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VisitStatsUpdateArgs>(args: SelectSubset<T, VisitStatsUpdateArgs<ExtArgs>>): Prisma__VisitStatsClient<$Result.GetResult<Prisma.$VisitStatsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VisitStats.
     * @param {VisitStatsDeleteManyArgs} args - Arguments to filter VisitStats to delete.
     * @example
     * // Delete a few VisitStats
     * const { count } = await prisma.visitStats.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VisitStatsDeleteManyArgs>(args?: SelectSubset<T, VisitStatsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VisitStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitStatsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VisitStats
     * const visitStats = await prisma.visitStats.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VisitStatsUpdateManyArgs>(args: SelectSubset<T, VisitStatsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VisitStats.
     * @param {VisitStatsUpsertArgs} args - Arguments to update or create a VisitStats.
     * @example
     * // Update or create a VisitStats
     * const visitStats = await prisma.visitStats.upsert({
     *   create: {
     *     // ... data to create a VisitStats
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VisitStats we want to update
     *   }
     * })
     */
    upsert<T extends VisitStatsUpsertArgs>(args: SelectSubset<T, VisitStatsUpsertArgs<ExtArgs>>): Prisma__VisitStatsClient<$Result.GetResult<Prisma.$VisitStatsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of VisitStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitStatsCountArgs} args - Arguments to filter VisitStats to count.
     * @example
     * // Count the number of VisitStats
     * const count = await prisma.visitStats.count({
     *   where: {
     *     // ... the filter for the VisitStats we want to count
     *   }
     * })
    **/
    count<T extends VisitStatsCountArgs>(
      args?: Subset<T, VisitStatsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisitStatsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VisitStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitStatsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VisitStatsAggregateArgs>(args: Subset<T, VisitStatsAggregateArgs>): Prisma.PrismaPromise<GetVisitStatsAggregateType<T>>

    /**
     * Group by VisitStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitStatsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VisitStatsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VisitStatsGroupByArgs['orderBy'] }
        : { orderBy?: VisitStatsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VisitStatsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVisitStatsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VisitStats model
   */
  readonly fields: VisitStatsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VisitStats.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VisitStatsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VisitStats model
   */ 
  interface VisitStatsFieldRefs {
    readonly id: FieldRef<"VisitStats", 'String'>
    readonly accepted: FieldRef<"VisitStats", 'Int'>
    readonly declined: FieldRef<"VisitStats", 'Int'>
    readonly total: FieldRef<"VisitStats", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * VisitStats findUnique
   */
  export type VisitStatsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelect<ExtArgs> | null
    /**
     * Filter, which VisitStats to fetch.
     */
    where: VisitStatsWhereUniqueInput
  }

  /**
   * VisitStats findUniqueOrThrow
   */
  export type VisitStatsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelect<ExtArgs> | null
    /**
     * Filter, which VisitStats to fetch.
     */
    where: VisitStatsWhereUniqueInput
  }

  /**
   * VisitStats findFirst
   */
  export type VisitStatsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelect<ExtArgs> | null
    /**
     * Filter, which VisitStats to fetch.
     */
    where?: VisitStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitStats to fetch.
     */
    orderBy?: VisitStatsOrderByWithRelationInput | VisitStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisitStats.
     */
    cursor?: VisitStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisitStats.
     */
    distinct?: VisitStatsScalarFieldEnum | VisitStatsScalarFieldEnum[]
  }

  /**
   * VisitStats findFirstOrThrow
   */
  export type VisitStatsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelect<ExtArgs> | null
    /**
     * Filter, which VisitStats to fetch.
     */
    where?: VisitStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitStats to fetch.
     */
    orderBy?: VisitStatsOrderByWithRelationInput | VisitStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisitStats.
     */
    cursor?: VisitStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisitStats.
     */
    distinct?: VisitStatsScalarFieldEnum | VisitStatsScalarFieldEnum[]
  }

  /**
   * VisitStats findMany
   */
  export type VisitStatsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelect<ExtArgs> | null
    /**
     * Filter, which VisitStats to fetch.
     */
    where?: VisitStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitStats to fetch.
     */
    orderBy?: VisitStatsOrderByWithRelationInput | VisitStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VisitStats.
     */
    cursor?: VisitStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitStats.
     */
    skip?: number
    distinct?: VisitStatsScalarFieldEnum | VisitStatsScalarFieldEnum[]
  }

  /**
   * VisitStats create
   */
  export type VisitStatsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelect<ExtArgs> | null
    /**
     * The data needed to create a VisitStats.
     */
    data?: XOR<VisitStatsCreateInput, VisitStatsUncheckedCreateInput>
  }

  /**
   * VisitStats createMany
   */
  export type VisitStatsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VisitStats.
     */
    data: VisitStatsCreateManyInput | VisitStatsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VisitStats createManyAndReturn
   */
  export type VisitStatsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many VisitStats.
     */
    data: VisitStatsCreateManyInput | VisitStatsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VisitStats update
   */
  export type VisitStatsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelect<ExtArgs> | null
    /**
     * The data needed to update a VisitStats.
     */
    data: XOR<VisitStatsUpdateInput, VisitStatsUncheckedUpdateInput>
    /**
     * Choose, which VisitStats to update.
     */
    where: VisitStatsWhereUniqueInput
  }

  /**
   * VisitStats updateMany
   */
  export type VisitStatsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VisitStats.
     */
    data: XOR<VisitStatsUpdateManyMutationInput, VisitStatsUncheckedUpdateManyInput>
    /**
     * Filter which VisitStats to update
     */
    where?: VisitStatsWhereInput
  }

  /**
   * VisitStats upsert
   */
  export type VisitStatsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelect<ExtArgs> | null
    /**
     * The filter to search for the VisitStats to update in case it exists.
     */
    where: VisitStatsWhereUniqueInput
    /**
     * In case the VisitStats found by the `where` argument doesn't exist, create a new VisitStats with this data.
     */
    create: XOR<VisitStatsCreateInput, VisitStatsUncheckedCreateInput>
    /**
     * In case the VisitStats was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VisitStatsUpdateInput, VisitStatsUncheckedUpdateInput>
  }

  /**
   * VisitStats delete
   */
  export type VisitStatsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelect<ExtArgs> | null
    /**
     * Filter which VisitStats to delete.
     */
    where: VisitStatsWhereUniqueInput
  }

  /**
   * VisitStats deleteMany
   */
  export type VisitStatsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisitStats to delete
     */
    where?: VisitStatsWhereInput
  }

  /**
   * VisitStats without action
   */
  export type VisitStatsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitStats
     */
    select?: VisitStatsSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RabbitScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    breed: 'breed',
    color: 'color',
    gender: 'gender',
    birthDate: 'birthDate',
    weight: 'weight',
    description: 'description',
    price: 'price',
    priceNote: 'priceNote',
    stock: 'stock',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RabbitScalarFieldEnum = (typeof RabbitScalarFieldEnum)[keyof typeof RabbitScalarFieldEnum]


  export const RabbitPhotoScalarFieldEnum: {
    id: 'id',
    rabbitId: 'rabbitId',
    url: 'url',
    publicId: 'publicId',
    position: 'position',
    isMain: 'isMain'
  };

  export type RabbitPhotoScalarFieldEnum = (typeof RabbitPhotoScalarFieldEnum)[keyof typeof RabbitPhotoScalarFieldEnum]


  export const ReservationScalarFieldEnum: {
    id: 'id',
    rabbitId: 'rabbitId',
    quantity: 'quantity',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    message: 'message',
    status: 'status',
    latitude: 'latitude',
    longitude: 'longitude',
    deliveryZone: 'deliveryZone',
    deliveryFee: 'deliveryFee',
    confirmedAt: 'confirmedAt',
    note: 'note',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReservationScalarFieldEnum = (typeof ReservationScalarFieldEnum)[keyof typeof ReservationScalarFieldEnum]


  export const VisitStatsScalarFieldEnum: {
    id: 'id',
    accepted: 'accepted',
    declined: 'declined',
    total: 'total'
  };

  export type VisitStatsScalarFieldEnum = (typeof VisitStatsScalarFieldEnum)[keyof typeof VisitStatsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type RabbitWhereInput = {
    AND?: RabbitWhereInput | RabbitWhereInput[]
    OR?: RabbitWhereInput[]
    NOT?: RabbitWhereInput | RabbitWhereInput[]
    id?: StringFilter<"Rabbit"> | string
    slug?: StringFilter<"Rabbit"> | string
    name?: StringFilter<"Rabbit"> | string
    breed?: StringFilter<"Rabbit"> | string
    color?: StringFilter<"Rabbit"> | string
    gender?: StringFilter<"Rabbit"> | string
    birthDate?: DateTimeNullableFilter<"Rabbit"> | Date | string | null
    weight?: FloatNullableFilter<"Rabbit"> | number | null
    description?: StringNullableFilter<"Rabbit"> | string | null
    price?: FloatFilter<"Rabbit"> | number
    priceNote?: StringNullableFilter<"Rabbit"> | string | null
    stock?: IntFilter<"Rabbit"> | number
    status?: StringFilter<"Rabbit"> | string
    createdAt?: DateTimeFilter<"Rabbit"> | Date | string
    updatedAt?: DateTimeFilter<"Rabbit"> | Date | string
    photos?: RabbitPhotoListRelationFilter
    reservations?: ReservationListRelationFilter
  }

  export type RabbitOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    breed?: SortOrder
    color?: SortOrder
    gender?: SortOrder
    birthDate?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    priceNote?: SortOrderInput | SortOrder
    stock?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    photos?: RabbitPhotoOrderByRelationAggregateInput
    reservations?: ReservationOrderByRelationAggregateInput
  }

  export type RabbitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: RabbitWhereInput | RabbitWhereInput[]
    OR?: RabbitWhereInput[]
    NOT?: RabbitWhereInput | RabbitWhereInput[]
    name?: StringFilter<"Rabbit"> | string
    breed?: StringFilter<"Rabbit"> | string
    color?: StringFilter<"Rabbit"> | string
    gender?: StringFilter<"Rabbit"> | string
    birthDate?: DateTimeNullableFilter<"Rabbit"> | Date | string | null
    weight?: FloatNullableFilter<"Rabbit"> | number | null
    description?: StringNullableFilter<"Rabbit"> | string | null
    price?: FloatFilter<"Rabbit"> | number
    priceNote?: StringNullableFilter<"Rabbit"> | string | null
    stock?: IntFilter<"Rabbit"> | number
    status?: StringFilter<"Rabbit"> | string
    createdAt?: DateTimeFilter<"Rabbit"> | Date | string
    updatedAt?: DateTimeFilter<"Rabbit"> | Date | string
    photos?: RabbitPhotoListRelationFilter
    reservations?: ReservationListRelationFilter
  }, "id" | "slug">

  export type RabbitOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    breed?: SortOrder
    color?: SortOrder
    gender?: SortOrder
    birthDate?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    priceNote?: SortOrderInput | SortOrder
    stock?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RabbitCountOrderByAggregateInput
    _avg?: RabbitAvgOrderByAggregateInput
    _max?: RabbitMaxOrderByAggregateInput
    _min?: RabbitMinOrderByAggregateInput
    _sum?: RabbitSumOrderByAggregateInput
  }

  export type RabbitScalarWhereWithAggregatesInput = {
    AND?: RabbitScalarWhereWithAggregatesInput | RabbitScalarWhereWithAggregatesInput[]
    OR?: RabbitScalarWhereWithAggregatesInput[]
    NOT?: RabbitScalarWhereWithAggregatesInput | RabbitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Rabbit"> | string
    slug?: StringWithAggregatesFilter<"Rabbit"> | string
    name?: StringWithAggregatesFilter<"Rabbit"> | string
    breed?: StringWithAggregatesFilter<"Rabbit"> | string
    color?: StringWithAggregatesFilter<"Rabbit"> | string
    gender?: StringWithAggregatesFilter<"Rabbit"> | string
    birthDate?: DateTimeNullableWithAggregatesFilter<"Rabbit"> | Date | string | null
    weight?: FloatNullableWithAggregatesFilter<"Rabbit"> | number | null
    description?: StringNullableWithAggregatesFilter<"Rabbit"> | string | null
    price?: FloatWithAggregatesFilter<"Rabbit"> | number
    priceNote?: StringNullableWithAggregatesFilter<"Rabbit"> | string | null
    stock?: IntWithAggregatesFilter<"Rabbit"> | number
    status?: StringWithAggregatesFilter<"Rabbit"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Rabbit"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Rabbit"> | Date | string
  }

  export type RabbitPhotoWhereInput = {
    AND?: RabbitPhotoWhereInput | RabbitPhotoWhereInput[]
    OR?: RabbitPhotoWhereInput[]
    NOT?: RabbitPhotoWhereInput | RabbitPhotoWhereInput[]
    id?: IntFilter<"RabbitPhoto"> | number
    rabbitId?: StringFilter<"RabbitPhoto"> | string
    url?: StringFilter<"RabbitPhoto"> | string
    publicId?: StringNullableFilter<"RabbitPhoto"> | string | null
    position?: IntFilter<"RabbitPhoto"> | number
    isMain?: BoolFilter<"RabbitPhoto"> | boolean
    rabbit?: XOR<RabbitRelationFilter, RabbitWhereInput>
  }

  export type RabbitPhotoOrderByWithRelationInput = {
    id?: SortOrder
    rabbitId?: SortOrder
    url?: SortOrder
    publicId?: SortOrderInput | SortOrder
    position?: SortOrder
    isMain?: SortOrder
    rabbit?: RabbitOrderByWithRelationInput
  }

  export type RabbitPhotoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RabbitPhotoWhereInput | RabbitPhotoWhereInput[]
    OR?: RabbitPhotoWhereInput[]
    NOT?: RabbitPhotoWhereInput | RabbitPhotoWhereInput[]
    rabbitId?: StringFilter<"RabbitPhoto"> | string
    url?: StringFilter<"RabbitPhoto"> | string
    publicId?: StringNullableFilter<"RabbitPhoto"> | string | null
    position?: IntFilter<"RabbitPhoto"> | number
    isMain?: BoolFilter<"RabbitPhoto"> | boolean
    rabbit?: XOR<RabbitRelationFilter, RabbitWhereInput>
  }, "id">

  export type RabbitPhotoOrderByWithAggregationInput = {
    id?: SortOrder
    rabbitId?: SortOrder
    url?: SortOrder
    publicId?: SortOrderInput | SortOrder
    position?: SortOrder
    isMain?: SortOrder
    _count?: RabbitPhotoCountOrderByAggregateInput
    _avg?: RabbitPhotoAvgOrderByAggregateInput
    _max?: RabbitPhotoMaxOrderByAggregateInput
    _min?: RabbitPhotoMinOrderByAggregateInput
    _sum?: RabbitPhotoSumOrderByAggregateInput
  }

  export type RabbitPhotoScalarWhereWithAggregatesInput = {
    AND?: RabbitPhotoScalarWhereWithAggregatesInput | RabbitPhotoScalarWhereWithAggregatesInput[]
    OR?: RabbitPhotoScalarWhereWithAggregatesInput[]
    NOT?: RabbitPhotoScalarWhereWithAggregatesInput | RabbitPhotoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RabbitPhoto"> | number
    rabbitId?: StringWithAggregatesFilter<"RabbitPhoto"> | string
    url?: StringWithAggregatesFilter<"RabbitPhoto"> | string
    publicId?: StringNullableWithAggregatesFilter<"RabbitPhoto"> | string | null
    position?: IntWithAggregatesFilter<"RabbitPhoto"> | number
    isMain?: BoolWithAggregatesFilter<"RabbitPhoto"> | boolean
  }

  export type ReservationWhereInput = {
    AND?: ReservationWhereInput | ReservationWhereInput[]
    OR?: ReservationWhereInput[]
    NOT?: ReservationWhereInput | ReservationWhereInput[]
    id?: StringFilter<"Reservation"> | string
    rabbitId?: StringFilter<"Reservation"> | string
    quantity?: IntFilter<"Reservation"> | number
    firstName?: StringFilter<"Reservation"> | string
    lastName?: StringFilter<"Reservation"> | string
    email?: StringFilter<"Reservation"> | string
    phone?: StringFilter<"Reservation"> | string
    message?: StringNullableFilter<"Reservation"> | string | null
    status?: StringFilter<"Reservation"> | string
    latitude?: FloatNullableFilter<"Reservation"> | number | null
    longitude?: FloatNullableFilter<"Reservation"> | number | null
    deliveryZone?: StringNullableFilter<"Reservation"> | string | null
    deliveryFee?: FloatNullableFilter<"Reservation"> | number | null
    confirmedAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    note?: StringNullableFilter<"Reservation"> | string | null
    createdAt?: DateTimeFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeFilter<"Reservation"> | Date | string
    rabbit?: XOR<RabbitRelationFilter, RabbitWhereInput>
  }

  export type ReservationOrderByWithRelationInput = {
    id?: SortOrder
    rabbitId?: SortOrder
    quantity?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    message?: SortOrderInput | SortOrder
    status?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    deliveryZone?: SortOrderInput | SortOrder
    deliveryFee?: SortOrderInput | SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rabbit?: RabbitOrderByWithRelationInput
  }

  export type ReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReservationWhereInput | ReservationWhereInput[]
    OR?: ReservationWhereInput[]
    NOT?: ReservationWhereInput | ReservationWhereInput[]
    rabbitId?: StringFilter<"Reservation"> | string
    quantity?: IntFilter<"Reservation"> | number
    firstName?: StringFilter<"Reservation"> | string
    lastName?: StringFilter<"Reservation"> | string
    email?: StringFilter<"Reservation"> | string
    phone?: StringFilter<"Reservation"> | string
    message?: StringNullableFilter<"Reservation"> | string | null
    status?: StringFilter<"Reservation"> | string
    latitude?: FloatNullableFilter<"Reservation"> | number | null
    longitude?: FloatNullableFilter<"Reservation"> | number | null
    deliveryZone?: StringNullableFilter<"Reservation"> | string | null
    deliveryFee?: FloatNullableFilter<"Reservation"> | number | null
    confirmedAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    note?: StringNullableFilter<"Reservation"> | string | null
    createdAt?: DateTimeFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeFilter<"Reservation"> | Date | string
    rabbit?: XOR<RabbitRelationFilter, RabbitWhereInput>
  }, "id">

  export type ReservationOrderByWithAggregationInput = {
    id?: SortOrder
    rabbitId?: SortOrder
    quantity?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    message?: SortOrderInput | SortOrder
    status?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    deliveryZone?: SortOrderInput | SortOrder
    deliveryFee?: SortOrderInput | SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReservationCountOrderByAggregateInput
    _avg?: ReservationAvgOrderByAggregateInput
    _max?: ReservationMaxOrderByAggregateInput
    _min?: ReservationMinOrderByAggregateInput
    _sum?: ReservationSumOrderByAggregateInput
  }

  export type ReservationScalarWhereWithAggregatesInput = {
    AND?: ReservationScalarWhereWithAggregatesInput | ReservationScalarWhereWithAggregatesInput[]
    OR?: ReservationScalarWhereWithAggregatesInput[]
    NOT?: ReservationScalarWhereWithAggregatesInput | ReservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reservation"> | string
    rabbitId?: StringWithAggregatesFilter<"Reservation"> | string
    quantity?: IntWithAggregatesFilter<"Reservation"> | number
    firstName?: StringWithAggregatesFilter<"Reservation"> | string
    lastName?: StringWithAggregatesFilter<"Reservation"> | string
    email?: StringWithAggregatesFilter<"Reservation"> | string
    phone?: StringWithAggregatesFilter<"Reservation"> | string
    message?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    status?: StringWithAggregatesFilter<"Reservation"> | string
    latitude?: FloatNullableWithAggregatesFilter<"Reservation"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"Reservation"> | number | null
    deliveryZone?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    deliveryFee?: FloatNullableWithAggregatesFilter<"Reservation"> | number | null
    confirmedAt?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    note?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
  }

  export type VisitStatsWhereInput = {
    AND?: VisitStatsWhereInput | VisitStatsWhereInput[]
    OR?: VisitStatsWhereInput[]
    NOT?: VisitStatsWhereInput | VisitStatsWhereInput[]
    id?: StringFilter<"VisitStats"> | string
    accepted?: IntFilter<"VisitStats"> | number
    declined?: IntFilter<"VisitStats"> | number
    total?: IntFilter<"VisitStats"> | number
  }

  export type VisitStatsOrderByWithRelationInput = {
    id?: SortOrder
    accepted?: SortOrder
    declined?: SortOrder
    total?: SortOrder
  }

  export type VisitStatsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VisitStatsWhereInput | VisitStatsWhereInput[]
    OR?: VisitStatsWhereInput[]
    NOT?: VisitStatsWhereInput | VisitStatsWhereInput[]
    accepted?: IntFilter<"VisitStats"> | number
    declined?: IntFilter<"VisitStats"> | number
    total?: IntFilter<"VisitStats"> | number
  }, "id">

  export type VisitStatsOrderByWithAggregationInput = {
    id?: SortOrder
    accepted?: SortOrder
    declined?: SortOrder
    total?: SortOrder
    _count?: VisitStatsCountOrderByAggregateInput
    _avg?: VisitStatsAvgOrderByAggregateInput
    _max?: VisitStatsMaxOrderByAggregateInput
    _min?: VisitStatsMinOrderByAggregateInput
    _sum?: VisitStatsSumOrderByAggregateInput
  }

  export type VisitStatsScalarWhereWithAggregatesInput = {
    AND?: VisitStatsScalarWhereWithAggregatesInput | VisitStatsScalarWhereWithAggregatesInput[]
    OR?: VisitStatsScalarWhereWithAggregatesInput[]
    NOT?: VisitStatsScalarWhereWithAggregatesInput | VisitStatsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VisitStats"> | string
    accepted?: IntWithAggregatesFilter<"VisitStats"> | number
    declined?: IntWithAggregatesFilter<"VisitStats"> | number
    total?: IntWithAggregatesFilter<"VisitStats"> | number
  }

  export type RabbitCreateInput = {
    id?: string
    slug: string
    name: string
    breed: string
    color: string
    gender: string
    birthDate?: Date | string | null
    weight?: number | null
    description?: string | null
    price: number
    priceNote?: string | null
    stock?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: RabbitPhotoCreateNestedManyWithoutRabbitInput
    reservations?: ReservationCreateNestedManyWithoutRabbitInput
  }

  export type RabbitUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    breed: string
    color: string
    gender: string
    birthDate?: Date | string | null
    weight?: number | null
    description?: string | null
    price: number
    priceNote?: string | null
    stock?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: RabbitPhotoUncheckedCreateNestedManyWithoutRabbitInput
    reservations?: ReservationUncheckedCreateNestedManyWithoutRabbitInput
  }

  export type RabbitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    breed?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    priceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: RabbitPhotoUpdateManyWithoutRabbitNestedInput
    reservations?: ReservationUpdateManyWithoutRabbitNestedInput
  }

  export type RabbitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    breed?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    priceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: RabbitPhotoUncheckedUpdateManyWithoutRabbitNestedInput
    reservations?: ReservationUncheckedUpdateManyWithoutRabbitNestedInput
  }

  export type RabbitCreateManyInput = {
    id?: string
    slug: string
    name: string
    breed: string
    color: string
    gender: string
    birthDate?: Date | string | null
    weight?: number | null
    description?: string | null
    price: number
    priceNote?: string | null
    stock?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RabbitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    breed?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    priceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RabbitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    breed?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    priceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RabbitPhotoCreateInput = {
    url: string
    publicId?: string | null
    position?: number
    isMain?: boolean
    rabbit: RabbitCreateNestedOneWithoutPhotosInput
  }

  export type RabbitPhotoUncheckedCreateInput = {
    id?: number
    rabbitId: string
    url: string
    publicId?: string | null
    position?: number
    isMain?: boolean
  }

  export type RabbitPhotoUpdateInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    isMain?: BoolFieldUpdateOperationsInput | boolean
    rabbit?: RabbitUpdateOneRequiredWithoutPhotosNestedInput
  }

  export type RabbitPhotoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    rabbitId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    isMain?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RabbitPhotoCreateManyInput = {
    id?: number
    rabbitId: string
    url: string
    publicId?: string | null
    position?: number
    isMain?: boolean
  }

  export type RabbitPhotoUpdateManyMutationInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    isMain?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RabbitPhotoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    rabbitId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    isMain?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ReservationCreateInput = {
    id?: string
    quantity?: number
    firstName: string
    lastName: string
    email: string
    phone: string
    message?: string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deliveryZone?: string | null
    deliveryFee?: number | null
    confirmedAt?: Date | string | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rabbit: RabbitCreateNestedOneWithoutReservationsInput
  }

  export type ReservationUncheckedCreateInput = {
    id?: string
    rabbitId: string
    quantity?: number
    firstName: string
    lastName: string
    email: string
    phone: string
    message?: string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deliveryZone?: string | null
    deliveryFee?: number | null
    confirmedAt?: Date | string | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deliveryZone?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryFee?: NullableFloatFieldUpdateOperationsInput | number | null
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rabbit?: RabbitUpdateOneRequiredWithoutReservationsNestedInput
  }

  export type ReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rabbitId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deliveryZone?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryFee?: NullableFloatFieldUpdateOperationsInput | number | null
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationCreateManyInput = {
    id?: string
    rabbitId: string
    quantity?: number
    firstName: string
    lastName: string
    email: string
    phone: string
    message?: string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deliveryZone?: string | null
    deliveryFee?: number | null
    confirmedAt?: Date | string | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deliveryZone?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryFee?: NullableFloatFieldUpdateOperationsInput | number | null
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    rabbitId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deliveryZone?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryFee?: NullableFloatFieldUpdateOperationsInput | number | null
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitStatsCreateInput = {
    id?: string
    accepted?: number
    declined?: number
    total?: number
  }

  export type VisitStatsUncheckedCreateInput = {
    id?: string
    accepted?: number
    declined?: number
    total?: number
  }

  export type VisitStatsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accepted?: IntFieldUpdateOperationsInput | number
    declined?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
  }

  export type VisitStatsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accepted?: IntFieldUpdateOperationsInput | number
    declined?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
  }

  export type VisitStatsCreateManyInput = {
    id?: string
    accepted?: number
    declined?: number
    total?: number
  }

  export type VisitStatsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accepted?: IntFieldUpdateOperationsInput | number
    declined?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
  }

  export type VisitStatsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accepted?: IntFieldUpdateOperationsInput | number
    declined?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RabbitPhotoListRelationFilter = {
    every?: RabbitPhotoWhereInput
    some?: RabbitPhotoWhereInput
    none?: RabbitPhotoWhereInput
  }

  export type ReservationListRelationFilter = {
    every?: ReservationWhereInput
    some?: ReservationWhereInput
    none?: ReservationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RabbitPhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReservationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RabbitCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    breed?: SortOrder
    color?: SortOrder
    gender?: SortOrder
    birthDate?: SortOrder
    weight?: SortOrder
    description?: SortOrder
    price?: SortOrder
    priceNote?: SortOrder
    stock?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RabbitAvgOrderByAggregateInput = {
    weight?: SortOrder
    price?: SortOrder
    stock?: SortOrder
  }

  export type RabbitMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    breed?: SortOrder
    color?: SortOrder
    gender?: SortOrder
    birthDate?: SortOrder
    weight?: SortOrder
    description?: SortOrder
    price?: SortOrder
    priceNote?: SortOrder
    stock?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RabbitMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    breed?: SortOrder
    color?: SortOrder
    gender?: SortOrder
    birthDate?: SortOrder
    weight?: SortOrder
    description?: SortOrder
    price?: SortOrder
    priceNote?: SortOrder
    stock?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RabbitSumOrderByAggregateInput = {
    weight?: SortOrder
    price?: SortOrder
    stock?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type RabbitRelationFilter = {
    is?: RabbitWhereInput
    isNot?: RabbitWhereInput
  }

  export type RabbitPhotoCountOrderByAggregateInput = {
    id?: SortOrder
    rabbitId?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    position?: SortOrder
    isMain?: SortOrder
  }

  export type RabbitPhotoAvgOrderByAggregateInput = {
    id?: SortOrder
    position?: SortOrder
  }

  export type RabbitPhotoMaxOrderByAggregateInput = {
    id?: SortOrder
    rabbitId?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    position?: SortOrder
    isMain?: SortOrder
  }

  export type RabbitPhotoMinOrderByAggregateInput = {
    id?: SortOrder
    rabbitId?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    position?: SortOrder
    isMain?: SortOrder
  }

  export type RabbitPhotoSumOrderByAggregateInput = {
    id?: SortOrder
    position?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ReservationCountOrderByAggregateInput = {
    id?: SortOrder
    rabbitId?: SortOrder
    quantity?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    message?: SortOrder
    status?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    deliveryZone?: SortOrder
    deliveryFee?: SortOrder
    confirmedAt?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReservationAvgOrderByAggregateInput = {
    quantity?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    deliveryFee?: SortOrder
  }

  export type ReservationMaxOrderByAggregateInput = {
    id?: SortOrder
    rabbitId?: SortOrder
    quantity?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    message?: SortOrder
    status?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    deliveryZone?: SortOrder
    deliveryFee?: SortOrder
    confirmedAt?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReservationMinOrderByAggregateInput = {
    id?: SortOrder
    rabbitId?: SortOrder
    quantity?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    message?: SortOrder
    status?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    deliveryZone?: SortOrder
    deliveryFee?: SortOrder
    confirmedAt?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReservationSumOrderByAggregateInput = {
    quantity?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    deliveryFee?: SortOrder
  }

  export type VisitStatsCountOrderByAggregateInput = {
    id?: SortOrder
    accepted?: SortOrder
    declined?: SortOrder
    total?: SortOrder
  }

  export type VisitStatsAvgOrderByAggregateInput = {
    accepted?: SortOrder
    declined?: SortOrder
    total?: SortOrder
  }

  export type VisitStatsMaxOrderByAggregateInput = {
    id?: SortOrder
    accepted?: SortOrder
    declined?: SortOrder
    total?: SortOrder
  }

  export type VisitStatsMinOrderByAggregateInput = {
    id?: SortOrder
    accepted?: SortOrder
    declined?: SortOrder
    total?: SortOrder
  }

  export type VisitStatsSumOrderByAggregateInput = {
    accepted?: SortOrder
    declined?: SortOrder
    total?: SortOrder
  }

  export type RabbitPhotoCreateNestedManyWithoutRabbitInput = {
    create?: XOR<RabbitPhotoCreateWithoutRabbitInput, RabbitPhotoUncheckedCreateWithoutRabbitInput> | RabbitPhotoCreateWithoutRabbitInput[] | RabbitPhotoUncheckedCreateWithoutRabbitInput[]
    connectOrCreate?: RabbitPhotoCreateOrConnectWithoutRabbitInput | RabbitPhotoCreateOrConnectWithoutRabbitInput[]
    createMany?: RabbitPhotoCreateManyRabbitInputEnvelope
    connect?: RabbitPhotoWhereUniqueInput | RabbitPhotoWhereUniqueInput[]
  }

  export type ReservationCreateNestedManyWithoutRabbitInput = {
    create?: XOR<ReservationCreateWithoutRabbitInput, ReservationUncheckedCreateWithoutRabbitInput> | ReservationCreateWithoutRabbitInput[] | ReservationUncheckedCreateWithoutRabbitInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutRabbitInput | ReservationCreateOrConnectWithoutRabbitInput[]
    createMany?: ReservationCreateManyRabbitInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type RabbitPhotoUncheckedCreateNestedManyWithoutRabbitInput = {
    create?: XOR<RabbitPhotoCreateWithoutRabbitInput, RabbitPhotoUncheckedCreateWithoutRabbitInput> | RabbitPhotoCreateWithoutRabbitInput[] | RabbitPhotoUncheckedCreateWithoutRabbitInput[]
    connectOrCreate?: RabbitPhotoCreateOrConnectWithoutRabbitInput | RabbitPhotoCreateOrConnectWithoutRabbitInput[]
    createMany?: RabbitPhotoCreateManyRabbitInputEnvelope
    connect?: RabbitPhotoWhereUniqueInput | RabbitPhotoWhereUniqueInput[]
  }

  export type ReservationUncheckedCreateNestedManyWithoutRabbitInput = {
    create?: XOR<ReservationCreateWithoutRabbitInput, ReservationUncheckedCreateWithoutRabbitInput> | ReservationCreateWithoutRabbitInput[] | ReservationUncheckedCreateWithoutRabbitInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutRabbitInput | ReservationCreateOrConnectWithoutRabbitInput[]
    createMany?: ReservationCreateManyRabbitInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RabbitPhotoUpdateManyWithoutRabbitNestedInput = {
    create?: XOR<RabbitPhotoCreateWithoutRabbitInput, RabbitPhotoUncheckedCreateWithoutRabbitInput> | RabbitPhotoCreateWithoutRabbitInput[] | RabbitPhotoUncheckedCreateWithoutRabbitInput[]
    connectOrCreate?: RabbitPhotoCreateOrConnectWithoutRabbitInput | RabbitPhotoCreateOrConnectWithoutRabbitInput[]
    upsert?: RabbitPhotoUpsertWithWhereUniqueWithoutRabbitInput | RabbitPhotoUpsertWithWhereUniqueWithoutRabbitInput[]
    createMany?: RabbitPhotoCreateManyRabbitInputEnvelope
    set?: RabbitPhotoWhereUniqueInput | RabbitPhotoWhereUniqueInput[]
    disconnect?: RabbitPhotoWhereUniqueInput | RabbitPhotoWhereUniqueInput[]
    delete?: RabbitPhotoWhereUniqueInput | RabbitPhotoWhereUniqueInput[]
    connect?: RabbitPhotoWhereUniqueInput | RabbitPhotoWhereUniqueInput[]
    update?: RabbitPhotoUpdateWithWhereUniqueWithoutRabbitInput | RabbitPhotoUpdateWithWhereUniqueWithoutRabbitInput[]
    updateMany?: RabbitPhotoUpdateManyWithWhereWithoutRabbitInput | RabbitPhotoUpdateManyWithWhereWithoutRabbitInput[]
    deleteMany?: RabbitPhotoScalarWhereInput | RabbitPhotoScalarWhereInput[]
  }

  export type ReservationUpdateManyWithoutRabbitNestedInput = {
    create?: XOR<ReservationCreateWithoutRabbitInput, ReservationUncheckedCreateWithoutRabbitInput> | ReservationCreateWithoutRabbitInput[] | ReservationUncheckedCreateWithoutRabbitInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutRabbitInput | ReservationCreateOrConnectWithoutRabbitInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutRabbitInput | ReservationUpsertWithWhereUniqueWithoutRabbitInput[]
    createMany?: ReservationCreateManyRabbitInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutRabbitInput | ReservationUpdateWithWhereUniqueWithoutRabbitInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutRabbitInput | ReservationUpdateManyWithWhereWithoutRabbitInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type RabbitPhotoUncheckedUpdateManyWithoutRabbitNestedInput = {
    create?: XOR<RabbitPhotoCreateWithoutRabbitInput, RabbitPhotoUncheckedCreateWithoutRabbitInput> | RabbitPhotoCreateWithoutRabbitInput[] | RabbitPhotoUncheckedCreateWithoutRabbitInput[]
    connectOrCreate?: RabbitPhotoCreateOrConnectWithoutRabbitInput | RabbitPhotoCreateOrConnectWithoutRabbitInput[]
    upsert?: RabbitPhotoUpsertWithWhereUniqueWithoutRabbitInput | RabbitPhotoUpsertWithWhereUniqueWithoutRabbitInput[]
    createMany?: RabbitPhotoCreateManyRabbitInputEnvelope
    set?: RabbitPhotoWhereUniqueInput | RabbitPhotoWhereUniqueInput[]
    disconnect?: RabbitPhotoWhereUniqueInput | RabbitPhotoWhereUniqueInput[]
    delete?: RabbitPhotoWhereUniqueInput | RabbitPhotoWhereUniqueInput[]
    connect?: RabbitPhotoWhereUniqueInput | RabbitPhotoWhereUniqueInput[]
    update?: RabbitPhotoUpdateWithWhereUniqueWithoutRabbitInput | RabbitPhotoUpdateWithWhereUniqueWithoutRabbitInput[]
    updateMany?: RabbitPhotoUpdateManyWithWhereWithoutRabbitInput | RabbitPhotoUpdateManyWithWhereWithoutRabbitInput[]
    deleteMany?: RabbitPhotoScalarWhereInput | RabbitPhotoScalarWhereInput[]
  }

  export type ReservationUncheckedUpdateManyWithoutRabbitNestedInput = {
    create?: XOR<ReservationCreateWithoutRabbitInput, ReservationUncheckedCreateWithoutRabbitInput> | ReservationCreateWithoutRabbitInput[] | ReservationUncheckedCreateWithoutRabbitInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutRabbitInput | ReservationCreateOrConnectWithoutRabbitInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutRabbitInput | ReservationUpsertWithWhereUniqueWithoutRabbitInput[]
    createMany?: ReservationCreateManyRabbitInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutRabbitInput | ReservationUpdateWithWhereUniqueWithoutRabbitInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutRabbitInput | ReservationUpdateManyWithWhereWithoutRabbitInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type RabbitCreateNestedOneWithoutPhotosInput = {
    create?: XOR<RabbitCreateWithoutPhotosInput, RabbitUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: RabbitCreateOrConnectWithoutPhotosInput
    connect?: RabbitWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type RabbitUpdateOneRequiredWithoutPhotosNestedInput = {
    create?: XOR<RabbitCreateWithoutPhotosInput, RabbitUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: RabbitCreateOrConnectWithoutPhotosInput
    upsert?: RabbitUpsertWithoutPhotosInput
    connect?: RabbitWhereUniqueInput
    update?: XOR<XOR<RabbitUpdateToOneWithWhereWithoutPhotosInput, RabbitUpdateWithoutPhotosInput>, RabbitUncheckedUpdateWithoutPhotosInput>
  }

  export type RabbitCreateNestedOneWithoutReservationsInput = {
    create?: XOR<RabbitCreateWithoutReservationsInput, RabbitUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: RabbitCreateOrConnectWithoutReservationsInput
    connect?: RabbitWhereUniqueInput
  }

  export type RabbitUpdateOneRequiredWithoutReservationsNestedInput = {
    create?: XOR<RabbitCreateWithoutReservationsInput, RabbitUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: RabbitCreateOrConnectWithoutReservationsInput
    upsert?: RabbitUpsertWithoutReservationsInput
    connect?: RabbitWhereUniqueInput
    update?: XOR<XOR<RabbitUpdateToOneWithWhereWithoutReservationsInput, RabbitUpdateWithoutReservationsInput>, RabbitUncheckedUpdateWithoutReservationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type RabbitPhotoCreateWithoutRabbitInput = {
    url: string
    publicId?: string | null
    position?: number
    isMain?: boolean
  }

  export type RabbitPhotoUncheckedCreateWithoutRabbitInput = {
    id?: number
    url: string
    publicId?: string | null
    position?: number
    isMain?: boolean
  }

  export type RabbitPhotoCreateOrConnectWithoutRabbitInput = {
    where: RabbitPhotoWhereUniqueInput
    create: XOR<RabbitPhotoCreateWithoutRabbitInput, RabbitPhotoUncheckedCreateWithoutRabbitInput>
  }

  export type RabbitPhotoCreateManyRabbitInputEnvelope = {
    data: RabbitPhotoCreateManyRabbitInput | RabbitPhotoCreateManyRabbitInput[]
    skipDuplicates?: boolean
  }

  export type ReservationCreateWithoutRabbitInput = {
    id?: string
    quantity?: number
    firstName: string
    lastName: string
    email: string
    phone: string
    message?: string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deliveryZone?: string | null
    deliveryFee?: number | null
    confirmedAt?: Date | string | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservationUncheckedCreateWithoutRabbitInput = {
    id?: string
    quantity?: number
    firstName: string
    lastName: string
    email: string
    phone: string
    message?: string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deliveryZone?: string | null
    deliveryFee?: number | null
    confirmedAt?: Date | string | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservationCreateOrConnectWithoutRabbitInput = {
    where: ReservationWhereUniqueInput
    create: XOR<ReservationCreateWithoutRabbitInput, ReservationUncheckedCreateWithoutRabbitInput>
  }

  export type ReservationCreateManyRabbitInputEnvelope = {
    data: ReservationCreateManyRabbitInput | ReservationCreateManyRabbitInput[]
    skipDuplicates?: boolean
  }

  export type RabbitPhotoUpsertWithWhereUniqueWithoutRabbitInput = {
    where: RabbitPhotoWhereUniqueInput
    update: XOR<RabbitPhotoUpdateWithoutRabbitInput, RabbitPhotoUncheckedUpdateWithoutRabbitInput>
    create: XOR<RabbitPhotoCreateWithoutRabbitInput, RabbitPhotoUncheckedCreateWithoutRabbitInput>
  }

  export type RabbitPhotoUpdateWithWhereUniqueWithoutRabbitInput = {
    where: RabbitPhotoWhereUniqueInput
    data: XOR<RabbitPhotoUpdateWithoutRabbitInput, RabbitPhotoUncheckedUpdateWithoutRabbitInput>
  }

  export type RabbitPhotoUpdateManyWithWhereWithoutRabbitInput = {
    where: RabbitPhotoScalarWhereInput
    data: XOR<RabbitPhotoUpdateManyMutationInput, RabbitPhotoUncheckedUpdateManyWithoutRabbitInput>
  }

  export type RabbitPhotoScalarWhereInput = {
    AND?: RabbitPhotoScalarWhereInput | RabbitPhotoScalarWhereInput[]
    OR?: RabbitPhotoScalarWhereInput[]
    NOT?: RabbitPhotoScalarWhereInput | RabbitPhotoScalarWhereInput[]
    id?: IntFilter<"RabbitPhoto"> | number
    rabbitId?: StringFilter<"RabbitPhoto"> | string
    url?: StringFilter<"RabbitPhoto"> | string
    publicId?: StringNullableFilter<"RabbitPhoto"> | string | null
    position?: IntFilter<"RabbitPhoto"> | number
    isMain?: BoolFilter<"RabbitPhoto"> | boolean
  }

  export type ReservationUpsertWithWhereUniqueWithoutRabbitInput = {
    where: ReservationWhereUniqueInput
    update: XOR<ReservationUpdateWithoutRabbitInput, ReservationUncheckedUpdateWithoutRabbitInput>
    create: XOR<ReservationCreateWithoutRabbitInput, ReservationUncheckedCreateWithoutRabbitInput>
  }

  export type ReservationUpdateWithWhereUniqueWithoutRabbitInput = {
    where: ReservationWhereUniqueInput
    data: XOR<ReservationUpdateWithoutRabbitInput, ReservationUncheckedUpdateWithoutRabbitInput>
  }

  export type ReservationUpdateManyWithWhereWithoutRabbitInput = {
    where: ReservationScalarWhereInput
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyWithoutRabbitInput>
  }

  export type ReservationScalarWhereInput = {
    AND?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
    OR?: ReservationScalarWhereInput[]
    NOT?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
    id?: StringFilter<"Reservation"> | string
    rabbitId?: StringFilter<"Reservation"> | string
    quantity?: IntFilter<"Reservation"> | number
    firstName?: StringFilter<"Reservation"> | string
    lastName?: StringFilter<"Reservation"> | string
    email?: StringFilter<"Reservation"> | string
    phone?: StringFilter<"Reservation"> | string
    message?: StringNullableFilter<"Reservation"> | string | null
    status?: StringFilter<"Reservation"> | string
    latitude?: FloatNullableFilter<"Reservation"> | number | null
    longitude?: FloatNullableFilter<"Reservation"> | number | null
    deliveryZone?: StringNullableFilter<"Reservation"> | string | null
    deliveryFee?: FloatNullableFilter<"Reservation"> | number | null
    confirmedAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    note?: StringNullableFilter<"Reservation"> | string | null
    createdAt?: DateTimeFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeFilter<"Reservation"> | Date | string
  }

  export type RabbitCreateWithoutPhotosInput = {
    id?: string
    slug: string
    name: string
    breed: string
    color: string
    gender: string
    birthDate?: Date | string | null
    weight?: number | null
    description?: string | null
    price: number
    priceNote?: string | null
    stock?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    reservations?: ReservationCreateNestedManyWithoutRabbitInput
  }

  export type RabbitUncheckedCreateWithoutPhotosInput = {
    id?: string
    slug: string
    name: string
    breed: string
    color: string
    gender: string
    birthDate?: Date | string | null
    weight?: number | null
    description?: string | null
    price: number
    priceNote?: string | null
    stock?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    reservations?: ReservationUncheckedCreateNestedManyWithoutRabbitInput
  }

  export type RabbitCreateOrConnectWithoutPhotosInput = {
    where: RabbitWhereUniqueInput
    create: XOR<RabbitCreateWithoutPhotosInput, RabbitUncheckedCreateWithoutPhotosInput>
  }

  export type RabbitUpsertWithoutPhotosInput = {
    update: XOR<RabbitUpdateWithoutPhotosInput, RabbitUncheckedUpdateWithoutPhotosInput>
    create: XOR<RabbitCreateWithoutPhotosInput, RabbitUncheckedCreateWithoutPhotosInput>
    where?: RabbitWhereInput
  }

  export type RabbitUpdateToOneWithWhereWithoutPhotosInput = {
    where?: RabbitWhereInput
    data: XOR<RabbitUpdateWithoutPhotosInput, RabbitUncheckedUpdateWithoutPhotosInput>
  }

  export type RabbitUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    breed?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    priceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUpdateManyWithoutRabbitNestedInput
  }

  export type RabbitUncheckedUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    breed?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    priceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUncheckedUpdateManyWithoutRabbitNestedInput
  }

  export type RabbitCreateWithoutReservationsInput = {
    id?: string
    slug: string
    name: string
    breed: string
    color: string
    gender: string
    birthDate?: Date | string | null
    weight?: number | null
    description?: string | null
    price: number
    priceNote?: string | null
    stock?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: RabbitPhotoCreateNestedManyWithoutRabbitInput
  }

  export type RabbitUncheckedCreateWithoutReservationsInput = {
    id?: string
    slug: string
    name: string
    breed: string
    color: string
    gender: string
    birthDate?: Date | string | null
    weight?: number | null
    description?: string | null
    price: number
    priceNote?: string | null
    stock?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: RabbitPhotoUncheckedCreateNestedManyWithoutRabbitInput
  }

  export type RabbitCreateOrConnectWithoutReservationsInput = {
    where: RabbitWhereUniqueInput
    create: XOR<RabbitCreateWithoutReservationsInput, RabbitUncheckedCreateWithoutReservationsInput>
  }

  export type RabbitUpsertWithoutReservationsInput = {
    update: XOR<RabbitUpdateWithoutReservationsInput, RabbitUncheckedUpdateWithoutReservationsInput>
    create: XOR<RabbitCreateWithoutReservationsInput, RabbitUncheckedCreateWithoutReservationsInput>
    where?: RabbitWhereInput
  }

  export type RabbitUpdateToOneWithWhereWithoutReservationsInput = {
    where?: RabbitWhereInput
    data: XOR<RabbitUpdateWithoutReservationsInput, RabbitUncheckedUpdateWithoutReservationsInput>
  }

  export type RabbitUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    breed?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    priceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: RabbitPhotoUpdateManyWithoutRabbitNestedInput
  }

  export type RabbitUncheckedUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    breed?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    priceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: RabbitPhotoUncheckedUpdateManyWithoutRabbitNestedInput
  }

  export type RabbitPhotoCreateManyRabbitInput = {
    id?: number
    url: string
    publicId?: string | null
    position?: number
    isMain?: boolean
  }

  export type ReservationCreateManyRabbitInput = {
    id?: string
    quantity?: number
    firstName: string
    lastName: string
    email: string
    phone: string
    message?: string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deliveryZone?: string | null
    deliveryFee?: number | null
    confirmedAt?: Date | string | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RabbitPhotoUpdateWithoutRabbitInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    isMain?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RabbitPhotoUncheckedUpdateWithoutRabbitInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    isMain?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RabbitPhotoUncheckedUpdateManyWithoutRabbitInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    isMain?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ReservationUpdateWithoutRabbitInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deliveryZone?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryFee?: NullableFloatFieldUpdateOperationsInput | number | null
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationUncheckedUpdateWithoutRabbitInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deliveryZone?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryFee?: NullableFloatFieldUpdateOperationsInput | number | null
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationUncheckedUpdateManyWithoutRabbitInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deliveryZone?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryFee?: NullableFloatFieldUpdateOperationsInput | number | null
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use RabbitCountOutputTypeDefaultArgs instead
     */
    export type RabbitCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RabbitCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RabbitDefaultArgs instead
     */
    export type RabbitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RabbitDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RabbitPhotoDefaultArgs instead
     */
    export type RabbitPhotoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RabbitPhotoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReservationDefaultArgs instead
     */
    export type ReservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReservationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VisitStatsDefaultArgs instead
     */
    export type VisitStatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VisitStatsDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}