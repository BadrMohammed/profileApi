const { getCategoryByKey } = require("../services/CategoryServices");
const { getCountryByKey } = require("../services/CountryServices");
const {
  getProductByKey,
  createProduct,
  updateProduct,
  getProducts,
} = require("../services/ProductServices");
const { getUserByKey } = require("../services/UserServices");
const {
  getWishlistByKey,
  getMultipleWishlistByKey,
} = require("../services/WishlistServices");
const { getImagePath, removeImage } = require("../utils/imageFunctions");
const responseMessage = require("../utils/responseMessage");
const validateProduct = require("../utils/validateProduct");

const getAllProducts = async (req, res) => {
  try {
    const result = await getProducts(req?.query, res.locals.language);

    let ids = result.docs.map((doc) => doc._id);
    const wishlists = await getMultipleWishlistByKey("productId", ids);

    let data = result?.docs.map((product) => {
      let category = {
        ...product.categoryId,
        image: product.categoryId?.image
          ? getImagePath(req, product.categoryId?.image)
          : null,
      };
      let images = product?.images?.length
        ? product?.images.map((img) => {
            return {
              url: getImagePath(req, img?.url),
              id: img.id,
            };
          })
        : null;
      let like = wishlists?.length
        ? wishlists.find((wh) => wh.productId.toString() === product.id)
          ? true
          : false
        : false;

      return {
        id: product._id,
        images,
        name: res.locals.language === "ar" ? product.nameAr : product.nameEn,
        description:
          res.locals.language === "ar"
            ? product.descriptionAr
            : product.descriptionEn,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        user: product.userId,
        category,
        country: product.countryId,
        color: product.color,
        price: product.price,
        oldPrice: product.oldPrice,
        specifications: product.specifications,
        quantity: product.quantity,
        like: req?.id ? like : undefined,
      };
    });
    const pagination = {
      counts: result?.counts,
      currentPage: result?.currentPage,
      perPage: result?.perPage,
      totalPages: result?.totalPages,
    };

    return res.status(200).json(responseMessage("", data, 1, pagination));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const addProduct = async (req, res) => {
  const validator = await validateProduct(req, res);

  try {
    const findUser = await getUserByKey("_id", req?.id);
    const images = [];
    if (req.files?.length) {
      req.files.map((file, index) => {
        images.push({ url: file?.filename, id: +index + 1 });
      });
    }

    let product = await createProduct(req?.body, req?.id, images);

    const result = {
      id: product.id,
      images: product?.images?.length
        ? product?.images.map((img) => {
            return {
              url: getImagePath(req, img?.url),
              id: img.id,
            };
          })
        : null,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      color: product.color,
      price: product.price,
      oldPrice: product.oldPrice,
      specifications: product.specifications,
      quantity: product.quantity,
      createdAt: product?.createdAt,
      updatedAt: product?.updatedAt,
      category: validator.findCategory
        ? {
            id: validator.findCategory._id,
            image: getImagePath(req, validator.findCategory?.image),
            name:
              res.locals.language === "ar"
                ? validator.findCategory.nameAr
                : validator.findCategory.nameEn,
            description:
              res.locals.language === "ar"
                ? validator.findCategory.descriptionAr
                : validator.findCategory.descriptionEn,
          }
        : null,
      user: {
        id: findUser?.id,
        firstName: findUser?.firstName,
        lastName: findUser?.lastName,
      },

      country: validator.findCountry
        ? {
            id: validator.findCountry._id,
            name:
              res.locals.language === "ar"
                ? validator.findCountry.nameAr
                : validator.findCountry.nameEn,
          }
        : null,
    };

    res.status(200).json(responseMessage(req.t("item-created"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const getProductById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  const result = await getProductByKey("_id", id, true);
  result.images = result?.images?.length
    ? result.images.map((img) => {
        return {
          url: getImagePath(req, img?.url),
          id: img.id,
        };
      })
    : null;

  const wishlist = await getWishlistByKey("productId", id, true);
  let findLike = wishlist
    ? wishlist.productId.toString() === id
      ? true
      : false
    : false;

  const finalResult = { ...result, like: findLike ? true : false };
  res.status(200).json(responseMessage("", finalResult, 1));
};

const editProduct = async (req, res) => {
  const { id, categoryId, countryId, price } = req.body;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  if (categoryId) {
    findCategory = await getCategoryByKey("_id", categoryId);
    if (!findCategory)
      return res
        .status(400)
        .json(responseMessage(req.t("category-not-exist"), null, 0));
  }
  if (countryId) {
    findCountry = await getCountryByKey("_id", countryId);
    if (!findCountry)
      return res
        .status(400)
        .json(responseMessage(req.t("country-not-exist"), null, 0));
  }
  try {
    const findProduct = await getProductByKey("_id", id);
    let oldPrice = price ? findProduct?.price : null;

    let images = [];
    if (req.files?.length) {
      req.files?.map((file, index) => {
        images.push({ url: file?.filename, id: +index + 1 });
      });
    }
    const mergedImages = findProduct?.images?.length
      ? [...findProduct?.images, ...images]
      : images;

    let newImages = findProduct?.images?.length
      ? mergedImages.map((file, index) => {
          return { url: file.url, id: +index + 1 };
        })
      : mergedImages;
    const result = await updateProduct(
      findProduct,
      req?.body,
      req?.id,
      newImages,
      oldPrice
    );

    result.images = result?.images?.length
      ? result?.images.map((img) => {
          return {
            url: getImagePath(req, img?.url),
            id: img.id,
          };
        })
      : null;

    res.status(200).json(responseMessage(req.t("item-updated"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const deleteImage = async (req, res) => {
  const { productId, imageId } = req?.body;
  if (!productId || !imageId)
    return res
      .status(500)
      .json(responseMessage(req.t("product-image-id-required"), null, 0));

  const findProduct = await getProductByKey("_id", productId);

  if (!findProduct)
    return res
      .status(500)
      .json(responseMessage(req.t("product-not-exist"), null, 0));

  let findImage = findProduct?.images?.length
    ? findProduct?.images.find((img) => img.id === +imageId)
    : null;
  if (!findImage)
    return res
      .status(500)
      .json(responseMessage(req.t("image-not-exist"), null, 0));

  try {
    removeImage(findImage?.url);

    let newImages = findProduct?.images?.filter((img) => img.id !== imageId);
    const result = await updateProduct(findProduct, null, req?.id, newImages);
    return res
      .status(200)
      .json(responseMessage(req.t("image-deleted-successfully"), null, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = {
  getProductById,
  addProduct,
  editProduct,
  deleteImage,
  getAllProducts,
};