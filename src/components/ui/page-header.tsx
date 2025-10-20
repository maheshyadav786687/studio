
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export const PageHeader = ({ title, description, className, ...props }: PageHeaderProps) => {
  return (
    <div className={cn("py-8", className)} {...props}>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground mt-2">{description}</p>}
    </div>
  );
};
