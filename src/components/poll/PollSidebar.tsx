import { getActivePollForSidebar } from "@/app/actions/polls";
import { PollWidget } from "./PollWidget";

export async function PollSidebar() {
  const poll = await getActivePollForSidebar().catch(() => null);
  if (!poll) return null;

  return (
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
      variant="sidebar"
    />
  );
}
