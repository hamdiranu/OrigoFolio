import { techMarquee } from "@/constants";

const TechMarqueeItem = ({ label }: { label: string }) => (
  <div className="flex-none flex-center px-6 md:px-8">
    <p className="text-white-50 md:text-2xl text-lg font-semibold whitespace-nowrap">
      {label}
    </p>
  </div>
);

const LogoShowcase = () => (
  <div className="md:my-20 my-10 relative">
    <div className="gradient-edge" />
    <div className="gradient-edge" />

    <div className="marquee h-32">
      <div className="marquee-box md:gap-12 gap-5">
        {techMarquee.map((label, index) => (
          <TechMarqueeItem key={`a-${index}`} label={label} />
        ))}

        {techMarquee.map((label, index) => (
          <TechMarqueeItem key={`b-${index}`} label={label} />
        ))}
      </div>
    </div>
  </div>
);

export default LogoShowcase;
