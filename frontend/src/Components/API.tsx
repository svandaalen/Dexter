import { Collections, Sources } from "../Model/DexterModel"

const headers = {
    "Content-Type": "application/json"
}

export const getCollections = async () => {
    const response = await fetch("/api/corpora", {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Collections[] = await response.json()
    console.log(data)

    return data
}

export const getCollectionById = async (id: string) => {
    const response = await fetch(`/api/corpora/${id}`, {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Collections = await response.json()
    console.log(data)

    return data
}

export const createCollection = async (newCorpus: Collections) => {
    const response = await fetch("/api/corpora", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newCorpus)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Collections = await response.json()
    console.log(data)

    return data
}

export const updateCollection = async (id: string, updatedCorpus: Collections) => {
    const response = await fetch(`/api/corpora/${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedCorpus)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Collections = await response.json()
    console.log(data)

    return data
}

export const getSources = async () => {
    const response = await fetch("/api/sources", {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Sources[] = await response.json()
    console.log(data)

    return data
}

export const getSourceById = async (id: string) => {
    console.log(id)
    const response = await fetch(`/api/sources/${id}`, {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Sources = await response.json()
    console.log(data)

    return data
}

export const createSource = async (newSource: Sources) => {
    const response = await fetch("/api/sources", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newSource)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Sources = await response.json()
    console.log(data)

    return data
}

export const updateSource = async (id: string, updatedSource: Sources) => {
    const response = await fetch(`/api/sources/${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedSource)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Sources = await response.json()
    console.log(data)

    return data
}