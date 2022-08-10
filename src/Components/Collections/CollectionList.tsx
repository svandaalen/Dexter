import React from "react"
import { getCollections } from "../API"
import { Collections } from "../..//Model/DexterModel"
import { NewCollection } from "./NewCollection"
import { CollectionItem } from "./CollectionItem"
import { appContext } from "../../State/context"
import { Button } from "react-bootstrap"
import { ACTIONS } from "../../State/actions"

export function CollectionList() {
    const { state, dispatch } = React.useContext(appContext)
    const [showForm, setShowForm] = React.useState(false)

    const doGetCollections = React.useCallback(async () => {
        try {
            const result = await getCollections()
            dispatch({type: ACTIONS.SET_COLLECTIONS, collections: result})
        } catch (error) {
            console.log(error)
        }
    }, [])

    React.useEffect(() => {
        doGetCollections()
    }, [doGetCollections])

    const refetchCollections = async () => {
        await doGetCollections()
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
                    selected={state.selectedCollection?.metadata.id === collection.metadata.id}
                    onSelect={handleSelected}
                    refetch={refetchCollections}
                />
            )) : "Loading"}
        </>
    )
}