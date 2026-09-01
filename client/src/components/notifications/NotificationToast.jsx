import { CheckCircle2, Navigation, Wrench, MapPin, XCircle } from "lucide-react";

const NotificationToast = ({ notification, onClose }) => {
  if (!notification) return null;

  const config = {
    accepted: {
      icon: <CheckCircle2 size={20} />,
      title: "Request accepted",
      message: "Your mechanic has accepted your request.",
    },

    on_the_way: {
      icon: <Navigation size={20} />,
      title: "Mechanic is on the way",
      message: "Your mechanic is travelling to your location.",
    },

    arrived: {
      icon: <MapPin size={20} />,
      title: "Mechanic has arrived",
      message: "Your mechanic has reached your location.",
    },

    in_progress: {
      icon: <Wrench size={20} />,
      title: "Service started",
      message: "Your mechanic is now working on your vehicle.",
    },

    completed: {
      icon: <CheckCircle2 size={20} />,
      title: "Service completed",
      message: "Your roadside assistance service is complete.",
    },

    rejected: {
      icon: <XCircle size={20} />,
      title: "Request declined",
      message: "The mechanic could not accept your request.",
    },
  };

  const current = config[notification.status];

  if (!current) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] w-[calc(100%-2rem)] max-w-sm animate-[slideIn_.3s_ease-out]">
      <div className="rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--veyra-lime)] text-[var(--veyra-ink)]">
            {current.icon}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-[var(--veyra-text)]">
              {current.title}
            </p>

            <p className="mt-1 text-xs leading-5 text-[var(--veyra-text-secondary)]">
              {current.message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-lg leading-none text-[var(--veyra-muted)] transition hover:text-[var(--veyra-text)]"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
