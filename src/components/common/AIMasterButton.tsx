import { useNavigate, useParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const AIMasterButton = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => navigate(`/dashboard/${projectId}/ai-master`)}
      className="gap-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-700 hover:via-orange-700 hover:to-red-700 text-white shadow-lg shadow-red-500/25 border-0"
    >
      <Sparkles className="h-4 w-4" />
      AI Master
    </Button>
  );
};

export default AIMasterButton;
