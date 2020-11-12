/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
	[`@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js`]: '@simicart/label/src/override/productFullDetail.js',
	[`@magento/venia-ui/lib/components/ProductImageCarousel/carousel.js`]: '@simicart/label/src/override/carousel.js',
	[`@magento/venia-ui/lib/components/Image/image.js`]: '@simicart/label/src/override/image.js',
	[`@magento/venia-ui/lib/components/Gallery/item.js`]: '@simicart/label/src/override/item.js',
};
