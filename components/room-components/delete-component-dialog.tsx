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

interface DeleteComponentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  componentName: string;
}

export function DeleteComponentDialog({
  isOpen,
  onClose,
  onConfirm,
  componentName,
}: DeleteComponentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Component
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{componentName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
