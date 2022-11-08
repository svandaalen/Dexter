import { Autocomplete, Chip, TextField } from "@mui/material"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"
import React from "react"
import { Controller, UseFormSetValue, useWatch } from "react-hook-form"
import { FormKeyword, ServerCorpus, ServerKeyword } from "../../Model/DexterModel"
import { useDebounce } from "../../Utils/useDebounce"
import { deleteKeywordFromCorpus, getKeywordsAutocomplete } from "../API"

interface KeywordsFieldProps {
    corpusId?: string | undefined
    sourceId?: string | undefined
    control: any
    setValue?: UseFormSetValue<ServerCorpus>
}

export const KeywordsField = (props: KeywordsFieldProps) => {
    const { control } = props
    const [keywords, setKeywords] = React.useState<FormKeyword[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const debouncedInput = useDebounce<string>(inputValue, 250)
    const selectedItems = useWatch({ control, name: "keywords" })


    async function autoComplete(input: string) {
        const result = await getKeywordsAutocomplete(input)
        setKeywords(result)
        setLoading(false)
        //return result
    }

    const deleteKeywordHandler = async (corpusId: string, keyword: ServerKeyword) => {
        const warning = window.confirm("Are you sure you wish to delete this keyword?")

        if (warning === false) return

        props.setValue("keywords", selectedItems.filter((entry: any) => entry !== keyword))

        await deleteKeywordFromCorpus(corpusId, keyword.id)
    }

    React.useEffect(() => {
        if (debouncedInput.length > 2) {
            autoComplete(debouncedInput)
            setLoading(true)
        }
    }, [debouncedInput])

    return (
        <div>
            {keywords && <Controller
                control={props.control}
                name={"keywords"}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        inputValue={inputValue}
                        open={debouncedInput.length > 2}
                        onInputChange={async (event, value) => { setInputValue(value) }}
                        multiple={true}
                        loading={loading}
                        id="keywords-autocomplete"
                        options={keywords}
                        getOptionLabel={(keyword: FormKeyword) => keyword.val}
                        filterOptions={(x) => x}
                        isOptionEqualToValue={(option, value) => option.val === value.val}
                        value={value}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="Select a keyword"
                                value={value}
                            />
                        )}
                        renderTags={(tagValue, getTagProps) =>
                            tagValue.map((keyword, index) => (
                                <Chip
                                    label={keyword.val}
                                    key={index}
                                    {...getTagProps({ index })}
                                    onDelete={() => { deleteKeywordHandler(props.corpusId, keyword) }}
                                />
                            ))
                        }
                        onChange={(_, data) => {
                            onChange(data)
                        }}
                        renderOption={(props, option, { inputValue }) => {
                            const matches = match(option.val, inputValue, { insideWords: true })
                            const parts = parse(option.val, matches)

                            return (
                                <li {...props}>
                                    <div>
                                        {parts.map((part, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    fontWeight: part.highlight ? 700 : 400
                                                }}
                                            >
                                                {part.text}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                            )
                        }}
                    />
                )}
            />}
        </div>
    )
}