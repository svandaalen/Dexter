import { deleteMetadataValue } from '../../utils/API';
import { sources } from '../../model/Resources';
import { Source } from '../../model/DexterModel';
import { useNavigate } from 'react-router-dom';
import { reject } from '../../utils/reject';
import { useSources } from '../../state/resources/hooks/useSources';

export function useDeleteSource(params: { onError: (error: Error) => void }): {
  deleteSource: (source: Source) => void;
} {
  const { deleteSource } = useSources();
  const navigate = useNavigate();

  return {
    deleteSource: async (source: Source) => {
      if (reject('Delete this source?')) {
        return;
      }

      try {
        for (const value of source.metadataValues) {
          await deleteMetadataValue(value.id);
        }
        await deleteSource(source.id);
        navigate(`/${sources}`);
      } catch (e) {
        params.onError(e);
      }
    },
  };
}
