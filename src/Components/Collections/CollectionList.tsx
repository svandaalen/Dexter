import React from "react"
import { Collections } from "../..//Model/DexterModel"
import { NewCollection } from "./NewCollection"
import { CollectionItem } from "./CollectionItem"
import { appContext } from "../../State/context"
import { Button } from "react-bootstrap"
import { ACTIONS } from "../../State/actions"
import { doGetCollections } from "../../Utils/doGetCollections"

export function CollectionList() {
    const { state, dispatch } = React.useContext(appContext)
    const [showForm, setShowForm] = React.useState(false)

    const refetchCollections = () => {
        doGetCollections()
            .then(function (collections) {
                dispatch({
                    type: ACTIONS.SET_COLLECTIONS,
                    collections: collections
                })
            })
    }

    const handleSelected = (selected: Collections | undefined) => {
        console.log(selected)
        return dispatch({ type: ACTIONS.SET_SELECTEDCOLLECTION, selectedCollection: selected })
    }

    const formShowHandler = () => {
        setShowForm(true)
    }

    const formCloseHandler = () => {
        setShowForm(false)
    }

    return (
        <>
            {showForm && <NewCollection show={showForm} onClose={formCloseHandler} refetch={refetchCollections} />}
            <Button onClick={formShowHandler}>Add new collection</Button>
            {state.collections ? state.collections.map((collection: Collections, index: number) => (
                <CollectionItem
                    key={index}
                    collectionId={index}
                    collection={collection}
                    selected={state.selectedCollection?.id === collection.id}
                    onSelect={handleSelected}
                    refetch={refetchCollections}
                />
            )) : "Loading"}
        </>
    )
}