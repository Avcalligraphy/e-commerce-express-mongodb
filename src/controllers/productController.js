import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'

// function for add product
const addProduct = async (req,res) => {
    try {
        const {name, description, category, price, subCategory, sizes, bestSeller} = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'})
                return result.secure_url
            })
        )

        const productData = {
          name,
          description,
          category,
          price: Number(price),
          subCategory,
          sizes: JSON.parse(sizes),
          bestSeller: bestSeller === "true" ? true : false,
          image: imagesUrl,
          date: Date.now()
        };

        const product = new productModel(productData)
        await product.save()

        res.status(201).json({
            success: true,
            message: "Product Added"

        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message: error
        });
        
    }
}

// function for list product
const listProduct = async (req,res) => {
    try {
        const products = await productModel.find({})
        res.json({success: true, total: products.length, products})
    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: error,
        });
    }
}

// function for remove product
const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, Message: 'Product Removed' });

    } catch (error) {
        res.json({
          success: false,
          message: error,
        });
    }
}

// function for single productInfo
const singleProduct = async (req,res) => {
    try {
        const products = await productModel.findById(req.body.id)
        res.json({success: true, products})
    } catch (error) {

        res.json({
          success: false,
          message: error,
        });
        
    }
}

export {listProduct, addProduct, removeProduct, singleProduct}