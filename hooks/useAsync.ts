import { useEffect, useState } from "react"

type State<T> = {
    data: T | undefined,
    loading: boolean,
    error: any,
}

const useAsync = <T>(
    asyncFunction: () => Promise<T>,
) => {
    const initialState: State<T> = {
        data: undefined,
        loading: false,
        error: undefined,
    }

    const [state, setState] = useState<State<T>>(initialState);

    useEffect(() => {
        setState({ ...initialState, loading: true });

        asyncFunction()
            .then((data) => {
                setState({ data, loading: false, error: undefined });
            })
            .catch((error) => {
                setState({ data: undefined, loading: false, error });
            });

    }, [asyncFunction]);

    return state;
};

export default useAsync;