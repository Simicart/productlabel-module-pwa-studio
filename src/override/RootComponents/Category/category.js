import React, { useEffect, useMemo, useRef, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { number, shape, string } from 'prop-types';
import { useLazyQuery, useQuery } from '@apollo/client';
import { usePagination, useSort } from '@magento/peregrine';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import CategoryContent from '@magento/venia-ui/lib/RootComponents/Category/categoryContent';
import defaultClasses from '@magento/venia-ui/lib/RootComponents/Category/category.css';
import { Meta } from '@magento/venia-ui/lib/components/Head';
import {
    getFiltersFromSearch,
    getFilterInput
} from '@magento/peregrine/lib/talons/FilterModal/helpers';

import FILTER_INTROSPECTION from '@magento/venia-ui/lib/queries/introspection/filterIntrospectionQuery.graphql';

import gql from 'graphql-tag'

const GET_CATEGORY = gql`
query category(
    $id: Int!
    $pageSize: Int!
    $currentPage: Int!
    $filters: ProductAttributeFilterInput!
    $sort: ProductAttributeSortInput
) {
    category(id: $id) {
        id
        description
        name
        product_count
        meta_title
        meta_keywords
        meta_description
    }
    products(
        pageSize: $pageSize
        currentPage: $currentPage
        filter: $filters
        sort: $sort
    ) {
        items {
            # id is always required, even if the fragment includes it.
            id
            # TODO: Once this issue is resolved we can use a
            # GalleryItemFragment here:
            # https://github.com/magento/magento2/issues/28584
            name
            price {
                regularPrice {
                    amount {
                        currency
                        value
                    }
                }
            }
            small_image {
                url
            }
            url_key
            url_suffix
            mp_label_data {
                list_position
                list_position_grid
                label_image
                rule_id
                label_font
                label_font_size
                label_color
                label_template
                label
            }
        }
        page_info {
            total_pages
        }
        total_count
    }
}`

const Category = props => {
    const { id, pageSize } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const sortProps = useSort();
    const [currentSort] = sortProps;

    // Keep track of the sort criteria so we can tell when they change.
    const previousSort = useRef(currentSort);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_CATEGORY);
    const { loading, error, data } = queryResponse;
    const { search } = useLocation();

    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    // Get "allowed" filters by intersection of schema and aggregations
    const { data: introspectionData } = useQuery(FILTER_INTROSPECTION);

    // Create a type map we can reference later to ensure we pass valid args
    // to the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size) {
            return;
        }

        const filters = getFiltersFromSearch(search);

        // Construct the filter arg object.
        const newFilters = {};
        filters.forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });

        // Use the category id for the current category page regardless of the
        // applied filters. Follow-up in PWA-404.
        newFilters['category_id'] = { eq: String(id) };

        runQuery({
            variables: {
                currentPage: Number(currentPage),
                id: Number(id),
                filters: newFilters,
                pageSize: Number(pageSize),
                sort: { [currentSort.sortAttribute]: currentSort.sortDirection }
            }
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [
        currentPage,
        currentSort,
        filterTypeMap,
        id,
        pageSize,
        runQuery,
        search
    ]);

    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (error && !loading && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, loading, setCurrentPage]);

    // Reset the current page back to one (1) when the search string, filters
    // or sort criteria change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (
            prevSearch.toString() !== nextSearch.toString() ||
            previousSort.current.sortAttribute.toString() !==
                currentSort.sortAttribute.toString() ||
            previousSort.current.sortDirection.toString() !==
                currentSort.sortDirection.toString()
        ) {
            // The search term changed.
            setCurrentPage(1);
            // And update the ref.
            previousSearch.current = search;
            previousSort.current = currentSort;
        }
    }, [currentSort, previousSearch, search, setCurrentPage]);

    if (error && currentPage === 1 && !loading) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return <div>Data Fetch Error</div>;
    }

    // Show the loading indicator until data has been fetched.
    if (totalPagesFromData === null) {
        return fullPageLoadingIndicator;
    }

    const metaDescription =
        data && data.category && data.category.meta_description
            ? data.category.meta_description
            : '';

    return (
        <Fragment>
            <Meta name="description" content={metaDescription} />
            <CategoryContent
                categoryId={id}
                classes={classes}
                data={loading ? null : data}
                pageControl={pageControl}
                sortProps={sortProps}
            />
        </Fragment>
    );
};

Category.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    id: number,
    pageSize: number
};

Category.defaultProps = {
    id: 3,
    // TODO: This can be replaced by the value from `storeConfig when the PR,
    // https://github.com/magento/graphql-ce/pull/650, is released.
    pageSize: 6
};

export default Category;