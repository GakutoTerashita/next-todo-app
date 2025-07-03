import { MutationFunction, useMutation, useQueryClient } from "@tanstack/react-query";

const useTodoItemMutation = (
    mutationFn: MutationFunction<void, FormData>,
    optionalOnSuccess?: () => void,
) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todoItems"] });
            if (optionalOnSuccess) {
                optionalOnSuccess();
            }
        },
    });

    return mutation;
};

export default useTodoItemMutation;