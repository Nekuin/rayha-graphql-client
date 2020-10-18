import React, { useState } from "react";

import { classes, specs } from "../constants/classes";

const RaiderForm = ({ submitRaider }) => {
    const [characterName, setCharacterName] = useState("");
    const [cls, setCls] = useState("Paladin");
    const [spec, setSpec] = useState("Holy");

    const [showNameError, setShowNameError] = useState(false);

    const clearForm = () => {
        setCharacterName("");
        if (showNameError) setShowNameError(false);
    };

    return (
        <>
            <form>
                <p className="form-title">Räyhä needs you!</p>
                <p className="form-subtitle">Shadowlands raid roster signup</p>
                <div className="form-group">
                    <label htmlFor="raiderCharacterName">Character name</label>
                    <input
                        type="email"
                        className="form-control"
                        id="raiderCharacterName"
                        placeholder="Räystö"
                        value={characterName}
                        onChange={(e) => {
                            setCharacterName(e.target.value);
                        }}
                    />
                    {showNameError && (
                        <p style={{ color: "red" }}>Input a character name!</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="raiderClass">Class</label>
                    <select
                        className="form-control"
                        id="raiderClass"
                        value={cls}
                        onChange={(e) => {
                            setCls(e.target.value);
                            // we also should change the spec to some default
                            // from the class, let's pick the first one!
                            setSpec(specs[e.target.value][0]);
                        }}
                    >
                        {classes.map((item, index) => {
                            return (
                                <option key={"class" + index}>{item}</option>
                            );
                        })}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="raiderSpec">Spec</label>
                    <select
                        className="form-control"
                        id="raiderClass"
                        value={spec}
                        onChange={(e) => {
                            setSpec(e.target.value);
                        }}
                    >
                        {specs[cls].map((item, index) => {
                            return (
                                <option key={"class" + index}>{item}</option>
                            );
                        })}
                    </select>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        if (characterName === "") {
                            setShowNameError(true);
                            return;
                        }
                        submitRaider(characterName, cls, spec);
                        clearForm();
                    }}
                >
                    Submit
                </button>
            </form>
        </>
    );
};

export default RaiderForm;
