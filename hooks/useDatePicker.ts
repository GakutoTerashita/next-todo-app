import { Dayjs } from "dayjs";
import { useState } from "react";

const useDatePicker = () => {
    const [value, setValue] = useState<Dayjs | null>(null);

    const syncValue = (newValue: Dayjs | null) => {
        setValue(newValue);
    };

    const resetValue = () => {
        setValue(null);
    };

    return {
        value,
        syncValue,
        resetValue,
    };
};

export default useDatePicker;