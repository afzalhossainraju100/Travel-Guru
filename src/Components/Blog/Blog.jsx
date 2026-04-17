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