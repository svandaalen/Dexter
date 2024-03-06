import React, { useEffect, useState } from 'react';
import {
  AccessOptions,
  ResultMetadataKey,
  Source,
  SourceFormSubmit,
} from '../../model/DexterModel';
import ScrollableModal from '../common/ScrollableModal';
import { SelectTagField } from '../tag/SelectTagField';
import { LanguagesField } from '../language/LanguagesField';
import { Label } from '../common/Label';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { TextFieldWithError } from './TextFieldWithError';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import { ImportField } from './ImportField';
import _ from 'lodash';
import { MetadataValueFormFields } from '../metadata/MetadataValueFormFields';
import { isImportableUrl, useImportMetadata } from './useImportMetadata';
import { useSubmitSourceForm } from './useSubmitSourceForm';
import { useInitSourceForm } from './useInitSourceForm';
import { TextareaFieldProps } from '../common/TextareaFieldProps';
import { onSubmit } from '../../utils/onSubmit';
import { SelectMediaField } from '../media/SelectMediaField';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { ErrorP } from '../common/error/ErrorP';

type SourceFormProps = {
  sourceToEdit?: Source;
  corpusId?: string;
  onSaved: (data: Source) => void;
  onClose: () => void;
};

export function SourceForm(props: SourceFormProps) {
  const sourceToEdit = props.sourceToEdit;

  const [form, setForm] = useState<SourceFormSubmit>();
  const { errors, setError, setFieldError } = useFormErrors<Source>();
  const [keys, setKeys] = useState<ResultMetadataKey[]>([]);

  const { init, isInit } = useInitSourceForm({
    sourceToEdit,
    setForm,
    setKeys,
  });
  const { submitSourceForm } = useSubmitSourceForm({
    sourceToEdit,
    setError,
    onSubmitted: props.onSaved,
  });
  const { isImportLoading, loadImport } = useImportMetadata<SourceFormSubmit>({
    setError,
    setFieldError,
  });

  useEffect(init, []);

  async function handleImportMetadata() {
    setForm(await loadImport(form));
  }

  async function handleSubmit() {
    await submitSourceForm(form, keys);
  }

  function renderFormField(
    fieldName: keyof SourceFormSubmit,
    props?: TextareaFieldProps,
  ) {
    return (
      <TextFieldWithError
        label={_.capitalize(fieldName)}
        value={form[fieldName] as string}
        onChange={v =>
          setForm(f => {
            const update = { ...f };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (update as any)[fieldName] = v;
            return update;
          })
        }
        error={errors[fieldName]}
        {...props}
      />
    );
  }

  if (!isInit) {
    return null;
  }
  return (
    <ScrollableModal handleClose={props.onClose}>
      <CloseInlineIcon onClick={props.onClose} />

      <h1>{sourceToEdit ? 'Edit source' : 'Create new source'}</h1>
      <FormErrorMessage error={errors.generic} />
      <form onSubmit={onSubmit(handleSubmit)}>
        <ImportField
          label="External Reference"
          value={form.externalRef}
          onChange={externalRef => setForm(f => ({ ...f, externalRef }))}
          error={errors.externalRef}
          onImport={handleImportMetadata}
          isImporting={isImportLoading}
          isRefImportable={isImportableUrl(form.externalRef)}
        />

        {renderFormField('title')}
        {renderFormField('description', { rows: 6, multiline: true })}
        {renderFormField('creator')}
        {renderFormField('rights')}
        {renderFormField('ethics')}

        <ValidatedSelectField
          label="Access"
          error={errors.access}
          selectedOption={form.access}
          onSelectOption={access => setForm(f => ({ ...f, access }))}
          options={AccessOptions}
        />

        {renderFormField('location')}
        {renderFormField('earliest')}
        {renderFormField('latest')}
        {renderFormField('notes', { rows: 6, multiline: true })}

        <Label>Tags</Label>
        <SelectTagField
          selected={form.tags}
          onChangeSelected={tags => setForm(f => ({ ...f, tags }))}
          useAutocomplete
          allowCreatingNew
        />
        <ErrorP error={errors.tags} />

        <Label>Languages</Label>
        <LanguagesField
          selected={form.languages}
          onChangeSelected={languages => setForm(f => ({ ...f, languages }))}
        />
        <ErrorP error={errors.languages} />

        <MetadataValueFormFields
          keys={keys}
          values={form.metadataValues}
          onChange={metadataValues => setForm(f => ({ ...f, metadataValues }))}
        />
        <ErrorP error={errors.metadataValues} />

        <Label>Media</Label>
        <SelectMediaField
          selected={form.media}
          onChangeSelected={media => setForm(f => ({ ...f, media }))}
          allowCreatingNew
        />
        <ErrorP error={errors.media} />

        <SubmitButton onClick={handleSubmit} />
      </form>
    </ScrollableModal>
  );
}
