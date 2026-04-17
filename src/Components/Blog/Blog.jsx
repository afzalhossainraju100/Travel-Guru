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