// src/components/ContactModal/ContactModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import './contact-modal.scss';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    type: 'partnership',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Формируем mailto ссылку
    const subject = encodeURIComponent(`Partnership Inquiry: ${formData.company}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Company: ${formData.company}\n` +
      `Email: ${formData.email}\n` +
      `Type: ${formData.type}\n\n` +
      `Message:\n${formData.message}`
    );

    // Симуляция отправки (в реальности можно подключить Formspree или EmailJS)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Открываем почтовый клиент
    window.location.href = `mailto:nixoffers@gmail.com?subject=${subject}&body=${body}`;

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div ref={modalRef} className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <button className="contact-modal__close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="contact-modal__header">
          <h2 className="contact-modal__title">PARTNERSHIP INQUIRY</h2>
          <p className="contact-modal__subtitle">
            Заполните форму для связи с командой NIX
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="contact-modal__form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ваше имя"
                />
              </div>
              <div className="form-group">
                <label htmlFor="company">Компания *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Название компании"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="work@company.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Тип сотрудничества</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="partnership">Партнёрство</option>
                <option value="sponsorship">Спонсорство</option>
                <option value="integration">Интеграция на стриме</option>
                <option value="tournament">Турнир / Ивент</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Сообщение *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Опишите ваш проект или предложение..."
              />
            </div>

            <button
              type="submit"
              className="contact-modal__submit interactive"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading">Отправка...</span>
              ) : (
                <span>ОТПРАВИТЬ ЗАПРОС</span>
              )}
            </button>

            <p className="contact-modal__note">
              Письмо будет отправлено на nixoffers@gmail.com
            </p>
          </form>
        ) : (
          <div className="contact-modal__success">
            <div className="success-icon">✓</div>
            <h3>Запрос отправлен!</h3>
            <p>Мы свяжемся с вами в ближайшее время</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;