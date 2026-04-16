export function findCategoryBySlug(categories, slug) {
  return categories.find((item) => item.slug === slug);
}

export function buildProjectPath(project) {
  return `/du-an/${project.category?.slug || 'du-an'}/${project.slug}`;
}

export function buildBlogPath(post) {
  return `/blog/${post.category?.slug || 'blog'}/${post.slug}`;
}
