import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "onboarding_done_v1";

export const Onboarding = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Быстрое знакомство</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>— Нажмите на категорию, чтобы сразу добавить задачу.</p>
          <p>— Отметьте задачу чекбоксом, чтобы выполнить.</p>
          <p>— Наведите и нажмите «Удалить», чтобы убрать задачу.</p>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={close}>Понятно</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
