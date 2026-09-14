import toast from "react-hot-toast";

export const copyRsvpLink = async (token: string) => {
  try {
    await navigator.clipboard.writeText(
      `${window.location.origin}/rsvp/${token}`,
    );
    toast.success("RSVP link copied");
  } catch {
    toast.error("Couldn't copy the link");
  }
};
