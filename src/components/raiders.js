import React, { useEffect, useState } from "react";

import Raider from "./raider";
import RaiderForm from "./raiderform";
import { useQuery, gql, useMutation } from "@apollo/client";

// get all raiders query
const RAIDERS = gql`
    query raiders {
        raiders {
            name
            class
            spec
        }
    }
`;

// add a new raider mutation query
const ADD_RAIDER = gql`
    mutation addRaider($name: String!, $class: String!, $spec: String!) {
        addRaider(name: $name, class: $class, spec: $spec) {
            name
            class
            spec
        }
    }
`;

function Raiders() {
    const [raiders, setRaiders] = useState([]);

    // fetch raiders query hook
    const { loading, error, data } = useQuery(RAIDERS, {
        pollInterval: 5000,
    });

    // add a raider mutation hook
    const [
        addRaider,
        { loading: mutationLoading, error: mutationError },
    ] = useMutation(ADD_RAIDER, {
        onError(error) {
            console.log("mutation error", error.message);
        },
    });

    useEffect(() => {
        if (data) {
            setRaiders(data.raiders);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{"Error :("}</p>;

    // use the useMutation hook to submit a raider
    const submitRaider = async (name, cls, spec) => {
        console.log("adding raider", name, cls, spec);
        const addedRaider = await addRaider({
            variables: { name: name, class: cls, spec: spec },
        });

        if (addedRaider?.data?.addRaider) {
            console.log("submitted raider?", addedRaider.data.addRaider);
            setRaiders([...raiders, addedRaider.data.addRaider]);
        }
    };

    return (
        <>
            <div className="raiders">
                {raiders.map((item, index) => {
                    return <Raider raider={item} key={"raider" + index} />;
                })}
                <RaiderForm submitRaider={submitRaider} />
            </div>
        </>
    );
}

export default Raiders;
