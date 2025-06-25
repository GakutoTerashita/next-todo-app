import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ReactElement } from "react";

export const renderWithQueryClientProvider = (
    ui: ReactElement,
    options: RenderOptions = {},
): RenderResult => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    return render(ui, { wrapper: Wrapper, ...options });
};