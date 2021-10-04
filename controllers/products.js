const Product = require('../models/product')


exports.getAllProductsStatic = async(req, res) => {
    const products = await Product.find({
        name: 'vase table'
    })
    res.status(200).json({ msg: products, nbHits: products.length})
}

exports.getAllProducts = async(req, res) => {
    const { featured, company, name, sort, fields, numericFilters  } = req.query;

    const queryObject = {}

    if(featured) queryObject.featured = featured === 'true' ? true : false
    
    if(company) queryObject.company = company;

    if(name) queryObject.name = { $regex: name, $options: 'i' }

    const sortList = sort ? sort.split(',').join(' ') : 'createdAt'

    const fieldList = fields ? fields.split(',').join(' ') : ''

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit;

    if(numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);

        console.log(filters);
        const options = ['price', 'rating']

        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = { [operator]: Number(value) } 
            }
        })
    }
 
    console.log(queryObject)
    let result = Product.find(queryObject).sort(sortList).select(fieldList).skip(skip).limit(limit);

    const products = await result;

    res.status(200).json({ msg: products, nbHits: products.length});
}