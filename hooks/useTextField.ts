import { useState } from "react";

const useTextField = () => {
    const [value, setValue] = useState("");

    const syncValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return {
        value,
        syncValue,
    };
};

export default useTextField;