const Product = require('../models/Product');
const formidable = require('formidable');
const slugify = require('slugify');
const fs = require('fs');

// revisar con el team:
// - console.logs de error
// - función category store
// - status de error y success función category.store

async function index(req, res) {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.log('[ Product Controller -> Index ] Ops, something went wrong');
    return res.status(404).json({ msg: error.message });
  }
}

async function show(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (error) {
    console.log('[ Product Controller -> Show ] Ops, something went wrong');
    return res.status(404).json({ msg: error.message });
  }
}

async function store(req, res) {
  const form = formidable({
    multiples: true,
    uploadDir: __dirname + '/../public/img',
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    const picturesArray = [];
    files.picture.newFilename
      ? picturesArray.push(files.picture.newFilename)
      : picturesArray.push(...files.picture.map((picture) => picture.newFilename));
    try {
      await Product.create({
        name: fields.name,
        description: fields.description,
        picture: picturesArray,
        price: fields.price,
        stock: fields.stock,
        category: fields.category,
        featured: fields.featured,
        slug: slugify(fields.name, { lower: true, strict: true }),
      });
      res.status(201).json({ msg: 'product successfully created' });
    } catch (error) {
      console.log('[ Product Controller -> Store ] Ops, something went wrong');
      return res.status(400).json({ msg: error.message });
    }
  });
}
async function update(req, res) {
  const form = formidable({
    multiples: true,
    uploadDir: __dirname + '/../public/img',
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    const picturesArray = [];
    files.picture.newFilename
      ? picturesArray.push(files.picture.newFilename)
      : picturesArray.push(...files.picture.map((picture) => picture.newFilename));
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        name: fields.name,
        description: fields.description,
        picture: picturesArray,
        price: fields.price,
        stock: fields.stock,
        category: fields.category,
        featured: fields.featured,
        slug: slugify(fields.name, { lower: true, strict: true }),
      });
      res.status(200).json({ msg: 'product successfully updated' });
    } catch (error) {
      console.log('[ Product Controller -> Update ] Ops, something went wrong');
      return res.status(304).json({ msg: error.message });
    }
  });
}

async function destroy(req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg: 'Product successfully deleted' });
  } catch (err) {
    console.log('[ Product Controller -> Destroy ] Ops, something went wrong');
    return res.status(404).json({ msg: err.message });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
