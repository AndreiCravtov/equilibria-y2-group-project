import { format as utilFormat } from "util";
import * as v from "valibot";

// type definitions
export type ResultData<T> = { success: true; data: T };
export type ResultError<E> = { success: false; error: E };
export type Result<T, E> = ResultData<T> | ResultError<E>;
export type ResultAsync<T, E> = Promise<Result<T, E>>;

// type utility

/**
 * Utility type for extracting the type of the data-variant in a {@link Result} type
 *
 * @param R the {@link Result} type, from which to extract the type of its data-variant
 */
export type InferResultData<R> = R extends ResultData<infer T> ? T : never;
/**
 * Utility type for extracting the type of the error-variant in a {@link Result} type
 *
 * @param R the {@link Result} type from, which to extract the type of its error-variant
 */
export type InferResultError<R> = R extends ResultError<infer E> ? E : never;
/**
 * Utility type for extracting the type of the data-variant in a {@link Promise} of a {@link Result} type
 *
 * @param P the {@link Promise} of a {@link Result} type, from which to extract the type of its data-variant
 */
export type InferResultDataAsync<P> =
  P extends Promise<infer R> ? InferResultData<R> : never;
/**
 * Utility type for extracting the type of the error-variant in a {@link Promise} of a {@link Result} type
 *
 * @param P the {@link Promise} of a {@link Result} type, from which to extract the type of its error-variant
 */
export type InferResultErrorAsync<P> =
  P extends Promise<infer R> ? InferResultError<R> : never;

/**
 * Utility type for changing the type of the data-variant in a {@link Result} type,
 * keeping the type of the error-variant
 *
 * @param R the {@link Result} type, who's data-variant will be changed
 * @param U the type of the new data-variant
 */
export type MapResultData<R, U> =
  R extends ResultError<infer E>
    ? Result<U, E>
    : R extends ResultData<unknown>
      ? ResultData<U>
      : never;
/**
 * Utility type for changing the type of the error-variant in a {@link Result} type,
 * keeping the type of the data-variant
 *
 * @param R the {@link Result} type, who's error-variant will be changed
 * @param F the type of the new error-variant
 */
export type MapResultError<R, F> =
  R extends ResultData<infer T>
    ? Result<T, F>
    : R extends ResultError<unknown>
      ? ResultError<F>
      : never;
/**
 * Utility type for changing the type of the data-variant in a {@link Promise} of a {@link Result} type,
 * keeping the type of the error-variant
 *
 * @param P the {@link Promise} of a {@link Result} type, who's data-variant will be changed
 * @param U the type of the new data-variant
 */
export type MapResultDataAsync<P, U> =
  P extends Promise<Result<infer T, infer E>>
    ? Promise<MapResultData<Result<T, E>, U>>
    : never;
/**
 * Utility type for changing the type of the error-variant in a {@link Promise} of a {@link Result} type,
 * keeping the type of the data-variant
 *
 * @param P the {@link Promise} of a {@link Result} type, who's error-variant will be changed
 * @param F the type of the new error-variant
 */
export type MapResultErrorAsync<P, F> =
  P extends Promise<Result<infer T, infer E>>
    ? Promise<MapResultError<Result<T, E>, F>>
    : never;

/**
 * Validation schema definitions
 */
export const ValibotSchema = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  Data: <DataSchema extends v.GenericSchema>(dataSchema: DataSchema) =>
    v.strictObject({
      success: v.literal(true),
      data: dataSchema,
    }),
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  Error: <ErrorSchema extends v.GenericSchema>(errorSchema: ErrorSchema) =>
    v.strictObject({
      success: v.literal(false),
      error: errorSchema,
    }),
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  Result: <
    DataSchema extends v.GenericSchema,
    ErrorSchema extends v.GenericSchema,
  >(
    dataSchema: DataSchema,
    errorSchema: ErrorSchema
  ) =>
    v.union([ValibotSchema.Data(dataSchema), ValibotSchema.Error(errorSchema)]),

  /**
   * Parses an unknown input based on a schema.
   *
   * @param schema The schema to be used.
   * @param input The input to be parsed.
   * @param config The parse configuration.
   *
   * @returns The parse result.
   */
  parse: <
    const TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
    T,
  >(
    schema: TSchema,
    input: T,
    config?: v.Config<v.InferIssue<TSchema>>
  ): Result<
    v.InferOutput<TSchema>,
    { input: T; issues: [v.InferIssue<TSchema>, ...v.InferIssue<TSchema>[]] }
  > => {
    let r = v.safeParse(schema, input, config);
    return r.success
      ? Result.Data(r.output)
      : Result.Error({ input, issues: r.issues });
  },
};

