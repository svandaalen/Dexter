import React, { useEffect, useState } from 'react';
import { Source } from '../../model/DexterModel';
import { SourceListItem } from './SourceListItem';
import { deleteSource, getSourcesWithResources } from '../../utils/API';
import { SourceForm } from './SourceForm';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { List } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { SourceIcon } from './SourceIcon';
import { useAsyncError } from '../../utils/useAsyncError';

export function SourceIndex() {
  const [showForm, setShowForm] = useState(false);
  const [sources, setSources] = useState<Source[]>();
  const [isInit, setInit] = useState(false);
  const [sourceToEdit, setSourceToEdit] = useState<Source>(null);
  const throwError = useAsyncError();

  useEffect(() => {
    async function initResources() {
      getSourcesWithResources()
        .then(sources => setSources(sources))
        .catch(throwError);
    }

    if (!isInit) {
      setInit(true);
      initResources();
    }
  }, [isInit]);

  const handleDelete = (source: Source) => {
    const warning = window.confirm(
      'Are you sure you wish to delete this source?',
    );

    if (warning === false) return;

    deleteSource(source.id)
      .then(() =>
        setSources(sources => sources.filter(s => s.id !== source.id)),
      )
      .catch(throwError);
  };

  const handleEdit = (source: Source) => {
    setSourceToEdit(source);
    setShowForm(true);
  };

  function handleSaveSource(source: Source) {
    if (sourceToEdit) {
      setSources(sources =>
        sources.map(s => (s.id === source.id ? source : s)),
      );
      setSourceToEdit(null);
    } else {
      setSources(sources => [...sources, source]);
    }
    setShowForm(false);
  }

  function handleCloseSource() {
    setSourceToEdit(null);
    setShowForm(false);
  }

  function byUpdatedAtDesc(s1: Source, s2: Source) {
    return s1.updatedAt < s2.updatedAt ? 1 : -1;
  }

  return (
    <>
      <div>
        <HeaderBreadCrumb />

        <div style={{ float: 'right' }}>
          <AddNewResourceButton
            title="New source"
            onClick={() => setShowForm(true)}
          />
        </div>

        <h1>
          <SourceIcon />
          Sources
        </h1>
      </div>
      {showForm && (
        <SourceForm
          onClose={handleCloseSource}
          onSaved={handleSaveSource}
          sourceToEdit={sourceToEdit}
        />
      )}
      {sources && (
        <List sx={{ mt: '1em' }}>
          {sources.sort(byUpdatedAtDesc).map(source => (
            <SourceListItem
              key={source.id}
              source={source}
              onDelete={() => handleDelete(source)}
              onEdit={() => handleEdit(source)}
            />
          ))}
        </List>
      )}
    </>
  );
}
