import { useState } from "react";
import { Globe, Users, UserMinus, UserCheck, Lock, Settings2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type AudienceType = "public" | "friends" | "friends_except" | "specific_friends" | "private" | "custom";

const audienceOptions: { value: AudienceType; label: string; description: string; icon: React.ElementType }[] = [
  { value: "public", label: "Public", description: "Anyone on or off SocialEarn. For reels, this lets anyone use your original audio.", icon: Globe },
  { value: "friends", label: "Friends", description: "Your friends on SocialEarn.", icon: Users },
  { value: "friends_except", label: "Friends except...", description: "Don't show to some friends.", icon: UserMinus },
  { value: "specific_friends", label: "Specific friends", description: "Only show to some friends.", icon: UserCheck },
  { value: "private", label: "Only me", description: "", icon: Lock },
  { value: "custom", label: "Custom", description: "Include and exclude friends and lists.", icon: Settings2 },
];

interface AudienceSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: AudienceType;
  onChange: (value: AudienceType) => void;
}

const AudienceSelector = ({ open, onOpenChange, value, onChange }: AudienceSelectorProps) => {
  const [selected, setSelected] = useState<AudienceType>(value);

  const handleDone = () => {
    onChange(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">Update settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Who can see your future posts and reels?</p>
          <p className="text-xs text-muted-foreground">
            This will be your audience for future posts and reels, but you can always change it for a specific post or reel.
          </p>
        </div>
        <div className="space-y-1 mt-2">
          {audienceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-3 text-left transition-colors ${
                selected === opt.value ? "bg-primary/10" : "hover:bg-secondary"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                selected === opt.value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                <opt.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                {opt.description && <p className="text-xs text-muted-foreground">{opt.description}</p>}
              </div>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                selected === opt.value ? "border-primary" : "border-muted-foreground/40"
              }`}>
                {selected === opt.value && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </div>
            </button>
          ))}
        </div>
        <DialogFooter className="flex-row gap-2 justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleDone} className="gradient-earn text-primary-foreground px-6">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AudienceSelector;
