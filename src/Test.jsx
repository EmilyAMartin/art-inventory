
import React, { useState, useEffect } from 'react';

function getFormValues() {
    const storedValues = localStorage.getItem('form');
    if (!storedValues)
        return {
            email: '',
            message: '',
            name: '',
            telephone: '',
        };
    return JSON.parse(storedValues);
}

function Test() {
    const [values, setValues] = useState(getFormValues);

    useEffect(() => {
        localStorage.setItem('form', JSON.stringify(values));
    }, [values]);

    function handleSubmit(event) {
        event.preventDefault();
        alert('An error occurred on the server. Please try again!!!');
    }

    function handleChange(event) {
        setValues((previousValues) => ({
            ...previousValues,
            [event.target.name]: event.target.value,
        }));
    }

    return (

        <main>
            <form style={{ display: 'flex', flexDirection: 'column', width: 300, gap: 25 }} onSubmit={handleSubmit}>
                <label htmlFor="name">
                    Name
                    <input
                        autoComplete="off"
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Mr. Anyisob Baidoo"
                        onChange={handleChange}
                        value={values.name}
                    />

                </label>
                <label htmlFor="email">
                    Email
                    <input
                        placeholder="e.g. user.email@domain.com"
                        type="email"
                        name="email"
                        id="email"
                        onChange={handleChange}
                        value={values.email}
                    />
                </label>
                <label htmlFor="telephone">
                    Telephone
                    <input
                        type="text"
                        placeholder="e.g. +233(0)-392-498-2882"
                        name="telephone"
                        id="telephone"
                        onChange={handleChange}
                        value={values.telephone}
                    />
                </label>
                <label htmlFor="message">
                    Message
                    <textarea
                        name="message"
                        id="message"
                        value={values.message}
                        onChange={handleChange}
                    ></textarea>

                </label>
                <button type="submit">Submit</button>
            </form>
        </main>

    );
}

export default Test;
