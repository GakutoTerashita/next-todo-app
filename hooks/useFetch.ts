import { useState } from "react";

type State<T> = {
    data: T | undefined;
    loading: boolean;
    error: any;
}

const useFetch = <T, P>(
    asyncFetchFunction: (params: P) => Promise<T>,
    onError?: (error: Error) => void,
    onRegistered?: () => void,
) => {
    const initialState: State<T> = {
        data: undefined,
        loading: false,
        error: undefined,
    }

    const [state, setState] = useState<State<T>>(initialState);

    const executeFetch = (params: P) => {
        setState({ ...initialState, loading: true });

        asyncFetchFunction(params)
            .then((data) => {
                setState({ data, loading: false, error: undefined });
                onRegistered?.();
            })
            .catch((error) => {
                setState({ data: undefined, loading: false, error });
                if (onError) {
                    onError(error);
                }
            });
    };

    return { ...state, executeFetch };
}

export default useFetch;