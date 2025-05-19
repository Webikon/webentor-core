import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

/**
 * Hook that returns the taxonomies associated with a specific post type.
 *
 * Source: https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/query/utils.js
 *
 * @param {string} postType The post type from which to retrieve the associated taxonomies.
 * @return {Object[]} An array of the associated taxonomies.
 */
export const useTaxonomies = (postType) => {
  const taxonomies = useSelect(
    (select) => {
      const { getTaxonomies } = select('core');
      // @ts-expect-error We don't have the type for this function
      return getTaxonomies({
        type: postType,
        per_page: -1,
      });
    },
    [postType],
  );
  return useMemo(() => {
    return taxonomies?.filter(
      ({ visibility }) => !!visibility?.publicly_queryable,
    );
  }, [taxonomies]);
};
