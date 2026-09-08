import { contactDetails, socialLinks } from "@/constants";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col justify-center">
          <a
            href={`mailto:${contactDetails.email}`}
            className="hover:text-white transition-colors"
          >
            {contactDetails.email}
          </a>
        </div>
        <div className="socials">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.name}
              className="icon"
            >
              <img src={social.imgPath} alt={social.name} />
            </a>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            © {new Date().getFullYear()} Hamdi Ranuharja. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
