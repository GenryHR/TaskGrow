import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/hooks/useTasks";
import { useI18n } from "@/components/i18n/I18nProvider";

export type EditingPayload = { id: string; title: string; category: Category };

export const TaskModal = ({
  open,
  onOpenChange,
  category,
  onCreate,
  editing,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  category: Category;
  onCreate?: (title: string, category: Category) => void;
  editing?: EditingPayload | null;
  onUpdate?: (id: string, payload: { title: string; category: Category }) => void;
}) => {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState<Category>(category);

  useEffect(() => {
    if (open) {
      if (editing) {
        setTitle(editing.title);
        setCat(editing.category);
      } else {
        setTitle("");
        setCat(category);
      }
    }
  }, [open, editing, category]);

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    if (editing && onUpdate) {
      onUpdate(editing.id, { title: trimmed, category: cat });
    } else if (onCreate) {
      onCreate(trimmed, cat);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? t("editTask") : `${t("newTask")} — ${LABELS[cat]}`}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("taskPlaceholder")}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />

          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground shrink-0">{t("category")}</span>
            <Select value={cat} onValueChange={(v) => setCat(v as Category)}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(LABELS) as Category[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={submit}>{editing ? t("save") : t("addTask")}</Button>
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
