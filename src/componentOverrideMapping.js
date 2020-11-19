/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
	[`@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js`]: '@simicart/label/src/override/productFullDetail.js',
	[`@magento/venia-ui/lib/components/ProductImageCarousel/carousel.js`]: '@simicart/label/src/override/carousel.js',
	[`@magento/venia-ui/lib/components/Gallery/item.js`]: '@simicart/label/src/override/item.js',
	[`@magento/venia-ui/lib/RootComponents/Category/category.js`]: '@simicart/label/src/override/RootComponents/Category/category.js',
	[`@magento/venia-ui/lib/RootComponents/Product/product.js`]: '@simicart/label/src/override/RootComponents/Product/product.js',
};
