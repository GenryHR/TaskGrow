import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category, Priority } from "@/hooks/useTasks";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

export type EditingPayload = { id: string; title: string; category: Category; description?: string; priority: Priority; dueDate?: string };

export const TaskModal = ({
  open,
  onOpenChange,
  category,
  onCreate,
  editing,
  onUpdate,
  isTrashMode = false,
  onRestore,
  onPermanentDelete,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  category: Category;
  onCreate?: (payload: { title: string; category: Category; description?: string; priority: Priority; dueDate?: string }) => void;
  editing?: EditingPayload | null;
  onUpdate?: (id: string, payload: { title: string; category: Category; description?: string; priority: Priority; dueDate?: string }) => void;
  isTrashMode?: boolean;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
}) => {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [cat, setCat] = useState<Category>(category);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (open) {
      if (editing) {
        setTitle(editing.title);
        setDesc(editing.description || "");
        setPriority(editing.priority || "medium");
        setCat(editing.category);
        setDate(editing.dueDate ? new Date(editing.dueDate) : undefined);
      } else {
        setTitle("");
        setDesc("");
        setPriority("medium");
        setCat(category);
        setDate(undefined);
      }
    }
  }, [open, editing, category]);

  const submit = () => {
    try {
      const trimmed = title.trim();
      if (!trimmed) return;
      const payload = {
        title: trimmed,
        category: cat,
        description: desc.trim() || undefined,
        priority,
        dueDate: date ? format(date, "yyyy-MM-dd") : undefined,
      };
      if (editing && onUpdate) {
        onUpdate(editing.id, payload);
      } else if (onCreate) {
        onCreate(payload);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
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

          <Textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Описание (необязательно)"
          />

          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground shrink-0">Приоритет</span>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Низкий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground shrink-0">Категория</span>
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <CalendarIcon className="mr-2 h-4 w-4" /> {date ? format(date, "dd.MM.yyyy") : "Выбрать дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      if (d) setCat("someday");
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {date && (
                <Button variant="ghost" size="icon" onClick={() => setDate(undefined)} aria-label="Очистить дату">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              При выборе даты задача добавится в «Когда-нибудь» и будет автоматически перемещаться по мере приближения даты.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            {isTrashMode ? (
              <>
                <Button onClick={onRestore} className="hover-scale">
                  Восстановить
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={onPermanentDelete}
                  className="hover-scale"
                >
                  Удалить навсегда
                </Button>
              </>
            ) : (
              <Button onClick={submit}>{editing ? t("save") : t("addTask")}</Button>
            )}
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
