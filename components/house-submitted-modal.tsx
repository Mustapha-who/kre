"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export function HouseSubmittedModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("showHouseSubmitted") === "1") {
      setOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setOpen(false);
    // Remove the query parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("showHouseSubmitted");
    router.replace(url.pathname + url.search);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          <DialogTitle className="text-xl">
            House Submitted Successfully!
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            Your house listing has been submitted and is now under review.
            <br />
            <strong>It will be reviewed and approved within 24 hours.</strong>
            <br />
            You'll receive a notification once it's live on the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={handleClose} className="w-full">
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
