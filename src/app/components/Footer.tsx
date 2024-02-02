const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div
      className="text-gray-600 flex flex-col-reverse md:flex-row items-center justify-center md:justify-between px-4 pt-4 pb-8 bg-gray-200 text-sm md:text-md gap-4 mx-auto"
      style={{ maxWidth: "1312px" }}
    >
      <div>
        <span className="text-xs md:text-sm">
          ©{currentYear} Saturday Stats
        </span>
      </div>
      <div className="flex gap-4">
        <a href="/terms" className="hover:text-gray-600">
          Terms of Use
        </a>
        <div className="md:hidden text-gray-400">|</div>
        <a href="/contact" className="hover:text-gray-600">
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default Footer;
