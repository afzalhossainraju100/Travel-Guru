import React from "react";
import { useLoaderData } from "react-router-dom";

const getIdValue = (idValue, fallbackIndex) => {
  if (typeof idValue === "string" || typeof idValue === "number") {
    return String(idValue);
  }

  if (idValue && typeof idValue === "object") {
    if (typeof idValue.$oid === "string") {
      return idValue.$oid;
    }

    if (typeof idValue.toString === "function") {
      const parsed = idValue.toString();
      if (parsed && parsed !== "[object Object]") {
        return parsed;
      }
    }
  }

  return `blog-${fallbackIndex}`;
};

const getVideoUrl = (blog = {}) =>
  blog.videoUrl ||
  blog.videoURL ||
  blog.video ||
  blog.embedUrl ||
  blog.url ||
  "";

const getEmbedUrl = (url = "") => {
  if (!url || typeof url !== "string") {
    return "";
  }

  const trimmed = url.trim();

  if (trimmed.includes("youtube.com/embed/")) {
    return trimmed;
  }

  if (trimmed.includes("youtube.com/watch")) {
    const parsedUrl = new URL(trimmed);
    const videoId = parsedUrl.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  }

  if (trimmed.includes("youtu.be/")) {
    const parsedUrl = new URL(trimmed);
    const videoId = parsedUrl.pathname.replace("/", "");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  }

  if (trimmed.includes("youtube.com/shorts/")) {
    const parsedUrl = new URL(trimmed);
    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    const videoId = parts[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  }

  if (trimmed.includes("vimeo.com/")) {
    const parsedUrl = new URL(trimmed);
    const videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : "";
  }

  return "";
};

const isDirectVideoFile = (url = "") => {
  if (!url || typeof url !== "string") {
    return false;
  }

  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url.trim());
};

const normalizeBlogs = (blogs) => {
  if (!Array.isArray(blogs)) {
    return [];
  }

  return blogs
    .map((blog, index) => {
      const videoUrl = getVideoUrl(blog);
      return {
        id: getIdValue(blog?._id || blog?.id, index),
        title: blog?.title || blog?.name || "Untitled Video",
        description:
          blog?.description || blog?.summary || "No description available.",
        author: blog?.author || blog?.authorName || "Travel Guru Team",
        category: blog?.category || "Travel",
        publishedAt: blog?.publishedAt || blog?.date || null,
        location: blog?.location || "Bangladesh",
        duration: blog?.duration || "N/A",
        videoUrl,
        embedUrl: getEmbedUrl(videoUrl),
        isDirectFile: isDirectVideoFile(videoUrl),
      };
    })
    .filter((blog) => Boolean(blog.videoUrl));
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Recently published";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Recently published";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const Blog = () => {
  const loaderBlogs = useLoaderData();
  const blogs = normalizeBlogs(loaderBlogs);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-cyan-50 via-white to-sky-100 py-10 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-200 blur-3xl" />
        <div className="absolute -right-16 bottom-4 h-72 w-72 rounded-full bg-sky-200 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <p className="text-xs font-bold tracking-[0.24em] text-cyan-800 uppercase">
            Travel Guru Blog
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">
            Video Stories For Every Visitor
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Explore all travel videos, tips, and destination highlights. This
            blog is visible to everyone, including guests and logged-in users.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-cyan-200/70 bg-white/80 p-8 text-center shadow-md backdrop-blur-sm">
            <h2 className="text-xl font-bold text-slate-900">
              No Videos Found
            </h2>
            <p className="mt-2 text-slate-600">
              Blog data loaded successfully, but there are no video URLs in the
              current API response.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="group overflow-hidden rounded-2xl border border-cyan-100/80 bg-white/90 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-video w-full overflow-hidden bg-black">
                  {blog.embedUrl && !blog.isDirectFile ? (
                    <iframe
                      src={blog.embedUrl}
                      title={blog.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={blog.videoUrl}
                      controls
                      preload="metadata"
                      className="h-full w-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>

                <div className="space-y-3 p-5 sm:p-6">
                  <span className="inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-900 uppercase">
                    {blog.category}
                  </span>
                  <h2 className="line-clamp-2 text-xl font-bold text-slate-900">
                    {blog.title}
                  </h2>
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {blog.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-cyan-100 pt-3 text-xs font-semibold text-slate-500 sm:text-sm">
                    <span>{blog.author}</span>
                    <span>{blog.duration}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 sm:text-sm">
                    <span>{blog.location}</span>
                    <span>{formatDate(blog.publishedAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;