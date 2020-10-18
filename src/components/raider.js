import React from "react";

import { classColors } from "../constants/classcolors";

const Raider = ({ raider }) => {
    return (
        <>
            <div
                className="row raider mx-auto mb-1"
                style={{ backgroundColor: classColors[raider.class] }}
            >
                <p>{raider.name}</p>
                <p>{raider.class}</p>
                <p>{raider.spec}</p>
            </div>
        </>
    );
};

export default Raider;
