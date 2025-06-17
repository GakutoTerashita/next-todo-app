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
    const [state, setState] = useState<State<T>>({
        data: undefined,
        loading: false,
        error: undefined,
    });

    const executeFetch = (params: P) => {
        setState({ ...state, loading: true });

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