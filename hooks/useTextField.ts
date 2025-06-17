import { useState } from "react";

const useTextField = () => {
    const [value, setValue] = useState("");

    const syncValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const resetValue = () => {
        setValue("");
    };

    return {
        value,
        syncValue,
        resetValue,
    };
};

export default useTextField;