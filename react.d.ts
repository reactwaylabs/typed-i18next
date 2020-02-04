type ExtractObject<T> = T extends { [key: string]: infer TA } ? TA : never;
type IgnoreFirstParameter<TFunc> = TFunc extends (arg: any, ...restArgs: infer TArgs) => any ? TArgs : never;

export interface StrictTypedTranslations<
    TTranslationsFun extends (...args: any[]) => any,
    TTranslations extends { keys: { [key: string]: any }; keysWithNS: { [key: string]: any } }
> {
    (ns?: undefined, ...args: IgnoreFirstParameter<TTranslationsFun>): Omit<ReturnType<TTranslationsFun>, "t"> & {
        t: (key: ExtractObject<TTranslations["keysWithNS"]> | ExtractObject<TTranslations["keys"]>, interpolate?: Object) => string;
    };
    <TNamespace extends keyof TTranslations["keys"]>(ns: TNamespace, ...args: IgnoreFirstParameter<TTranslationsFun>): Omit<
        ReturnType<TTranslationsFun>,
        "t"
    > & {
        t: (key: TTranslations["keys"][TNamespace], interpolate?: Object) => string;
    };
    <TNamespaces extends ArrayLike<keyof TTranslations["keys"]>>(ns: TNamespaces, ...args: IgnoreFirstParameter<TTranslationsFun>): Omit<
        ReturnType<TTranslationsFun>,
        "t"
    > & {
        t: (key: ExtractObject<Pick<TTranslations["keysWithNS"], TNamespaces[number]>>, interpolate?: Object) => string;
    };
}
