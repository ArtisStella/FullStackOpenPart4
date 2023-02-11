const dummy = blogs => {
    return 1;
}

const totalLikes = blogs => {
    return blogs.length > 0 ? blogs.map(x => x.likes).reduce((sum, x) => sum + x) : 0;
}

const favouriteBlog = blogs => {
    const max = blogs.length > 0 ? blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current) : null;
    return max ? {
        title: max.title,
        author: max.author,
        likes: max.likes
    } : {};
}

const mostBlogs = blogs => {
    const mAuthor = blogs.length > 0 ? blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current) : null;
}

module.exports = {
    dummy, totalLikes, favouriteBlog
}