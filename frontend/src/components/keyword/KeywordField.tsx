import {Autocomplete, Chip, TextField, TextFieldProps} from "@mui/material"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"
import React from "react"
import {ServerKeyword,} from "../../model/DexterModel"
import {useDebounce} from "../../utils/useDebounce"
import {getKeywordsAutocomplete,} from "../../utils/API"
import {normalizeInput} from "../../utils/normalizeInput"

interface KeywordsFieldProps {
    selected: ServerKeyword[];
    onChangeSelected: (selected: ServerKeyword[]) => void
    suggestions?: ServerKeyword[]
    size?: 'small' | 'medium'
}

const MIN_AUTOCOMPLETE_LENGTH = 1

export const KeywordField = (props: KeywordsFieldProps) => {
    const [suggestions, setSuggestions] = React.useState<ServerKeyword[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const debouncedInput = useDebounce<string>(inputValue, 250)

    async function autoComplete(input: string) {
        const options = props.suggestions
            ? getSuggestions(props, input)
            : await getKeywordsAutocomplete(input)
        const withoutSelected = options
            .filter(o => !props.selected.find(s => s.id === o.id))
        setSuggestions(withoutSelected)
        setLoading(false)
    }

    const handleDeleteKeyword = (keyword: ServerKeyword) => {
        const newSelected = props.selected.filter(k => k.id !== keyword.id)
        props.onChangeSelected(newSelected)
    }

    React.useEffect(() => {
        if (debouncedInput.length >= MIN_AUTOCOMPLETE_LENGTH) {
            setLoading(true)
            autoComplete(debouncedInput)
        }
    }, [debouncedInput])

    function renderInputField(
        params: TextFieldProps
    ): JSX.Element {
        return <TextField
            {...params}
            placeholder="Filter by keywords"
            value={inputValue}
            size={props.size ? props.size : "medium"}
        />
    }

    return <Autocomplete
        inputValue={inputValue}
        open={debouncedInput.length >= MIN_AUTOCOMPLETE_LENGTH}
        onInputChange={async (event, value) => {
            setInputValue(value)
        }}
        multiple={true}
        loading={loading}
        id="keywords-autocomplete"
        options={suggestions}
        getOptionLabel={(keyword: ServerKeyword) => keyword.val}
        filterOptions={(x) => x}
        isOptionEqualToValue={(option, value) => option.val === value.val}
        value={props.selected}
        renderInput={renderInputField}
        forcePopupIcon={false}
        renderTags={(tagValue, getTagProps) =>
            tagValue.map((keyword, index) => (
                <Chip
                    label={keyword.val}
                    key={index}
                    {...getTagProps({index})}
                    onDelete={() => {
                        handleDeleteKeyword(keyword)
                    }}
                    size={props.size ? props.size : "medium"}
                />
            ))
        }
        onChange={(_, data) => {
            props.onChangeSelected(data as ServerKeyword[])
        }}
        renderOption={(props, option, {inputValue}) => {
            const matches = match(option.val, inputValue, {
                insideWords: true,
            })
            const parts = parse(option.val, matches)

            return (
                <li {...props}>
                    <div>
                        {parts.map((part, index) => (
                            <span
                                key={index}
                                style={{
                                    fontWeight: part.highlight ? 700 : 400,
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
}

function getSuggestions(props: KeywordsFieldProps, input: string) {
    return props.suggestions
        .filter(s => normalizeInput(s.val).includes(normalizeInput((input))))
        .sort((s1, s2) => s1.val > s2.val ? 1 : -1)
}
