import { useEffect, useState } from "react"

type State<T> = {
    data: T | undefined,
    loading: boolean,
    error: any,
}

const useAutoFetch = <T>(
    asyncFetchFunction: () => Promise<T>,
    onError?: (error: Error) => void,
) => {
    const [state, setState] = useState<State<T>>({
        data: undefined,
        loading: false,
        error: undefined,
    });

    useEffect(() => {
        setState({ ...state, loading: true });

        asyncFetchFunction()
            .then((data) => {
                setState({ data, loading: false, error: undefined });
            })
            .catch((error) => {
                setState({ data: undefined, loading: false, error });
                if (onError) {
                    onError(error);
                }
            });

    }, [asyncFetchFunction]);

    return state;
};

export default useAutoFetch;