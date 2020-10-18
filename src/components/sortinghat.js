import React from "react";

import { roles } from "../constants/classes";
import { classColors } from "../constants/classcolors";
import Raider from "./raider";

const SortingHat = ({ raiders }) => {
    const sorted = {
        Healer: [],
        DPS: [],
        Tank: [],
    };
    for (let raider of raiders) {
        for (let key in roles) {
            const arr = roles[key];
            if (arr.includes(raider.spec)) {
                console.log(raider.name, "role:", key);
                sorted[key].push(raider);
            }
        }
        console.log("sorted", sorted);
    }

    return (
        <>
            <div className="sorted-container row">
                {sorted.Healer.length > 0 && (
                    <div className="sorted-section raiders mx-auto col-sm-12 col-md-6 col-lg-6 col-xl-4">
                        <p>Healers:</p>
                        {sorted.Healer.map((raider, index) => {
                            return (
                                <Raider
                                    raider={raider}
                                    key={"healer" + index}
                                />
                            );
                        })}
                    </div>
                )}

                {sorted.DPS.length > 0 && (
                    <div className="sorted-section raiders mx-auto col-sm-12 col-md-6 col-lg-6 col-xl-4">
                        <p>DPS:</p>
                        {sorted.DPS.map((raider, index) => {
                            return (
                                <Raider raider={raider} key={"dps" + index} />
                            );
                        })}
                    </div>
                )}

                {sorted.Tank.length > 0 && (
                    <div className="sorted-section raiders mx-auto col-sm-12 col-md-6 col-lg-6 col-xl-4">
                        <p>Tanks:</p>
                        {sorted.Tank.map((raider, index) => {
                            return (
                                <Raider raider={raider} key={"tank" + index} />
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default SortingHat;