/**
 * Basic variant-related functions, such as type-constructors, type-guards, match-statement, etc.
 */
export const Result = {
  /**
   * The {@link ResultData} variant type-constructor
   */
  Data: <T, E>(data: T): Result<T, E> =>
    ({ success: true, data }) satisfies ResultData<T>,
  /**
   * The {@link ResultError} variant type-constructor
   */
  Error: <T, E>(error: E): Result<T, E> =>
    ({ success: false, error }) satisfies ResultError<E>,

  /**
   * The {@link ResultData} variant type-guard
   */
  isData: <T, E>(r: Result<T, E>): r is ResultData<T> => r.success,
  /**
   * The {@link ResultError} variant type-guard
   */
  isError: <T, E>(r: Result<T, E>): r is ResultError<E> => !r.success,
  /**
   * A match-statement on the variants, used for case analysis logic
   */
  match: <T, E, R>(
    fnData: (data: T) => R,
    fnError: (error: E) => R,
    r: Result<T, E>
  ): R => (r.success ? fnData(r.data) : fnError(r.error)),

  /**
   * Extract the data from the result, if there is any
   */
  dataOrNull: <T, E>(r: Result<T, E>): T | null =>
    Result.isData(r) ? r.data : null,
  /**
   * Extract the error from the result, if there is one
   */
  errorOrNull: <T, E>(r: Result<T, E>): E | null =>
    Result.isError(r) ? r.error : null,
  /**
   * Extract the data from the result, if there is any, or return supplied fallback value
   */
  dataOrFallback: <T, E>(r: Result<T, E>, fallback: T): T =>
    Result.isData(r) ? r.data : fallback,
  /**
   * Extract the error from the result, if there is one, or return supplied fallback value
   */
  errorOrFallback: <T, E>(r: Result<T, E>, fallback: E): E =>
    Result.isError(r) ? r.error : fallback,

  /**
   * Extract the data from the result, optionally providing an error message if its missing
   *
   * @throws {TypeError} if the result contains an error, rather than data
   */
  unwrapData: <T, E>(
    r: Result<T, E>,
    errorMessage: string = "Expected data, found error"
  ): T => {
    if (Result.isData(r)) return r.data;
    else throw new TypeError(utilFormat(`${errorMessage}:`, r.error));
  },
  /**
   * Extract the error from the result, optionally providing an error message if its missing
   *
   * @throws {TypeError} if the result contains data, rather than an error
   */
  unwrapError: <T, E>(
    r: Result<T, E>,
    errorMessage: string = "Expected error, found data"
  ): E => {
    if (Result.isError(r)) return r.error;
    else throw new TypeError(utilFormat(`${errorMessage}:`, r.data));
  },

  /**
   * Lifts {@link Promise} out of results type parameters
   */
  liftPromise: async <T, E>(
    r: Result<T | Promise<T>, E | Promise<E>>
  ): Promise<Result<T, E>> =>
    Result.isData(r) ? Result.Data(await r.data) : Result.Error(await r.error),
  /**
   * Turns a result with nullish data `T | null | undefined`, into a nullable result with data `T`
   */
  transposeData: <T, E>(
    r: Result<T | null | undefined, E>
  ): Result<T, E> | null =>
    Result.isError(r)
      ? r
      : r.data === null || r.data === undefined
        ? null
        : Result.Data(r.data),
  /**
   * Turns a result with a nullish error `E | null | undefined`, into a nullable result with error `E`
   */
  transposeError: <T, E>(
    r: Result<T, E | null | undefined>
  ): Result<T, E> | null =>
    Result.isData(r)
      ? r
      : r.error === null || r.error === undefined
        ? null
        : Result.Error(r.error),
  /**
   * Extracts from an array of results all of the data
   */
  extractDataArray: <T, E>(rs: Result<T, E>[]): T[] =>
    rs.filter(Result.isData).map((r) => r.data),
  /**
   * Extracts from an array of results all of the errors
   */
  extractErrorArray: <T, E>(rs: Result<T, E>[]): E[] =>
    rs.filter(Result.isError).map((r) => r.error),
  /**
   * Partitions an array of results into arrays, one containing all data, and the other containing all errors
   */
  partitionResultArray: <T, E>(rs: Result<T, E>[]): [T[], E[]] => {
    const ds: T[] = [];
    const es: E[] = [];
    for (const r of rs) r.success ? ds.push(r.data) : es.push(r.error);
    return [ds, es];
  },

  /**
   * Calls a function with a reference to the contained data, if there is any
   */
  inspectData: <T, E>(r: Result<T, E>, fn: (data: T) => void): void =>
    Result.isData(r) ? fn(r.data) : undefined,
  /**
   * Calls a function with a reference to the contained error, if there is one
   */
  inspectError: <T, E>(r: Result<T, E>, fn: (error: E) => void): void =>
    Result.isError(r) ? fn(r.error) : undefined,
  /**
   * Attempts to return the first data-variant (leftmost),
   * and if not found, returns the last error-variant (rightmost)
   */
  firstData: <T, E>(a: Result<T, E>, b: Result<T, E>): Result<T, E> =>
    Result.isData(a) ? a : b,
  /**
   * Attempts to return the first error-variant (leftmost),
   * and if not found, returns the last data-variant (rightmost)
   */
  firstError: <T, E>(a: Result<T, E>, b: Result<T, E>): Result<T, E> =>
    Result.isError(a) ? a : b,

  /**
   * Applies a function to the contained data, if there is any
   */
  mapData: <T, E, U>(fn: (data: T) => U, r: Result<T, E>): Result<U, E> =>
    Result.isError(r) ? r : Result.Data(fn(r.data)),
  /**
   * Applies a function to the contained error, if there is one
   */
  mapError: <T, E, F>(fn: (error: E) => F, r: Result<T, E>): Result<T, F> =>
    Result.isData(r) ? r : Result.Error(fn(r.error)),
  /**
   * Applies a function to the contained data, if there is any, or return supplied fallback value
   */
  mapDataOrFallback: <T, E, U>(
    fn: (data: T) => U,
    r: Result<T, E>,
    fallback: U
  ): U => (Result.isData(r) ? fn(r.data) : fallback),
  /**
   * Applies a function to the contained error, if there is one, or return supplied fallback value
   */
  mapErrorOrFallback: <T, E, F>(
    fn: (error: E) => F,
    r: Result<T, E>,
    fallback: F
  ): F => (Result.isError(r) ? fn(r.error) : fallback),
  /**
   * Replaces the contained data, if there is any, with the provided data
   */
  replaceData: <T, E, U>(newData: U, r: Result<T, E>): Result<U, E> =>
    Result.isError(r) ? r : Result.Data(newData),
  /**
   * Replaces the contained error, if there is one, with the provided data
   */
  replaceError: <T, E, F>(newError: F, r: Result<T, E>): Result<T, F> =>
    Result.isData(r) ? r : Result.Error(newError),
  /**
   * If there is a function in the data-variant to be applied, and data on which
   * to apply the function, then the result of that application is returned
   */
  sequentiallyApplyData: <T, E, U>(
    rFn: Result<(data: T) => U, E>,
    r: Result<T, E>
  ): Result<U, E> => (Result.isError(rFn) ? rFn : Result.mapData(rFn.data, r)),
  /**
   * If there is a function in the error-variant to be applied, and an error on which
   * to apply the function, then the result of that application is returned
   */
  sequentiallyApplyError: <T, E, F>(
    rFn: Result<T, (data: E) => F>,
    r: Result<T, E>
  ): Result<T, F> => (Result.isData(rFn) ? rFn : Result.mapError(rFn.error, r)),
  /**
   * Applies one of two functions to the result, depending on if it contains
   * data or an error
   */
  bimap: <T, E, U, F>(
    fnData: (data: T) => U,
    fnError: (error: E) => F,
    r: Result<T, E>
  ): Result<U, F> =>
    r.success ? Result.Data(fnData(r.data)) : Result.Error(fnError(r.error)),

  /**
   * Executes the provided action with the contained data, if there is any, and returns the result
   */
  flatMapData: <T, E, U>(
    r: Result<T, E>,
    fn: (data: T) => Result<U, E>
  ): Result<U, E> => (Result.isError(r) ? r : fn(r.data)),
  /**
   * Executes the provided action with the contained error, if there is one, and returns the result
   */
  flatMapError: <T, E, F>(
    r: Result<T, E>,
    fn: (error: E) => Result<T, F>
  ): Result<T, F> => (Result.isData(r) ? r : fn(r.error)),
  /**
   * Sequentially compose two results, discarding any data contained in the first
   */
  sequentiallyComposeData: <T, E, U>(
    a: Result<T, E>,
    b: Result<U, E>
  ): Result<U, E> => (Result.isError(a) ? a : b),
  /**
   * Sequentially compose two results, discarding the error contained in the first
   */
  sequentiallyComposeError: <T, E, F>(
    a: Result<T, E>,
    b: Result<T, F>
  ): Result<T, F> => (Result.isData(a) ? a : b),

  /**
   * If data is present, combines it with the initial value using the provided function,
   * otherwise just returns the initial value
   */
  foldData: <T, E, R>(
    fn: (data: T, init: R) => R,
    init: R,
    r: Result<T, E>
  ): R => (Result.isError(r) ? init : fn(r.data, init)),
  /**
   * If an error is present, combines it with the initial value using the provided function,
   * otherwise just returns the initial value
   */
  foldError: <T, E, R>(
    fn: (error: E, init: R) => R,
    init: R,
    r: Result<T, E>
  ): R => (Result.isData(r) ? init : fn(r.error, init)),
  /**
   * Returns `1` if there is data, `0` otherwise
   */
  lengthData: <T, E>(r: Result<T, E>): 0 | 1 => (Result.isData(r) ? 1 : 0),
  /**
   * Returns `1` if there is an error, `0` otherwise
   */
  lengthError: <T, E>(r: Result<T, E>): 0 | 1 => (Result.isError(r) ? 1 : 0),
  /**
   * Uses one of two functions to combine the initial value with the result,
   * depending on if it contains data or an error
   */
  bifold: <T, E, R>(
    fnData: (data: T, acc: R) => R,
    fnError: (error: E, acc: R) => R,
    accInit: R,
    r: Result<T, E>
  ): R => (r.success ? fnData(r.data, accInit) : fnError(r.error, accInit)),
};

