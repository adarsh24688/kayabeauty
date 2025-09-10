interface GiftStepProps {
  step: number;
  text: string;
}

export function GiftStep({ step, text }: GiftStepProps) {
  return (
    <div className="flex items-center text-left">
      <div className="text-4xl text-[#BFA78A] font-bold mr-6">{step}</div>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}
