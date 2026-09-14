import toast from "react-hot-toast";

// The URL comes from the backend so it matches the link in the WhatsApp message
export const copyRsvpLink = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    toast.success("RSVP link copied");
  } catch {
    toast.error("Couldn't copy the link");
  }
};
