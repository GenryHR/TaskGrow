import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/hooks/useTasks";

export const TaskModal = ({
  open,
  onOpenChange,
  category,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  category: Category;
  onCreate: (title: string) => void;
}) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (open) setTitle("");
  }, [open]);

  const submit = () => {
    if (!title.trim()) return;
    onCreate(title.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Новая задача — {LABELS[category]}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Что нужно сделать?"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button onClick={submit}>Добавить</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const LABELS: Record<Category, string> = {
  today: "Сегодня",
  tomorrow: "Завтра",
  week: "Неделя",
  someday: "Когда-нибудь",
};
