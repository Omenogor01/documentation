const fs = require('fs');
const path = require('path');

// Paths
const categoriesPath = path.join(__dirname, '..', 'data', 'blog-categories.json');
const authorsPath = path.join(__dirname, '..', 'data', 'authors.json');
const blogCategoriesMd = path.join(__dirname, '..', 'blog', 'categories.md');
const authorsIndexMd = path.join(__dirname, '..', 'authors', 'index.md');

// Generate Category Index
function generateCategories() {
  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  let md = '# Blog Categories\n\n';
  categories.forEach(cat => {
    md += `- [${cat.name}](${cat.slug}/) - ${cat.description}\n`;
  });
  fs.writeFileSync(blogCategoriesMd, md);
  console.log('Generated blog/categories.md');
}

// Generate Author Index
function generateAuthors() {
  const authors = JSON.parse(fs.readFileSync(authorsPath, 'utf-8'));
  let md = '# Authors\n\n';
  authors.forEach(author => {
    const slug = author.name.toLowerCase().replace(/ /g, '-');
    md += `- [${author.name}](${slug}.md): ${author.bio}\n`;
  });
  fs.writeFileSync(authorsIndexMd, md);
  console.log('Generated authors/index.md');
}

generateCategories();
generateAuthors();
