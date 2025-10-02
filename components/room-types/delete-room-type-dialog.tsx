"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteRoomTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roomTypeName: string;
}

export function DeleteRoomTypeDialog({
  isOpen,
  onClose,
  onConfirm,
  roomTypeName,
}: DeleteRoomTypeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Room Type
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{roomTypeName}</strong>? This action cannot be undone and will remove all associated data including images.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete Room Type
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
