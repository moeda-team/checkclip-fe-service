import { redirect } from "next/navigation";

export default function StrategyPlannerRedirectPage({
  params
}: {
  params: { id: string };
}) {
  redirect(`/strategy-planner/${params.id}/detail`);
}
