import axios from 'axios';
import React, { useState } from 'react';
import './contactus.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        telephone: '',
        subject: '',
        contactMethod: '',
        enquiry: ''
    });
    const [submitStatus, setSubmitStatus] = useState({ loading: false, success: false, error: null });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ loading: true, success: false, error: null });

        try {
            await axios.post('http://localhost:5000/api/contact', formData);
            setSubmitStatus({ loading: false, success: true, error: null });
            setFormData({
                name: '',
                company: '',
                email: '',
                telephone: '',
                subject: '',
                contactMethod: '',
                enquiry: ''
            });
        } catch (error) {
            setSubmitStatus({ 
                loading: false, 
                success: false, 
                error: 'Failed to send message. Please try again later.'
            });
        }
    };

    if (submitStatus.success) {
        return <p className="success-message">Thanks for your submission! We'll get back to you soon.</p>;
    }

    return (
        <div className='contact-container'>
            <div className='contact-info'>
                <h2>Contact Us</h2>
                <div className='company-details'>
                    <h3>Larry's Diesel and Repair</h3>
                    <p>260 N Industrial Drive</p>
                    <p>Pittsburg, KS 66762</p>
                    <p><strong>Phone:</strong> (620) 231-5420</p>
                    
                    <div className='email-section'>
                        <p><strong>Sales:</strong></p>
                        <p>Dennis <a href="mailto:Dennis.B@larrysdiesel.com">Dennis.B@larrysdiesel.com</a></p>
                        <p>Larry <a href="mailto:Larry.R@larrysdiesel.com">Larry.R@larrysdiesel.com</a></p>
                        
                        <p><strong>Service:</strong></p>
                        <p>Herb <a href="mailto:Herb.S@larrysdiesel.com">Herb.S@larrysdiesel.com</a></p>
                        <p>Justin <a href="mailto:Justin.S@larrysdiesel.com">Justin.S@larrysdiesel.com</a></p>
                        
                        <p><strong>Parts:</strong></p>
                        <p>BJ <a href="mailto:BJParadee@larrysdiesel.com">BJParadee@larrysdiesel.com</a></p>
                        
                        <p><strong>Office:</strong></p>
                        <p>Paula <a href="mailto:PaulaJean@ckt.net">PaulaJean@ckt.net</a></p>
                        <p>Donya <a href="mailto:DonyaMurray@hotmail.com">DonyaMurray@hotmail.com</a></p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className='contact-form'>
                <div className='row mb-3'>
                    <div className='col-md-6'>
                        <label htmlFor="name" className='form-label'>Name *</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            className='form-control'
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="company" className='form-label'>Company</label>
                        <input
                            id="company"
                            type="text"
                            name="company"
                            className='form-control'
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-md-6'>
                        <label htmlFor="email" className='form-label'>Email *</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className='form-control'
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="telephone" className='form-label'>Telephone *</label>
                        <input
                            id="telephone"
                            type="tel"
                            name="telephone"
                            className='form-control'
                            required
                            value={formData.telephone}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='mb-3'>
                    <label htmlFor="subject" className='form-label'>Subject *</label>
                    <select 
                        id="subject" 
                        name="subject" 
                        className='form-select' 
                        required
                        value={formData.subject}
                        onChange={handleChange}
                    >
                        <option value="">Please Select</option>
                        <option value="general">General Inquiry</option>
                        <option value="parts">Parts</option>
                        <option value="sales">Sales</option>
                        <option value="repair">Repair</option>
                    </select>
                </div>
                <div className='mb-3'>
                    <label htmlFor="contactMethod" className='form-label'>Preferred Method of Contact *</label>
                    <select 
                        id="contactMethod" 
                        name="contactMethod" 
                        className='form-select' 
                        required
                        value={formData.contactMethod}
                        onChange={handleChange}
                    >
                        <option value="">Please Select</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone Call</option>
                        <option value="text">Text Message</option>
                    </select>
                </div>
                <div className='mb-3'>
                    <label htmlFor="enquiry" className='form-label'>Enquiry *</label>
                    <textarea
                        id="enquiry"
                        name="enquiry"
                        className='form-control'
                        rows="5"
                        required
                        value={formData.enquiry}
                        onChange={handleChange}
                    />
                </div>
                {submitStatus.error && (
                    <div className="alert alert-danger" role="alert">
                        {submitStatus.error}
                    </div>
                )}
                <button 
                    type="submit" 
                    className='btn btn-success'
                    disabled={submitStatus.loading}
                >
                    {submitStatus.loading ? 'Sending...' : 'Submit Inquiry Form'}
                </button>
            </form>
        </div>
    );
};

export default ContactUs;