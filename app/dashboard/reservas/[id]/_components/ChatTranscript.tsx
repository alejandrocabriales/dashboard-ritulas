import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Message } from "@/lib/types";

function dateLabel(current: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (current.toDateString() === today.toDateString()) {
    return "HOY";
  }

  if (current.toDateString() === yesterday.toDateString()) {
    return "AYER";
  }

  return format(current, "d MMMM yyyy", { locale: es }).toUpperCase();
}

export default function ChatTranscript({
  messages,
  customer,
}: {
  messages: Message[];
  customer: string;
}) {
  let previousRole: Message["role"] | null = null;
  let previousDate = "";

  return (
    <section className="glass-panel overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-teal-700">Chat transcript</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">{customer}</h3>
        </div>
        <p className="text-xs text-slate-500">{messages.length} messages</p>
      </div>

      <div className="chat-paper flex min-h-[72vh] flex-col gap-3 p-5 sm:p-6">
        {messages.map((message) => {
          const currentDate = new Date(message.sentAt);
          const currentDay = currentDate.toDateString();
          const firstInGroup = previousRole !== message.role;
          const shouldShowDate = previousDate !== currentDay;

          previousRole = message.role;
          previousDate = currentDay;

          if (message.role === "system") {
            return (
              <div key={message.id} className="chat-system">
                {message.body}
              </div>
            );
          }

          return (
            <div key={message.id} className="flex flex-col gap-3">
              {shouldShowDate ? <div className="chat-date">{dateLabel(currentDate)}</div> : null}
              <article
                className="chat-bubble"
                data-kind={message.role === "bot" ? "outgoing" : "incoming"}
                data-grouped={firstInGroup ? "false" : "true"}
                style={{
                  borderTopLeftRadius:
                    message.role === "customer" && firstInGroup ? "0.2rem" : undefined,
                  borderTopRightRadius:
                    message.role === "bot" && firstInGroup ? "0.2rem" : undefined,
                }}
              >
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-900">{message.body}</p>
                <div className="bubble-time">
                  <span>{format(currentDate, "HH:mm", { locale: es })}</span>
                  {message.role === "bot" ? <span className="checks">✓✓</span> : null}
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
