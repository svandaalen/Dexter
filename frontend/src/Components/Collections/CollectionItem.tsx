import React, {useContext} from "react"
import { Collections } from "../../Model/DexterModel"
import { Link } from "react-router-dom"
import { deleteCollection, getCollections } from "../../utils/API"
import styled from "@emotion/styled"
import { collectionsContext } from "../../State/Collections/collectionContext"
import { Actions } from "../../State/actions"
import DeleteIcon from "@mui/icons-material/Delete"
import {errorContext} from "../../State/Error/errorContext"

type CollectionItemProps = {
    collectionId: React.Key,
    collection: Collections,
    onSelect: (selected: Collections | undefined) => void,
}

const DeleteIconStyled = styled(DeleteIcon)`
    margin-left: 5px;
    &:hover {
        cursor: pointer;
        color: gray;
    }
`

export function CollectionItem(props: CollectionItemProps) {
    const { collectionsDispatch } = React.useContext(collectionsContext)
    const {setError} = useContext(errorContext)

    const toggleClick = () => {
        props.onSelect(props.collection)
    }

    const handleDelete = async (id: string) => {
        const warning = window.confirm("Are you sure you wish to delete this corpus?")

        if (warning === false) return

        await deleteCollection(id)
            .catch(setError)
        getCollections()
            .then(function (collections) {
                collectionsDispatch({
                    type: Actions.SET_COLLECTIONS,
                    collections: collections
                })
            }).catch(setError)
    }

    return (
        <>
            <ul>
                <li key={props.collectionId}>
                    <Link to={`/corpora/${props.collection.id}`} key={props.collectionId} onClick={toggleClick}>
                        {props.collection.title}
                    </Link>
                    <DeleteIconStyled color="error" onClick={() => handleDelete(props.collection.id)}>Delete corpus</DeleteIconStyled>
                </li>
            </ul>
        </>
    )
}