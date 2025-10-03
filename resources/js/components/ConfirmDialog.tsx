// src/components/ConfirmDialog.tsx
import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type ConfirmDialogProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /**
   * Called when user confirms. Can be async.
   * If it returns/throws, the dialog will close only after the promise resolves.
   */
  onConfirm: () => void | Promise<void>;
  /**
   * Optional trigger element. If not provided you can render children and control the dialog via ref.
   */
  trigger?: React.ReactNode;
  /**
   * Controlled open state (optional)
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Optional className for the confirm button
   */
  confirmClassName?: string;
  children?: React.ReactNode; // alternative to trigger prop
};

export default function ConfirmDialog({
  title = "Are you sure?",
  description,
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  onConfirm,
  trigger,
  children,
  open,
  onOpenChange,
  confirmClassName,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // choose controlled or uncontrolled open state
  const isControlled = typeof open === "boolean";
  const dialogOpen = isControlled ? open! : internalOpen;
  const setOpen = (v: boolean) => {
    if (isControlled) {
      onOpenChange?.(v);
    } else {
      setInternalOpen(v);
      onOpenChange?.(v);
    }
  };

  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirm();
      // close after success
      setOpen(false);
    } catch (e) {
      // keep dialog open on error if you prefer; you can also close
      // optionally rethrow or show toast (caller can handle)
      setOpen(false); // close by default - change if you want to keep open
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setOpen}>
      {/* Trigger: allow either trigger prop or children as trigger */}
      {trigger ? (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      ) : children ? (
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      ) : null}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
                // call confirm handler
                void handleConfirm();
              }}
              disabled={loading}
              className={confirmClassName}
            >
              {loading ? `${confirmLabel}...` : confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