/**
 * Logical of {@link Result} functions into Haskell-like typeclass instances
 */
export const TypeClassInstances = {
  /**
   * https://en.wikipedia.org/wiki/Functor_(functional_programming)
   */
  Functor: {
    Data: {
      map: Result.mapData,
      replace: Result.replaceData,
    },
    Error: {
      map: Result.mapError,
      replace: Result.replaceError,
    },
  },

  /**
   * https://hackage.haskell.org/package/base-4.20.0.1/docs/Data-Semigroup.html
   */
  Semigroup: {
    firstData: Result.firstData,
    firstError: Result.firstError,
  },

  /**
   * https://en.wikipedia.org/wiki/Applicative_functor
   */
  ApplicativeFunctor: {
    Data: {
      pure: Result.Data,
      sequentiallyApply: Result.sequentiallyApplyData,
    },
    Error: {
      pure: Result.Error,
      sequentiallyApply: Result.sequentiallyApplyError,
    },
  },

  /**
   * https://en.wikipedia.org/wiki/Monad_(functional_programming)
   */
  Monad: {
    Data: {
      bind: Result.flatMapData,
      sequentiallyCompose: Result.sequentiallyComposeData,
    },
    Error: {
      bind: Result.flatMapError,
      sequentiallyCompose: Result.sequentiallyComposeError,
    },
  },

  /**
   * https://en.wikipedia.org/wiki/Fold_(higher-order_function)
   */
  Foldable: {
    Data: {
      fold: Result.foldData,
      length: Result.lengthData,
    },
    Error: {
      fold: Result.foldError,
      length: Result.lengthError,
    },
  },

  /**
   * https://hackage.haskell.org/package/base-4.20.0.1/docs/Data-Bifunctor.html
   */
  Bifunctor: {
    bimap: Result.bimap,
  },

  /**
   * https://hackage.haskell.org/package/base-4.20.0.1/docs/Data-Bifoldable.html
   */
  Bifoldable: {
    bifold: Result.bifold,
  },
};
