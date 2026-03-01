import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe, Clock, Sparkles } from "lucide-react";

interface ReviewAudienceModalProps {
  open: boolean;
  onContinue: () => void;
}

const ReviewAudienceModal = ({ open, onContinue }: ReviewAudienceModalProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={e => e.preventDefault()}>
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">Review audience</h2>
          <div className="flex justify-center">
            <div className="h-28 w-40 flex items-center justify-center text-6xl">🎬</div>
          </div>
          <p className="text-base font-semibold text-foreground">
            Choose who can see this and future posts and reels
          </p>
          <div className="space-y-4 text-left">
            <div className="flex gap-3 items-start">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Globe className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">All video posts are now reels</p>
                <p className="text-xs text-muted-foreground">Reels will now share the same default audience as posts. You can always change it for a specific post or reel.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Reels can now be longer</p>
                <p className="text-xs text-muted-foreground">Don't worry about length – reels can be as long or short as you want.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">More editing options</p>
                <p className="text-xs text-muted-foreground">Enhance your reels with intuitive editing tools, effects, music options and more.</p>
              </div>
            </div>
          </div>
          <Button onClick={onContinue} className="w-full bg-primary text-primary-foreground h-11 text-base font-semibold">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewAudienceModal;
