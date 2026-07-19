import { InterviewPrepPage } from "@/components/interview-prep/InterviewPrepPage";

export default async function ApplicationInterviewPrepRoute({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  return (
    <div className="min-h-screen w-full px-4 pt-10 lg:px-6">
      <InterviewPrepPage applicationId={applicationId} />
    </div>
  );
}
