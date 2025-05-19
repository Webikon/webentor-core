import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

/**
 * Returns a helper object that contains:
 * 1. An `options` object from the available post types, to be passed to a `SelectControl`.
 * 2. A helper map with available taxonomies per post type.
 *
 * Source: https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/query/utils.js
 *
 * @return {Object} The helper object related to post types.
 */
export const usePostTypes = () => {
  const postTypes = useSelect((select) => {
    const { getPostTypes } = select('core');

    const excludedPostTypes = ['attachment'];
    // @ts-expect-error We don't have the type for this function
    const filteredPostTypes = getPostTypes({ per_page: -1 })?.filter(
      ({ viewable, slug }) => viewable && !excludedPostTypes.includes(slug),
    );
    return filteredPostTypes;
  }, []);

  const postTypesTaxonomiesMap = useMemo(() => {
    if (!postTypes?.length) {
      return;
    }
    return postTypes.reduce((accumulator, type) => {
      accumulator[type.slug] = type.taxonomies;
      return accumulator;
    }, {});
  }, [postTypes]);
  const postTypesSelectOptions = useMemo(
    () =>
      (postTypes || []).map(({ labels, slug }) => ({
        label: labels.singular_name,
        value: slug,
      })),
    [postTypes],
  );
  return { postTypesTaxonomiesMap, postTypesSelectOptions };
};
