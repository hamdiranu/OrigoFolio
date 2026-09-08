import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import emailjs from "@emailjs/browser";

import ContactExperience from "@/components/three/contact/ContactExperience";
import TitleHeader from "@/components/TitleHeader";
import { contactDetails } from "@/constants";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      if (!formRef.current) return;

      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );

      // Reset form and stop loading
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error); // Optional: show toast
    } finally {
      setLoading(false); // Always stop loading, even on error
    }
  };

  return (
    <section id="contact" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Get in Touch – Let’s Connect"
          sub="💬 Open to front-end roles and collaboration"
        />
        <div className="grid-12-cols mt-16">
          <div className="xl:col-span-5 flex flex-col gap-7">
            <div className="card-border rounded-xl p-10 flex flex-col gap-4">
              <a
                href={`mailto:${contactDetails.email}`}
                className="text-white-50 text-lg hover:text-white transition-colors break-all"
              >
                ✉️&nbsp;&nbsp;{contactDetails.email}
              </a>
              <a
                href={`tel:${contactDetails.phone}`}
                className="text-white-50 text-lg hover:text-white transition-colors"
              >
                📱&nbsp;&nbsp;{contactDetails.phone}
              </a>
              <a
                href={contactDetails.linkedinUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-white-50 text-lg hover:text-white transition-colors break-all"
              >
                💼&nbsp;&nbsp;{contactDetails.linkedin}
              </a>
              <p className="text-white-50 text-lg">
                🗣️&nbsp;&nbsp;{contactDetails.languages}
              </p>
            </div>

            <div className="flex-center card-border rounded-xl p-10">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-7"
              >
                <div>
                  <label htmlFor="name">Your name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What’s your good name?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What’s your email address?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can I help you?"
                    rows={5}
                    required
                  />
                </div>

                <button type="submit">
                  <div className="cta-button group">
                    <div className="bg-circle" />
                    <p className="text">
                      {loading ? "Sending..." : "Send Message"}
                    </p>
                    <div className="arrow-wrapper">
                      <img src="/images/svg/arrow-down.svg" alt="arrow" />
                    </div>
                  </div>
                </button>
              </form>
            </div>
          </div>
          <div className="xl:col-span-7 min-h-96">
            <div className="bg-[#cd7c2e] w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
              <ContactExperience />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
