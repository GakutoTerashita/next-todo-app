import { MutationFunction, useMutation, useQueryClient } from "@tanstack/react-query";

const useTodoMutation = (mutationFn: MutationFunction<void, FormData>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todoItems"] });
        },
    })
};

export default useTodoMutation;