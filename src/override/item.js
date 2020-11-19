import React, { useRef, useEffect } from 'react';
import { string, number, shape } from 'prop-types';
import { Link, resourceUrl } from '@magento/venia-drivers';
import { Price } from '@magento/peregrine';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from '@magento/venia-ui/lib/components/Gallery/item.css';
import Label from '../components/Label';
//import { useLabelDetails } from '../talons/useLabelDetails'
import { DEFAULT_WIDTH_TO_HEIGHT_RATIO } from '@magento/venia-ui/lib/util/images';


// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 840);

const ItemPlaceholder = ({ classes }) => (
    <div className={classes.root_pending}>
        <div className={classes.images_pending}>
            <Image
                alt="Placeholder for gallery item image"
                classes={{
                    image: classes.image_pending,
                    root: classes.imageContainer
                }}
                src={transparentPlaceholder}
            />
        </div>
        <div className={classes.name_pending} />
        <div className={classes.price_pending} />
    </div>
);

const max_width = 459 //max-width of each gallery item

const GalleryItem = props => {
    const { item } = props;
    const labelData = props.item.mp_label_data
  /*  const { labelData, labelLoading, derivedErrorMessage } = useLabelDetails({
        urlKey: props.item.url_key
    }) */
    const classes = mergeClasses(defaultClasses, props.classes);

    if (!item) {
        return <ItemPlaceholder classes={classes} />;
    }

    const width = max_width

    const { name, price, small_image, url_key, url_suffix } = item;
    const productLink = resourceUrl(`/${url_key}${url_suffix}`);
    return (
        <div className={classes.root}>
            <Link to={productLink} className={classes.images} style={{position: 'relative'}}>
                <Label labelData={labelData} width={width} height={width/DEFAULT_WIDTH_TO_HEIGHT_RATIO}/>
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    resource={small_image}
                    widths={IMAGE_WIDTHS}
                    url_key={url_key}
                />
            </Link>
            <Link to={productLink} className={classes.name}>
                <span>{name}</span>
            </Link>
            <div className={classes.price}>
                <Price
                    value={price.regularPrice.amount.value}
                    currencyCode={price.regularPrice.amount.currency}
                />
            </div>
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageContainer: string,
        imagePlaceholder: string,
        image_pending: string,
        images: string,
        images_pending: string,
        name: string,
        name_pending: string,
        price: string,
        price_pending: string,
        root: string,
        root_pending: string
    }),
    item: shape({
        id: number.isRequired,
        name: string.isRequired,
        small_image: string.isRequired,
        url_key: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    })
};

export default GalleryItem;
