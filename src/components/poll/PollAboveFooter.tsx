import { getActivePollForAboveFooter } from "@/app/actions/polls";
import { PollWidget } from "./PollWidget";

export async function PollAboveFooter() {
  const poll = await getActivePollForAboveFooter().catch(() => null);
  if (!poll) return null;

  return (
    <section className="border-t border-vp-border bg-vp-bg">
      <div className="max-w-screen-xl mx-auto px-4 py-8 md:px-8">
        <PollWidget
          poll={{
            id: poll.id,
            question: poll.question,
            totalVotes: poll.totalVotes,
            showResults: poll.showResults,
            expiresAt: poll.expiresAt?.toISOString() ?? null,
            maxVotes: poll.maxVotes,
            options: poll.options,
          }}
          variant="above_footer"
        />
      </div>
    </section>
  );
}
