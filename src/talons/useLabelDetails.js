import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

const GET_LABEL_DETAILS_BY_URL = gql`
	query productDetail($urlKey: String!) {
    productDetail: products(filter: { url_key: { eq: $urlKey } }) {
        items {
            __typename
            id
            sku
            type_id
            name
            meta_title
            meta_description
            rating_summary
            review_count
                  mp_label_data {
              rule_id
              name
              enabled
              store_ids
              customer_group_ids
              priority
              label_template
              label_image
              label
              label_font
              label_font_size
              label_color
              label_css
              label_position
              label_position_grid
              same
              list_template
              list_image
              list_label
              list_font
              list_font_size
              list_color
              list_css
              list_position
              list_position_grid
              conditions_serialized
              bestseller
              limit
              stop_process
            }
        }
    }
}
`;

export const useLabelDetails = props => {
   const { urlKey } = props
   //get label Details useQuery
   const {
       data: labelData,
       loading: labelLoading,
       error: labelError
   } = useQuery(GET_LABEL_DETAILS_BY_URL, {
       variables: {
           urlKey: urlKey
       }
   });
 
   let derivedErrorMessage;
   if (labelError) {
       const errorTarget = labelError;
       if (errorTarget.graphQLErrors) {
           // Apollo prepends "GraphQL Error:" onto the message,
           // which we don't want to show to an end user.
           // Build up the error message manually without the prepended text.
           derivedErrorMessage = errorTarget.graphQLErrors
               .map(({ message }) => message)
               .join(', ');
       } else {
           // A non-GraphQL error occurred.
           derivedErrorMessage = errorTarget.message;
       }
   }
 
   return {
       labelData,
       labelLoading,
       derivedErrorMessage
   }
}
