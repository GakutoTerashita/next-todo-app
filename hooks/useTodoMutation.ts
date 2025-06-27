import { MutationFunction, useMutation, useQueryClient } from "@tanstack/react-query";

const useTodoMutation = (
    mutationFn: MutationFunction<void, FormData>,
    optionalOnSuccess?: () => void,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todoItems"] });
            if (optionalOnSuccess) {
                optionalOnSuccess();
            }
        },
    })
};

export default useTodoMutation;