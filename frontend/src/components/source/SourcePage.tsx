import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import React from "react";
import { useParams } from "react-router-dom";
import {
    ServerKeyword,
    ServerLanguage,
    ServerSource,
} from "../../model/DexterModel";
import { Actions } from "../../state/actions";
import { sourcesContext } from "../../state/sources/sourcesContext";
import { deleteKeywordFromSourceWithWarning } from "../../utils/deleteKeywordFromSourceWithWarning";
import { deleteLanguageFromSourceWithWarning } from "../../utils/deleteLanguageFromSourceWithWarning";
import { getKeywordsSources, getLanguagesSources, getSourceById } from "../../utils/API";
import { Keyword } from "../keyword/Keyword";
import { Languages } from "../language/Languages";
import { SourceForm } from "./SourceForm";
import {EditButton} from "../common/EditButton"
import {KeywordList} from "../keyword/KeywordList"

export const SourcePage = () => {
    const [source, setSource] = React.useState<ServerSource>(null);
    const [keywords, setKeywords] = React.useState<ServerKeyword[]>(null);
    const [languages, setLanguages] = React.useState<ServerLanguage[]>(null);

    const params = useParams();

    const { sourcesState, dispatchSources } = React.useContext(sourcesContext);
    const [showForm, setShowForm] = React.useState(false);

    const formShowHandler = () => {
        dispatchSources({
            type: Actions.SET_TOEDITSOURCE,
            toEditSource: source,
        });
        editHandler(true);
        setShowForm(true);
    };

    const formCloseHandler = () => {
        setShowForm(false);
    };

    const editHandler = (boolean: boolean) => {
        dispatchSources({
            type: Actions.SET_EDITSOURCEMODE,
            editSourceMode: boolean,
        });
    };

    const doGetSourceById = async (id: string) => {
        const source = await getSourceById(id);
        setSource(source);

        const keywords = await getKeywordsSources(source.id);
        setKeywords(keywords);

        const languages = await getLanguagesSources(source.id);
        setLanguages(languages);
    };

    React.useEffect(() => {
        doGetSourceById(params.sourceId);
    }, [params.sourceId]);

    const refetchSource = async () => {
        await doGetSourceById(params.sourceId);
    };

    const deleteLanguageHandler = async (language: ServerLanguage) => {
        await deleteLanguageFromSourceWithWarning(language, params.sourceId);
        await refetchSource();
    };

    const deleteKeywordHandler = async (keyword: ServerKeyword) => {
        await deleteKeywordFromSourceWithWarning(keyword, params.sourceId);
        await refetchSource();
    };

    return (
        <div>
            {source && keywords && languages && (
                <>
                    <EditButton onEdit={formShowHandler}/>
                    <p>
                        <strong>External reference:</strong> {source.externalRef}
                    </p>
                    <p>
                        <strong>Title:</strong> {source.title}
                    </p>
                    <p>
                        <strong>Description:</strong> {source.description}
                    </p>
                    <p>
                        <strong>Creator:</strong> {source.creator}
                    </p>
                    <p>
                        <strong>Rights:</strong> {source.rights}
                    </p>
                    <p>
                        <strong>Access:</strong> {source.access}
                    </p>
                    <p>
                        <strong>Location:</strong> {source.location}
                    </p>
                    <p>
                        <strong>Earliest:</strong> {source.earliest}
                    </p>
                    <p>
                        <strong>Latest:</strong> {source.latest}
                    </p>
                    <p>
                        <strong>Notes:</strong> {source.notes}
                    </p>
                    <div>
                        <strong>Keywords:</strong>{" "}
                        <KeywordList
                            keywords={keywords}
                            onDelete={deleteKeywordHandler}
                        />
                    </div>
                    <div>
                        <strong>Languages:</strong>{" "}
                        <Languages
                            languages={languages}
                            onDelete={deleteLanguageHandler}
                        />
                    </div>
                </>
            )}
            {sourcesState.editSourceMode && (
                <SourceForm
                    show={showForm}
                    onEdit={editHandler}
                    edit={sourcesState.editSourceMode}
                    sourceToEdit={sourcesState.toEditSource}
                    onClose={formCloseHandler}
                    refetchSource={refetchSource}
                />
            )}
        </div>
    );
};
