import { Dayjs } from "dayjs";
import { useState } from "react";

const useDatePicker = () => {
    const [value, setValue] = useState<Dayjs | null>(null);

    const syncValue = (newValue: Dayjs | null) => {
        setValue(newValue);
    };

    return {
        value,
        syncValue,
    };
};

export default useDatePicker;