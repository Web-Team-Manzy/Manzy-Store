// ...existing code replaced below...
import React, { useState } from 'react';
import { SendEmail } from '../service/callAPI';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const response = SendEmail(
        formData.name,
        formData.email,
        formData.subject,
        formData.message, 
      );
      
      toast.success('Email sent successfully!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}

      <section className="py-14 bg-gray-50">
        <div className="hero__outer flex flex-col items-center text-center py-16 z-10">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Thank you for visiting our clothing store!
          </h1>
          <p className="title_p22 mt-4 text-lg md:text-xl">
            Contact us now to learn more about our latest collections and enjoy amazing offers.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-8 justify-center items-start">
          {/* Contact Form */}
          <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-8 mb-8 lg:mb-0">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Contact Us</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="subject">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Google Map */}
          <div className="w-full lg:w-1/2">
            <iframe
              title="MyLocation"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.1571939961855!2d106.79659497594845!3d10.875646089279233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a1768e1d03%3A0x38d3ea53e0581ae0!2sHo%20Chi%20Minh%20City%20University%20of%20Science%20(Linh%20Trung%20Campus)!5e0!3m2!1sen!2s!4v1736761107876!5m2!1sen!2s"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;