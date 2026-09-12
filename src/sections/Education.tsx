import GlowCard from "@/components/GlowCard";
import TitleHeader from "@/components/TitleHeader";
import { educationCards } from "@/constants";

const Education = () => {
  return (
    <section id="education" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Education & Foundations"
          sub="🎓 Where the fundamentals come from"
        />

        <div className="md:columns-2 columns-1 mt-16">
          {educationCards.map((card, index) => (
            <GlowCard key={card.institution} index={index}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold">{card.institution}</p>
                  <p className="text-white-50">{card.qualification}</p>
                  <p className="text-white-50 text-sm mt-1">
                    🗓️&nbsp;{card.date}
                  </p>
                </div>

                {/* both crests are dark artwork on a transparent background, so
                    they need a light chip to be legible on the dark card; the
                    chip clips each logo's padding to a common height */}
                <div className="bg-white rounded-lg h-16 px-4 flex-none flex items-center justify-center overflow-hidden">
                  <img
                    src={card.logoPath}
                    alt={`${card.institution} logo`}
                    className={`${card.logoHeightClass ?? "h-10"} w-auto object-contain`}
                  />
                </div>
              </div>

              <p className="text-white-50 text-lg mt-6">{card.review}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
