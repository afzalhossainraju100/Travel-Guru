import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { updateBookingById } from "../../services/bookingService";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [invoice, setInvoice] = useState(null);
  const booking = location.state?.booking;
  const supportContactNumber = "+880 1516503901";

  const bdtFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });

  if (!booking) {
    return (
      <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-cyan-100 bg-white/90 p-8 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800">
            Payment Not Found
          </h1>
          <p className="mt-3 text-slate-600">
            No booking is ready for payment.
          </p>
          <Link
            to="/packages"
            className="mt-6 inline-block rounded-lg bg-cyan-900 px-5 py-2.5 font-semibold text-white hover:bg-cyan-800"
          >
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  const travelers = booking.numberOfTravelers || 1;
  const totalPrice = booking.totalPrice || 0;
  const perPerson =
    booking.packagePrice || (travelers ? totalPrice / travelers : 0);

  const getTransportSource = (transport, fallbackLocation) => {
    if (!transport) return fallbackLocation || "Will be shared by our team";
    if (typeof transport === "string") return transport;

    return (
      transport.pickupFrom ||
      transport.departure ||
      transport.pickupPoint ||
      fallbackLocation ||
      "Will be shared by our team"
    );
  };

  const transportSource = getTransportSource(
    booking.packageTransport,
    booking.packageLocation,
  );

  const handleCompletePayment = async () => {
    if (!booking?._id || submitting) return;

    try {
      setSubmitting(true);
      setPaymentError("");

      const paidAt = new Date().toISOString();
      const transactionId = `TXN_${Date.now()}`;
      const invoiceNumber = `INV-${Date.now()}`;

      const generatedInvoice = {
        invoiceNumber,
        transactionId,
        issuedAt: paidAt,
        billedTo: booking.userName || "Guest User",
        packageName: booking.packageName,
        location: booking.packageLocation || "Not set",
        transportSource,
        supportContactNumber,
        userPhoneNumber: booking.userPhoneNumber || "Not provided",
        travelDate: booking.travelDate || "Not selected",
        numberOfTravelers: travelers,
        perPerson,
        totalPrice,
      };

      await updateBookingById(booking._id, {
        paymentStatus: "paid",
        transactionId,
        paidAt,
        invoice: generatedInvoice,
      });

      setInvoice(generatedInvoice);
      setIsPaid(true);
    } catch (error) {
      setIsPaid(false);
      setPaymentError(error?.message || "Payment could not be completed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToBookings = () => {
    navigate("/booking");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl border border-cyan-100 bg-white/95 p-6 shadow-xl md:p-10">
        <h1 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
          Payment
        </h1>
        <p className="mt-2 text-slate-600">
          Confirm your booking payment and get an invoice with travel details.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50/60">
            <img
              src={booking.packageImage}
              alt={booking.packageName}
              className="h-64 w-full object-cover"
            />
            <div className="p-5">
              <h2 className="text-2xl font-bold text-slate-800">
                {booking.packageName}
              </h2>
              <p className="mt-1 text-slate-600">{booking.packageLocation}</p>
              <p className="mt-2 text-slate-700">
                Travel date:{" "}
                <span className="font-semibold">
                  {booking.travelDate || "Not selected"}
                </span>
              </p>
              <p className="mt-3 text-slate-700">
                Traveler count:{" "}
                <span className="font-semibold">{travelers}</span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800">
              Payment Summary
            </h3>
            <div className="mt-4 rounded-lg border border-cyan-100 bg-cyan-50 p-3 text-sm text-slate-700">
              <p className="mt-1">
                You are paying for{" "}
                <span className="font-semibold">{booking.packageName}</span>{" "}
                tour confirmation.
              </p>
              <p className="mt-1">
                Location:{" "}
                <span className="font-semibold">
                  {booking.packageLocation || "Not set"}
                </span>
              </p>
              <p className="mt-1">
                Number of travelers:{" "}
                <span className="font-semibold">{travelers}</span>
              </p>
              <p className="mt-1">
                Transport pickup from:{" "}
                <span className="font-semibold">{transportSource}</span>
              </p>
              <p className="mt-1">
                Our contact number:{" "}
                <span className="font-semibold">{supportContactNumber}</span>
              </p>
            </div>
            <div className="mt-4 space-y-3 text-slate-700">
              <div className="flex items-center justify-between">
                <span>Per person</span>
                <span className="font-semibold">
                  {bdtFormatter.format(perPerson)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Travelers</span>
                <span className="font-semibold">{travelers}</span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-emerald-700">
                  {bdtFormatter.format(totalPrice)}
                </span>
              </div>
            </div>

            {paymentError ? (
              <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                {paymentError}
              </p>
            ) : null}

            {isPaid ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-emerald-50 p-4 text-center font-semibold text-emerald-700">
                  Payment completed successfully.
                </div>
                {invoice ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 text-sm text-slate-700">
                    <h4 className="text-base font-bold text-slate-800">
                      Invoice
                    </h4>
                    <p className="mt-2">
                      Invoice No:{" "}
                      <span className="font-semibold">
                        {invoice.invoiceNumber}
                      </span>
                    </p>
                    <p>
                      Transaction ID:{" "}
                      <span className="font-semibold">
                        {invoice.transactionId}
                      </span>
                    </p>
                    <p>
                      Issued At:{" "}
                      <span className="font-semibold">
                        {new Date(invoice.issuedAt).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Billed To:{" "}
                      <span className="font-semibold">{invoice.billedTo}</span>
                    </p>
                    <p>
                      Location:{" "}
                      <span className="font-semibold">{invoice.location}</span>
                    </p>
                    <p>
                      Travel Date:{" "}
                      <span className="font-semibold">
                        {invoice.travelDate}
                      </span>
                    </p>
                    <p>
                      Number of Travelers:{" "}
                      <span className="font-semibold">
                        {invoice.numberOfTravelers}
                      </span>
                    </p>
                    <p>
                      Transport Pickup From:{" "}
                      <span className="font-semibold">
                        {invoice.transportSource}
                      </span>
                    </p>
                    <p>
                      Your Phone Number:{" "}
                      <span className="font-semibold">
                        {invoice.userPhoneNumber}
                      </span>
                    </p>
                    <p>
                      Support Contact:{" "}
                      <span className="font-semibold">
                        {invoice.supportContactNumber}
                      </span>
                    </p>
                    <p className="mt-2 text-base">
                      Amount Paid:{" "}
                      <span className="font-bold text-emerald-700">
                        {bdtFormatter.format(invoice.totalPrice)}
                      </span>
                    </p>
                  </div>
                ) : null}

                <button
                  onClick={handleGoToBookings}
                  className="w-full rounded-lg bg-cyan-900 px-5 py-3 font-semibold text-white hover:bg-cyan-800"
                >
                  Go to Booking List
                </button>
              </div>
            ) : (
              <button
                onClick={handleCompletePayment}
                className="mt-6 w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={submitting}
              >
                {submitting ? "Processing Payment..." : "Complete Payment"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
