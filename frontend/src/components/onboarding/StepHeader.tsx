type StepHeaderProps = {
  stepNumber: number;
  stepDescription: string;
  title: string;
};

function StepHeader({ stepNumber, stepDescription, title }: StepHeaderProps) {
  return (
    <header>
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-1">
        Étape {stepNumber} - {stepDescription}
      </p>
      <h1 className="text-2xl text-foreground">{title}</h1>
    </header>
  );
}
export default StepHeader;
