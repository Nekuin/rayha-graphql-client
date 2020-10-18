import React, { useState, useEffect } from "react";

import Raider from "./raider";
import RaiderForm from "./raiderform";
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";

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

// subscribe to raider added events
const RAIDER_SUB = gql`
    subscription OnRaiderAdded {
        raiderAdded {
            name
            class
            spec
        }
    }
`;

function Raiders() {
    const [raiders, setRaiders] = useState([]);

    // fetch raiders query hook
    const { loading, error, data } = useQuery(RAIDERS);
    // add a raider mutation hook
    const [addRaider, { rData }] = useMutation(ADD_RAIDER);
    // subscribe to changes in raiders (well at least "added" changes)
    // -- kind of annoying but subscribers actually subscribe twice in dev environment
    // BUT THIS DOES GO AWAY IN A PRODUCTION BUILD! (tested)
    // https://github.com/apollographql/apollo-client/issues/6037
    const { subloading, suberror, subdata } = useSubscription(RAIDER_SUB, {
        onSubscriptionData: (data) => {
            console.log("sub data", data);
            console.log(
                "sub added raider",
                data.subscriptionData.data.raiderAdded
            );
            setRaiders([...raiders, data.subscriptionData.data.raiderAdded]);
        },
    });

    // put raiders in a state so we can add more
    // when we receive raiders from the useSubscription hook
    useEffect(() => {
        if (data) {
            setRaiders(data.raiders);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{"Error :("}</p>;

    // use the useMutation hook to submit a raider
    const submitRaider = (name, cls, spec) => {
        console.log("adding raider", name, cls, spec);
        addRaider({ variables: { name: name, class: cls, spec: spec } });
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
