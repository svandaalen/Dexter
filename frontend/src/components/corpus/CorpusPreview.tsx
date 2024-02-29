import React, { useContext } from 'react';
import { Corpus, isImage } from '../../model/DexterModel';
import { useNavigate } from 'react-router-dom';
import { deleteCorpus } from '../../utils/API';
import { errorContext } from '../../state/error/errorContext';
import { Card, CardContent, Grid } from '@mui/material';
import { HeaderLinkClamped } from '../common/HeaderLinkClamped';
import { PClamped } from '../common/PClamped';
import { CorpusIcon } from './CorpusIcon';
import { Title } from '../media/Title';
import { CardHeaderImage } from '../common/CardHeaderImage';
import { TagList } from '../tag/TagList';
import { CloseInlineIcon } from '../common/CloseInlineIcon';

type CorpusPreviewProps = {
  corpus: Corpus;
  onDeleted: () => void;
};

export function CorpusPreview(props: CorpusPreviewProps) {
  const { dispatchError } = useContext(errorContext);
  const navigate = useNavigate();
  const handleDelete = async (collection: Corpus) => {
    const warning = window.confirm(
      'Are you sure you wish to delete this corpus?',
    );

    if (warning === false) return;

    await deleteCorpus(collection.id).catch(dispatchError);
    props.onDeleted();
  };

  const headerImage = props.corpus.sources
    .flatMap(s => s.media)
    .find(s => isImage(s.mediaType))?.url;

  const corpus = props.corpus;
  function navigateToCorpus() {
    return navigate(`/corpora/${corpus.id}`);
  }

  return (
    <Card style={{ height: '100%' }}>
      <CardHeaderImage src={headerImage} onClick={navigateToCorpus} />
      <CardContent style={{ height: '100%', paddingBottom: '1em' }}>
        <Grid container>
          <Grid item sx={{ maxHeight: '110px' }} xs={12}>
            <CloseInlineIcon onClick={() => handleDelete(corpus)} />
            <HeaderLinkClamped onClick={navigateToCorpus}>
              <CorpusIcon />
              <Title title={corpus.title} />
            </HeaderLinkClamped>
            <PClamped>{corpus.description}</PClamped>
          </Grid>
          <Grid item sx={{ mt: '0.5em' }}>
            <TagList tags={props.corpus.tags} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
