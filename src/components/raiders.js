import React, { useState, useEffect } from "react";

import Raider from "./raider";
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";

const RAIDERS = gql`
    query raiders {
        raiders {
            name
            class
            spec
        }
    }
`;

const ADD_RAIDER = gql`
    mutation addRaider($name: String!, $class: String!, $spec: String!) {
        addRaider(name: $name, class: $class, spec: $spec) {
            name
            class
            spec
        }
    }
`;

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

    useEffect(() => {
        if (data) {
            setRaiders(data.raiders);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{"Error :("}</p>;

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
                <div className="row">
                    <div className="mx-auto mt-3">
                        <button
                            onClick={() =>
                                submitRaider("Räystö", "Druid", "Balance")
                            }
                            className="btn btn-primary"
                        >
                            Lisää raideri
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Raiders;
