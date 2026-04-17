import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import {
  getAllBookings,
  getBookingsByUser,
  removeBookingForUser,
} from "../../services/bookingService";
import { fetchUserByEmail } from "../../services/userService";
import {
  getWishlistByUser,
  removeWishlistForUser,
} from "../../services/wishlistService";

const Booking = () => {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const userIdentifier = user?.email || user?.uid;
  const [viewerRole, setViewerRole] = useState("user");
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingToDelete, setBookingToDelete] = useState(null);